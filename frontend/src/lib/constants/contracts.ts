/**
 * Smart Contract Addresses Configuration
 *
 * This file contains all deployed contract addresses for the Attesta platform
 * organized by chain ID.
 */

import { SUPPORTED_CHAINS } from "./networks";

/**
 * Certificate NFT Contract Addresses (ERC-721)
 * These contracts mint certificate NFTs for finalized agreements
 */
export const CERTIFICATE_NFT_CONTRACTS: Record<number, string> = {
  // Base Sepolia Testnet (ACTIVE)
  [SUPPORTED_CHAINS.baseSepolia]:
    process.env.NEXT_PUBLIC_NFT_CONTRACT_BASE_SEPOLIA || "",

  // Mainnets (not yet deployed)
  [SUPPORTED_CHAINS.ethereum]: process.env.NEXT_PUBLIC_NFT_CONTRACT_ETHEREUM || "",
  [SUPPORTED_CHAINS.polygon]: process.env.NEXT_PUBLIC_NFT_CONTRACT_POLYGON || "",
  [SUPPORTED_CHAINS.arbitrum]: process.env.NEXT_PUBLIC_NFT_CONTRACT_ARBITRUM || "",
  [SUPPORTED_CHAINS.optimism]: process.env.NEXT_PUBLIC_NFT_CONTRACT_OPTIMISM || "",
  [SUPPORTED_CHAINS.base]: process.env.NEXT_PUBLIC_NFT_CONTRACT_BASE || "",
  [SUPPORTED_CHAINS.bsc]: process.env.NEXT_PUBLIC_NFT_CONTRACT_BSC || "",
};

/**
 * Payment Middleware Contract Addresses (X402 Protocol)
 * These contracts handle payment processing for premium features
 */
export const PAYMENT_MIDDLEWARE_CONTRACTS: Record<number, string> = {
  [SUPPORTED_CHAINS.ethereum]: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ETHEREUM || "",
  [SUPPORTED_CHAINS.polygon]: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_POLYGON || "",
  [SUPPORTED_CHAINS.arbitrum]: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ARBITRUM || "",
  [SUPPORTED_CHAINS.optimism]: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_OPTIMISM || "",
  [SUPPORTED_CHAINS.base]: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_BASE || "",
  [SUPPORTED_CHAINS.bsc]: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_BSC || "",
};

/**
 * Get certificate NFT contract address for a given chain
 */
export function getCertificateNFTContract(chainId: number): string | undefined {
  return CERTIFICATE_NFT_CONTRACTS[chainId];
}

/**
 * Get payment middleware contract address for a given chain
 */
export function getPaymentMiddlewareContract(chainId: number): string | undefined {
  return PAYMENT_MIDDLEWARE_CONTRACTS[chainId];
}

/**
 * Check if NFT contracts are deployed on a given chain
 */
export function isNFTContractDeployed(chainId: number): boolean {
  const address = CERTIFICATE_NFT_CONTRACTS[chainId];
  return !!address && address.length > 0;
}

/**
 * Check if payment contracts are deployed on a given chain
 */
export function isPaymentContractDeployed(chainId: number): boolean {
  const address = PAYMENT_MIDDLEWARE_CONTRACTS[chainId];
  return !!address && address.length > 0;
}

/**
 * Get all chains where NFT contracts are deployed
 */
export function getChainsWithNFTContracts(): number[] {
  return Object.entries(CERTIFICATE_NFT_CONTRACTS)
    .filter(([_, address]) => address && address.length > 0)
    .map(([chainId]) => parseInt(chainId));
}

/**
 * Get all chains where payment contracts are deployed
 */
export function getChainsWithPaymentContracts(): number[] {
  return Object.entries(PAYMENT_MIDDLEWARE_CONTRACTS)
    .filter(([_, address]) => address && address.length > 0)
    .map(([chainId]) => parseInt(chainId));
}

/**
 * Contract ABIs can be imported from Thirdweb or stored here
 * For now, we use Thirdweb SDK which handles ABIs automatically
 */
export const CONTRACT_ABIS = {
  // Will be populated when needed
};
