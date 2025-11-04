import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "./candid/agreement_manager";
import type { AgreementManagerActor } from "./actors";

const canisterId = process.env.NEXT_PUBLIC_AGREEMENT_MANAGER_CANISTER_ID!;
const host = process.env.NEXT_PUBLIC_ICP_HOST || "http://localhost:4943";

/**
 * Get ICP actor for canister calls
 * This version uses the generated Candid interface
 */
export async function getAgreementActor(): Promise<AgreementManagerActor> {
  const agent = new HttpAgent({ host });

  // Disable certificate validation for local development
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    try {
      await agent.fetchRootKey();
    } catch (error) {
    }
  }

  const actor = Actor.createActor<AgreementManagerActor>(idlFactory, {
    agent,
    canisterId,
  });

  return actor;
}

/**
 * Convert wallet address to Principal
 * For now, returns anonymous principal
 * TODO: Implement proper wallet-to-principal conversion
 */
export function walletToPrincipal(address: string): Principal {
  // In production, you'd derive this from wallet signature
  // For now, return the canister's principal for testing
  try {
    return Principal.fromText(canisterId);
  } catch {
    return Principal.anonymous();
  }
}

/**
 * Get user's principal from wallet
 * This is a placeholder - implement based on your auth flow
 */
export async function getUserPrincipal(): Promise<Principal> {
  // TODO: Get principal from Internet Identity or wallet signature
  // For testing, use anonymous principal
  return Principal.anonymous();
}
