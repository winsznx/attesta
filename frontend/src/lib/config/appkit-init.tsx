"use client";

import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter, projectId, networks, metadata } from "./appkit";

// Track initialization state - exported so providers can check it
export let appKitInitialized = false;
export let appKitModal: any = null;

// Lazy initialization - only initialize when first needed
export function initializeAppKit() {
  if (appKitInitialized || typeof window === "undefined") {
    return appKitModal;
  }

  if (!projectId || projectId.trim() === "") {
    console.error(
      "ERROR: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set!\n" +
      "Please ensure .env.local exists in frontend/ with:\n" +
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id"
    );
    return null;
  }

  try {
    // Initialize AppKit on-demand
    appKitModal = createAppKit({
      adapters: [wagmiAdapter],
      networks: networks as any,
      projectId,
      metadata,
      themeMode: "light",
      themeVariables: {
        "--w3m-accent": "#d946ef",
      },
      features: {
        analytics: true,
        socials: false,
        email: false,
        onramp: false,
      },
      allowUnsupportedChain: false,
      allWallets: "SHOW",
      defaultNetwork: networks[0] as any,
    });
    appKitInitialized = true;
    return appKitModal;
  } catch (error) {
    return null;
  }
}

// Auto-initialize on first client-side render (deferred to not block)
if (typeof window !== "undefined") {
  // Use setTimeout to defer initialization after initial render
  setTimeout(() => {
    initializeAppKit();
  }, 100);
}
