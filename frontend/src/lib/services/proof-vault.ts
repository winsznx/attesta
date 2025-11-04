/**
 * Proof Vault Service
 *
 * Interacts with the ICP proof_vault canister for multi-chain notarization proofs.
 */
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "@/lib/blockchain/icp/candid/proof_vault.did.js";
import type { _SERVICE, NotarizationProof, ChainProof } from "@/lib/blockchain/icp/candid/proof_vault.did.d";

const CANISTER_ID = process.env.NEXT_PUBLIC_PROOF_VAULT_CANISTER_ID!;
const ICP_HOST = process.env.NEXT_PUBLIC_ICP_HOST || "http://localhost:4943";

/**
 * Get the Proof Vault actor
 */
export function getProofVaultActor(): _SERVICE {
  const agent = new HttpAgent({ host: ICP_HOST });

  // Fetch root key for local development
  if (ICP_HOST.includes("localhost")) {
    agent.fetchRootKey().catch(() => {});
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
  });
}

/**
 * Create a new notarization proof
 *
 * @param agreementId - ID of the agreement
 * @param contentHash - SHA-256 hash of the content
 * @param signers - List of signer principals
 * @param creator - Creator principal
 * @param templateType - Type of agreement template
 * @returns Proof ID
 */
export async function createNotarizationProof(
  agreementId: string,
  contentHash: string,
  signers: string[],
  creator: string,
  templateType: string
): Promise<string> {
  const actor = getProofVaultActor();

  const signerPrincipals = signers.map((s) => Principal.fromText(s));
  const creatorPrincipal = Principal.fromText(creator);

  const proofId = await actor.create_notarization(
    agreementId,
    contentHash,
    signerPrincipals,
    creatorPrincipal,
    templateType
  );

  return proofId;
}

/**
 * Add a chain-specific proof to an existing notarization
 *
 * @param proofId - ID of the notarization proof
 * @param chainProof - Blockchain proof details
 * @returns Success boolean
 */
export async function addChainProof(
  proofId: string,
  chainProof: {
    chainName: string;
    txHash: string;
    blockNumber?: bigint;
    timestamp: bigint;
  }
): Promise<boolean> {
  const actor = getProofVaultActor();

  const proof: ChainProof = {
    chain_name: chainProof.chainName,
    tx_hash: chainProof.txHash,
    block_number: chainProof.blockNumber ? [chainProof.blockNumber] : [],
    timestamp: chainProof.timestamp,
  };

  const success = await actor.add_chain_proof(proofId, proof);
  return success;
}

/**
 * Get a proof by its ID
 *
 * @param proofId - Proof ID
 * @returns Notarization proof or null
 */
export async function getProof(
  proofId: string
): Promise<NotarizationProof | null> {
  const actor = getProofVaultActor();
  const result = await actor.get_proof(proofId);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get a proof by agreement ID
 *
 * @param agreementId - Agreement ID
 * @returns Notarization proof or null
 */
export async function getProofByAgreement(
  agreementId: string
): Promise<NotarizationProof | null> {
  const actor = getProofVaultActor();
  const result = await actor.get_proof_by_agreement(agreementId);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get all proofs
 *
 * @returns Array of all notarization proofs
 */
export async function getAllProofs(): Promise<NotarizationProof[]> {
  const actor = getProofVaultActor();
  return await actor.get_all_proofs();
}

/**
 * Verify a proof matches a content hash
 *
 * @param proofId - Proof ID
 * @param contentHash - Expected content hash
 * @returns True if proof is valid
 */
export async function verifyProof(
  proofId: string,
  contentHash: string
): Promise<boolean> {
  const actor = getProofVaultActor();
  return await actor.verify_proof(proofId, contentHash);
}
