/**
 * Ethereum NFT Minting Service via Thirdweb
 * 
 * Handles ERC-721 certificate minting for finalized agreements
 */

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Ethereum } from "@thirdweb-dev/chains";
import type { Signer } from "ethers";

export interface CertificateMetadata {
  name: string;
  description: string;
  image?: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  // Multi-chain proof data
  agreement_id: string;
  content_hash: string;
  icp_canister_id?: string;
  constellation_dag_hash?: string;
  parties: string[];
  signed_at: number;
  created_at: number;
}

export interface MintResult {
  success: boolean;
  tokenId?: string;
  txHash?: string;
  error?: string;
}

/**
 * NFT Certificate Minting Service
 * 
 * Uses Thirdweb SDK to mint ERC-721 certificates on Ethereum
 */
export class CertificateNFTService {
  private sdk: ThirdwebSDK | null = null;
  private contractAddress: string;
  private chain: any;

  constructor(contractAddress?: string, chain: any = Ethereum) {
    // Contract address from environment or parameter
    this.contractAddress =
      contractAddress ||
      process.env.NEXT_PUBLIC_CERTIFICATE_NFT_CONTRACT ||
      "";
    this.chain = chain;
  }

  /**
   * Initialize Thirdweb SDK with signer
   */
  async initialize(signer: Signer): Promise<void> {
    try {
      this.sdk = await ThirdwebSDK.fromSigner(signer, this.chain);
    } catch (error) {
      console.error("Failed to initialize Thirdweb SDK:", error);
      throw error;
    }
  }

  /**
   * Mint NFT certificate for finalized agreement
   */
  async mintCertificate(
    metadata: CertificateMetadata,
    toAddress: string
  ): Promise<MintResult> {
    try {
      if (!this.sdk) {
        throw new Error("Thirdweb SDK not initialized. Call initialize() first.");
      }

      if (!this.contractAddress) {
        throw new Error("Certificate NFT contract address not configured");
      }

      // Get contract instance
      const contract = await this.sdk.getContract(this.contractAddress);

      // Prepare NFT metadata
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image || this.generateDefaultImage(),
        external_url: metadata.external_url || "",
        attributes: [
          ...metadata.attributes,
          {
            trait_type: "Agreement_ID",
            value: metadata.agreement_id,
          },
          {
            trait_type: "Content_Hash",
            value: metadata.content_hash,
          },
          {
            trait_type: "Constellation_DAG",
            value: metadata.constellation_dag_hash || "pending",
          },
          {
            trait_type: "Parties",
            value: metadata.parties.length,
          },
          {
            trait_type: "Created_At",
            display_type: "date",
            value: metadata.created_at,
          },
          {
            trait_type: "Signed_At",
            display_type: "date",
            value: metadata.signed_at,
          },
        ],
        // Store multi-chain proof data
        properties: {
          agreement_id: metadata.agreement_id,
          icp_canister_id: metadata.icp_canister_id || "",
          constellation_dag_hash: metadata.constellation_dag_hash || "",
          parties: metadata.parties,
        },
      };

      // Mint NFT
      const tx = await contract.erc721.mintTo(toAddress, nftMetadata);

      return {
        success: true,
        tokenId: tx.id.toString(),
        txHash: tx.receipt?.transactionHash || "",
      };
    } catch (error) {
      console.error("Failed to mint certificate NFT:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get certificate NFT by token ID
   */
  async getCertificate(tokenId: string): Promise<any> {
    try {
      if (!this.sdk || !this.contractAddress) {
        throw new Error("SDK or contract not initialized");
      }

      const contract = await this.sdk.getContract(this.contractAddress);
      const nft = await contract.erc721.get(tokenId);

      return nft;
    } catch (error) {
      console.error("Failed to get certificate:", error);
      return null;
    }
  }

  /**
   * Verify certificate ownership
   */
  async verifyOwnership(
    tokenId: string,
    address: string
  ): Promise<boolean> {
    try {
      if (!this.sdk || !this.contractAddress) {
        return false;
      }

      const contract = await this.sdk.getContract(this.contractAddress);
      const owner = await contract.erc721.ownerOf(tokenId);

      return owner.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error("Failed to verify ownership:", error);
      return false;
    }
  }

  /**
   * Generate default certificate image
   */
  private generateDefaultImage(): string {
    // Return a default certificate image URL
    // In production, generate a dynamic certificate image
    return "https://via.placeholder.com/512x512/9333ea/ffffff?text=Certificate";
  }
}

/**
 * Default NFT service instance
 * Must be initialized with a signer before use
 */
export const certificateNFTService = new CertificateNFTService();

