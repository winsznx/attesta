"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { motion } from "framer-motion";
import { ConnectButton } from "@/components/wallet/ConnectButton";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected, isConnecting } = useWallet();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Wait a moment for wallet state to initialize
    const timer = setTimeout(() => {
      setHasChecked(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [isConnected, isConnecting]);

  // Show loading state while checking
  if (!hasChecked || isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Checking wallet connection...</p>
        </motion.div>
      </div>
    );
  }

  // If not connected, show connect prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md px-4"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Wallet Required</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to access the dashboard.
            </p>
          </div>
          <ConnectButton />
          <p className="text-sm text-muted-foreground">
            Don't have a wallet?{" "}
            <a
              href="https://walletconnect.com/explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fuchsia-600 hover:underline"
            >
              Get one here
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

