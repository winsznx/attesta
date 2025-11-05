"use client";

// CRITICAL: Import appkit-init FIRST to ensure AppKit is initialized before any hooks
// The import side-effect defers AppKit initialization to not block rendering
import "@/lib/config/appkit-init";
import { appKitInitialized } from "@/lib/config/appkit-init";

import { ReactNode, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/config/appkit";

const queryClient = new QueryClient();

interface AppKitProviderProps {
  children: ReactNode;
}

export function AppKitProvider({ children }: AppKitProviderProps) {
  // Check initialization after mount
  useEffect(() => {
    if (!appKitInitialized) {
      console.warn("⚠️ AppKit not initialized - wallet features may not work");
    }
  }, []);

  // Always render immediately - don't block on mount
  // Wagmi will handle SSR/hydration correctly
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
