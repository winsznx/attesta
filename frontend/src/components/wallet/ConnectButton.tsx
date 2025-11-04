"use client";

import { useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, Check } from "lucide-react";
import { CHAIN_NAMES } from "@/lib/constants/networks";

export function ConnectButton() {
  const { address, isConnected, isConnecting, connect, disconnect, chainId } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    // Don't show custom dialog - let Reown modal handle everything
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-200 dark:border-fuchsia-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-fuchsia-700 dark:text-fuchsia-300">
              {formatAddress(address)}
            </span>
            {chainId && (
              <span className="text-xs text-muted-foreground">
                {CHAIN_NAMES[chainId] || `Chain ${chainId}`}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20"
          >
            Disconnect
          </Button>
        </div>
      </>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
    >
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}

