"use client";

import { useState } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import { CHAIN_NAMES } from "@/lib/constants/networks";
import { WalletSelectionModal } from "./WalletSelectionModal";

export function ConnectButton() {
  const {
    address,
    principal,
    isConnected,
    isConnecting,
    disconnect,
    chainId,
    walletType,
    isEVMWallet,
    isICPWallet,
  } = useWallet();

  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleConnect = () => {
    setShowWalletModal(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatPrincipal = (princ: string) => {
    if (princ.length <= 20) return princ;
    return `${princ.slice(0, 8)}...${princ.slice(-4)}`;
  };

  const getWalletTypeLabel = () => {
    if (!walletType) return '';

    switch (walletType) {
      case 'EVM':
        return 'EVM';
      case 'ICP_PLUG':
        return 'Plug';
      case 'ICP_INTERNET_IDENTITY':
        return 'Internet Identity';
      case 'ICP_STOIC':
        return 'Stoic';
      default:
        return walletType;
    }
  };

  if (isConnected) {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-200 dark:border-fuchsia-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />

            {/* Show EVM or ICP info based on wallet type */}
            {isEVMWallet() && address && (
              <>
                <span className="text-sm font-medium text-fuchsia-700 dark:text-fuchsia-300">
                  {formatAddress(address)}
                </span>
                {chainId && (
                  <span className="text-xs text-muted-foreground">
                    {CHAIN_NAMES[chainId] || `Chain ${chainId}`}
                  </span>
                )}
              </>
            )}

            {isICPWallet() && principal && (
              <>
                <span className="text-sm font-medium text-fuchsia-700 dark:text-fuchsia-300">
                  {formatPrincipal(principal)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {getWalletTypeLabel()}
                </Badge>
              </>
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

        <WalletSelectionModal
          open={showWalletModal}
          onOpenChange={setShowWalletModal}
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <WalletSelectionModal
        open={showWalletModal}
        onOpenChange={setShowWalletModal}
      />
    </>
  );
}

