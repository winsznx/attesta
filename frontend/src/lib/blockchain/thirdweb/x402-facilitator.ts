/**
 * x402 Payment Facilitator Configuration (Nexus)
 *
 * This sets up the payment processor for micropayments on API endpoints.
 * Uses Nexus Facilitator to settle payments on Base Sepolia testnet.
 */
import { createFacilitator } from "@thirdweb-dev/nexus";

let nexusFacilitator: ReturnType<typeof createFacilitator> | null = null;

/**
 * Get or create the Nexus facilitator instance
 *
 * @returns Configured Nexus facilitator or null if not configured
 */
export function getNexusFacilitator() {
  if (nexusFacilitator) {
    return nexusFacilitator;
  }

  const walletSecret = process.env.NEXUS_WALLET_SECRET;
  const walletAddress = process.env.NEXUS_WALLET_ADDRESS;

  if (!walletSecret || !walletAddress) {
    console.warn(
      "NEXUS_WALLET_SECRET or NEXUS_WALLET_ADDRESS not set. " +
      "X402 payments will not be available."
    );
    return null;
  }

  try {
    nexusFacilitator = createFacilitator({
      walletSecret,
      walletAddress,
    } as any);

    return nexusFacilitator;
  } catch (error) {
    console.error("Failed to initialize Nexus facilitator:", error);
    return null;
  }
}

/**
 * Payment configuration for different endpoints
 */
export const PAYMENT_CONFIG = {
  /**
   * AI contract generation
   * Price: $0.10 per generation
   */
  AI_GENERATION: {
    price: "$0.10",
    description: "AI-powered legal contract generation",
    mimeType: "application/json",
    maxTimeoutSeconds: 60,
  },

  /**
   * AI contract explanation
   * Price: $0.05 per explanation
   */
  AI_EXPLANATION: {
    price: "$0.05",
    description: "AI clause explanation",
    mimeType: "application/json",
    maxTimeoutSeconds: 30,
  },

  /**
   * Certificate NFT minting
   * Price: $0.50 per mint
   */
  NFT_MINTING: {
    price: "$0.50",
    description: "Mint proof certificate as NFT",
    mimeType: "application/json",
    maxTimeoutSeconds: 120,
  },

  /**
   * Constellation validation
   * Price: $0.05 per validation
   */
  CONSTELLATION_VALIDATION: {
    price: "$0.05",
    description: "Multi-chain proof validation via Constellation DAG",
    mimeType: "application/json",
    maxTimeoutSeconds: 60,
  },
} as const;
