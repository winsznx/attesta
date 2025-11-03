/**
 * Wallet Address to ICP Principal Converter
 * 
 * Problem: Ethereum addresses (0x...) are different from ICP Principals
 * Solution: For localhost development, we'll use a deterministic mapping
 * 
 * Production options:
 * 1. Use Internet Identity (ICP's native auth)
 * 2. Use signature-based derivation
 * 3. Store mapping in canister
 */

import { Principal } from "@dfinity/principal";
import { sha256 } from "js-sha256";

/**
 * Convert Ethereum address to ICP Principal (deterministic mapping)
 * 
 * For localhost development, this creates a deterministic Principal
 * from an Ethereum address using a hash-based derivation.
 * 
 * ⚠️ NOTE: This is a development-only solution.
 * For production, use Internet Identity or proper auth.
 */
export function ethereumAddressToPrincipal(
  ethAddress: string
): Principal {
  try {
    // Remove 0x prefix if present
    const cleanAddress = ethAddress.toLowerCase().replace(/^0x/, "");

    // Hash the Ethereum address
    const hash = sha256(cleanAddress);

    // Take first 29 bytes for Principal (ICP Principal is max 29 bytes)
    const principalBytes = new Uint8Array(
      Array.from({ length: 29 }, (_, i) =>
        parseInt(hash.substring(i * 2, i * 2 + 2), 16)
      )
    );

    // Create Principal from bytes
    return Principal.fromUint8Array(principalBytes);
  } catch (error) {
    console.error("Failed to convert Ethereum address to Principal:", error);
    // Fallback to anonymous
    return Principal.anonymous();
  }
}

/**
 * Convert ICP Principal back to Ethereum address format (for display)
 * This is approximate and used only for UI purposes
 */
export function principalToDisplayAddress(principal: Principal): string {
  const text = principal.toText();
  // ICP Principals look like: "x...-xxx-xxx-xxx-xxx"
  // For display, we'll just use a shortened version
  return `${text.substring(0, 8)}...${text.substring(text.length - 4)}`;
}

/**
 * Check if a string is a valid Ethereum address
 */
export function isEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Check if a string is a valid ICP Principal
 */
export function isICPPrincipal(principal: string): boolean {
  try {
    Principal.fromText(principal);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert party address (Ethereum or ICP) to ICP Principal
 * Handles both formats automatically
 */
export function convertPartyToPrincipal(partyAddress: string): Principal {
  // If it's already an ICP Principal, use it directly
  if (isICPPrincipal(partyAddress)) {
    return Principal.fromText(partyAddress);
  }

  // If it's an Ethereum address, convert it
  if (isEthereumAddress(partyAddress)) {
    return ethereumAddressToPrincipal(partyAddress);
  }

  // Try to parse as Principal anyway (might work)
  try {
    return Principal.fromText(partyAddress);
  } catch {
    // Final fallback
    console.warn(
      `Could not convert "${partyAddress}" to Principal, using anonymous`
    );
    return Principal.anonymous();
  }
}

/**
 * Get current user's Principal from wallet
 * For localhost: derives from Ethereum address
 * For production: should use Internet Identity
 */
export function getUserPrincipalFromWallet(
  ethAddress: string | null
): Principal {
  if (!ethAddress) {
    console.warn("No wallet address, using anonymous principal");
    return Principal.anonymous();
  }

  // Convert Ethereum address to Principal
  return ethereumAddressToPrincipal(ethAddress);
}

