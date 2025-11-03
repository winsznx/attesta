/**
 * Multi-Chain Finalization Hook
 * 
 * Orchestrates the flow: ICP → Constellation → Ethereum
 * 
 * When an agreement is finalized (all parties signed):
 * 1. Validate on Constellation Metagraph
 * 2. Mint NFT certificate on Ethereum
 * 3. Update ICP with validation proof and NFT token ID
 */

import { useState, useCallback } from "react";
import { constellationClient, type ValidationRequest } from "../blockchain/constellation/client";
import { certificateNFTService, type CertificateMetadata } from "../blockchain/ethereum/nft";
import { AgreementService } from "../services/agreements";
import * as ProofVaultService from "../services/proof-vault";
import type { AgreementUI } from "../blockchain/icp/candid/agreement_manager";
import { useWallet } from "@/components/providers/WalletProvider";
import { useAccount } from "wagmi";

export interface FinalizationStatus {
  icp: "pending" | "creating_proof" | "success" | "error";
  constellation: "pending" | "validating" | "success" | "error";
  ethereum: "pending" | "minting" | "success" | "error";
  proofId?: string;
  constellationProof?: string;
  nftTokenId?: string;
  error?: string;
}

export function useMultiChainFinalization() {
  const { address, isConnected } = useWallet();
  const { connector } = useAccount();
  const [status, setStatus] = useState<FinalizationStatus>({
    icp: "pending",
    constellation: "pending",
    ethereum: "pending",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Finalize agreement across all chains
   */
  const finalizeAgreement = useCallback(
    async (agreement: AgreementUI): Promise<boolean> => {
      if (!agreement) {
        throw new Error("Agreement is required");
      }

      // Check if all parties have signed
      const allSigned =
        agreement.signatures.length === agreement.parties.length;
      if (!allSigned) {
        throw new Error("Not all parties have signed the agreement");
      }

      // Check if already finalized
      if (agreement.status === "Signed") {
        // Check if we already have constellation proof and NFT
        // If not, proceed with finalization
      }

      setIsProcessing(true);
      setStatus({
        icp: "creating_proof",
        constellation: "pending",
        ethereum: "pending",
      });

      try {
        // Step 1: Create notarization proof in ICP Proof Vault
        console.log("📝 Creating notarization proof in ICP...");
        const proofId = await ProofVaultService.createNotarizationProof(
          agreement.id,
          agreement.content_hash,
          agreement.parties.map((p) => p.toString()),
          agreement.creator.toString(),
          agreement.template_type
        );

        setStatus({
          icp: "success",
          constellation: "validating",
          ethereum: "pending",
          proofId,
        });

        // Step 2: Validate on Constellation
        const validationRequest: ValidationRequest = {
          agreement_id: agreement.id,
          content_hash: agreement.content_hash,
          parties: agreement.parties.map((p) => p.toString()),
          created_at: Number(agreement.created_at) / 1000000, // Convert from nanoseconds
          signed_at:
            agreement.signatures.length > 0
              ? Number(agreement.signatures[agreement.signatures.length - 1].signed_at) / 1000000
              : Date.now(),
          metadata: {
            template_type: agreement.template_type,
            title: agreement.title,
            creator: agreement.creator.toString(),
          },
        };

        const validationResult = await constellationClient.validateAgreement(
          validationRequest
        );

        if (!validationResult.success || !validationResult.dag_hash) {
          setStatus({
            icp: "success",
            constellation: "error",
            ethereum: "pending",
            proofId,
            error: validationResult.error || "Constellation validation failed",
          });
          setIsProcessing(false);
          return false;
        }

        // Add Constellation chain proof to ICP Proof Vault
        console.log("📝 Adding Constellation proof to Proof Vault...");
        await ProofVaultService.addChainProof(proofId, {
          chainName: "Constellation",
          txHash: validationResult.dag_hash,
          timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
        });

        setStatus({
          icp: "success",
          constellation: "success",
          ethereum: "minting",
          proofId,
          constellationProof: validationResult.dag_hash,
        });

        // Step 3: Mint NFT on Ethereum
        if (!isConnected || !address) {
          throw new Error("Wallet not connected. Please connect your wallet to mint certificate.");
        }

        // Get wallet client from connector
        const walletClient = connector ? await connector.getWalletClient() : null;
        if (!walletClient) {
          throw new Error("Could not get wallet client");
        }

        // Initialize NFT service with wallet client
        await certificateNFTService.initialize(walletClient as any);

        const certificateMetadata: CertificateMetadata = {
          name: `Agreement Certificate: ${agreement.title}`,
          description: `Blockchain certificate for ${agreement.template_type} agreement`,
          attributes: [
            {
              trait_type: "Template Type",
              value: agreement.template_type,
            },
            {
              trait_type: "Status",
              value: agreement.status,
            },
          ],
          agreement_id: agreement.id,
          content_hash: agreement.content_hash,
          constellation_dag_hash: validationResult.dag_hash,
          parties: agreement.parties.map((p) => p.toString()),
          signed_at:
            agreement.signatures.length > 0
              ? Number(agreement.signatures[agreement.signatures.length - 1].signed_at) / 1000000
              : Date.now(),
          created_at: Number(agreement.created_at) / 1000000,
        };

        const mintResult = await certificateNFTService.mintCertificate(
          certificateMetadata,
          address
        );

        if (!mintResult.success || !mintResult.tokenId) {
          setStatus({
            icp: "success",
            constellation: "success",
            ethereum: "error",
            proofId,
            constellationProof: validationResult.dag_hash,
            error: mintResult.error || "NFT minting failed",
          });
          setIsProcessing(false);
          return false;
        }

        // Add Ethereum chain proof to ICP Proof Vault
        console.log("📝 Adding Ethereum proof to Proof Vault...");
        await ProofVaultService.addChainProof(proofId, {
          chainName: "Ethereum",
          txHash: mintResult.tokenId, // Using tokenId as transaction reference
          timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
        });

        setStatus({
          icp: "success",
          constellation: "success",
          ethereum: "success",
          proofId,
          constellationProof: validationResult.dag_hash,
          nftTokenId: mintResult.tokenId,
        });

        // Step 4: Update agreement status to Signed
        await AgreementService.updateStatus(agreement.id, "Signed");

        setIsProcessing(false);
        return true;
      } catch (error) {
        console.error("Multi-chain finalization error:", error);
        setStatus({
          constellation: status.constellation,
          ethereum: status.ethereum,
          error: error instanceof Error ? error.message : "Unknown error",
        });
        setIsProcessing(false);
        return false;
      }
    },
    [address, isConnected, connector, status]
  );

  return {
    finalizeAgreement,
    status,
    isProcessing,
  };
}

