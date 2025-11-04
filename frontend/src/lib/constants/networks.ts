export const SUPPORTED_CHAINS = {
  ethereum: 1,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  bsc: 56,
  baseSepolia: 84532, // Base Sepolia Testnet
} as const;

export const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  137: "Polygon",
  42161: "Arbitrum",
  10: "Optimism",
  8453: "Base",
  56: "BNB Chain",
  84532: "Base Sepolia",
};

export const CHAIN_RPCS: Record<number, string> = {
  1: "https://eth.llamarpc.com",
  137: "https://polygon.llamarpc.com",
  42161: "https://arb1.arbitrum.io/rpc",
  10: "https://mainnet.optimism.io",
  8453: "https://mainnet.base.org",
  56: "https://bsc-dataseed.binance.org",
  84532: "https://sepolia.base.org",
};

