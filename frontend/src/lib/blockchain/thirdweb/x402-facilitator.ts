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
 * @returns Configured Nexus facilitator
 */
export function getNexusFacilitator() {
  if (nexusFacilitator) {
    return nexusFacilitator;
  }

  const walletSecret = process.env.NEXUS_WALLET_SECRET;

  if (!walletSecret) {
    throw new Error(
      "NEXUS_WALLET_SECRET environment variable is not set. " +
      "Please get your wallet secret from the Nexus Dashboard at https://nexus.thirdweb.com"
    );
  }

  try {
    nexusFacilitator = createFacilitator({
      walletSecret,
    });

    return nexusFacilitator;
  } catch (error) {
    console.error("Failed to initialize Nexus facilitator:", error);
    throw error;
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
