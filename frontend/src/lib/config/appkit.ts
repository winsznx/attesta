"use client";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, polygon, arbitrum, optimism, base, baseSepolia, bsc } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId && typeof window !== "undefined") {
  console.warn("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set");
}

export const networks = [baseSepolia, mainnet, polygon, arbitrum, optimism, base, bsc];

export const metadata = {
  name: "Attesta",
  description: "Multi-chain legal document platform",
  url: typeof window !== "undefined" ? window.location.origin : "",
  icons: typeof window !== "undefined" ? [`${window.location.origin}/favicon.ico`] : [],
};

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

export const config = wagmiAdapter.wagmiConfig;

