"use client";

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Ethereum, Polygon, Arbitrum } from "@thirdweb-dev/chains";
import { ReactNode } from "react";

interface ThirdwebProviderWrapperProps {
  children: ReactNode;
}

/**
 * Thirdweb Provider for Ethereum NFT minting
 * 
 * Wraps the app with Thirdweb context for contract interactions
 */
export function ThirdwebProviderWrapper({
  children,
}: ThirdwebProviderWrapperProps) {
  // Get client ID from environment
  const clientId =
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
    process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY ||
    "";

  // Supported chains for NFT minting
  const supportedChains = [Ethereum, Polygon, Arbitrum];

  return (
    <ThirdwebProvider
      activeChain={Ethereum}
      supportedChains={supportedChains}
      clientId={clientId}
    >
      {children}
    </ThirdwebProvider>
  );
}

