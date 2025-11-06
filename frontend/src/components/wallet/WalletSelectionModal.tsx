"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/components/providers/WalletProvider";
import { WalletType, detectAvailableWallets } from "@/lib/blockchain/icp/wallet-providers";
import { Loader2, ExternalLink } from "lucide-react";

interface WalletSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WalletOption {
  type: WalletType | 'EVM';
  name: string;
  description: string;
  icon: string;
  installUrl?: string;
  category: 'EVM' | 'ICP';
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    type: 'EVM',
    name: 'MetaMask / WalletConnect',
    description: 'Connect with any EVM wallet (MetaMask, Coinbase, etc.)',
    icon: '🦊',
    category: 'EVM',
  },
  {
    type: 'ICP_PLUG',
    name: 'Plug Wallet',
    description: 'Browser extension wallet for Internet Computer',
    icon: '🔌',
    installUrl: 'https://plugwallet.ooo/',
    category: 'ICP',
  },
  {
    type: 'ICP_INTERNET_IDENTITY',
    name: 'Internet Identity',
    description: 'Native ICP authentication with passkeys',
    icon: '🔐',
    category: 'ICP',
  },
  // Uncomment when Stoic is fully implemented
  // {
  //   type: 'ICP_STOIC',
  //   name: 'Stoic Wallet',
  //   description: 'Mobile and web wallet for ICP',
  //   icon: '💼',
  //   installUrl: 'https://www.stoicwallet.com/',
  //   category: 'ICP',
  // },
];

export function WalletSelectionModal({ open, onOpenChange }: WalletSelectionModalProps) {
  const { connectICP, connect, isConnecting } = useWallet();
  const [connecting, setConnecting] = useState<WalletType | 'EVM' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnectEVM = async () => {
    try {
      setConnecting('EVM');
      setError(null);
      await connect('EVM');
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to connect EVM wallet');
    } finally {
      setConnecting(null);
    }
  };

  const handleConnectICP = async (walletType: WalletType) => {
    try {
      setConnecting(walletType);
      setError(null);
      await connectICP(walletType);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || `Failed to connect ${walletType}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleWalletClick = (option: WalletOption) => {
    if (option.type === 'EVM') {
      handleConnectEVM();
    } else {
      handleConnectICP(option.type);
    }
  };

  const isWalletAvailable = (option: WalletOption): boolean => {
    if (option.type === 'EVM') {
      return true; // EVM wallets always available (AppKit handles detection)
    }

    if (option.type === 'ICP_INTERNET_IDENTITY') {
      return true; // Always available (web-based)
    }

    if (option.type === 'ICP_PLUG') {
      return typeof window !== 'undefined' && !!(window as any).ic?.plug;
    }

    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose how you want to connect. Both EVM and ICP wallets are supported.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* EVM Wallets Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              EVM Wallets
            </h3>
            <div className="space-y-2">
              {WALLET_OPTIONS.filter(w => w.category === 'EVM').map((option) => (
                <WalletOptionButton
                  key={option.type}
                  option={option}
                  isAvailable={isWalletAvailable(option)}
                  isConnecting={connecting === option.type}
                  onClick={() => handleWalletClick(option)}
                />
              ))}
            </div>
          </div>

          {/* ICP Wallets Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              ICP Wallets
            </h3>
            <div className="space-y-2">
              {WALLET_OPTIONS.filter(w => w.category === 'ICP').map((option) => (
                <WalletOptionButton
                  key={option.type}
                  option={option}
                  isAvailable={isWalletAvailable(option)}
                  isConnecting={connecting === option.type}
                  onClick={() => handleWalletClick(option)}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <strong>Multi-Party Signing:</strong> Other parties can sign with different wallet types.
              EVM addresses are automatically converted to ICP principals.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface WalletOptionButtonProps {
  option: WalletOption;
  isAvailable: boolean;
  isConnecting: boolean;
  onClick: () => void;
}

function WalletOptionButton({ option, isAvailable, isConnecting, onClick }: WalletOptionButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full h-auto p-4 justify-start hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:border-fuchsia-300 dark:hover:border-fuchsia-700 transition-colors"
      onClick={onClick}
      disabled={!isAvailable || isConnecting}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="text-3xl">{option.icon}</div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{option.name}</span>
            {!isAvailable && option.installUrl && (
              <Badge variant="outline" className="text-xs">
                Not Installed
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {option.description}
          </p>
        </div>
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : !isAvailable && option.installUrl ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(option.installUrl, '_blank');
            }}
          >
            Install
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        ) : null}
      </div>
    </Button>
  );
}
