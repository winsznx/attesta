import type { WalletType } from "@/lib/blockchain/icp/wallet-providers";

export interface WalletState {
  // EVM wallet info
  address: string | null;
  chainId: number | null;

  // ICP wallet info
  principal: string | null;
  walletType: WalletType | null;

  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface WalletContextType extends WalletState {
  // General connection
  connect: (type?: 'EVM' | 'ICP') => Promise<void>;
  disconnect: () => Promise<void>;

  // EVM-specific
  switchChain: (chainId: number) => Promise<void>;

  // ICP-specific
  connectICP: (walletType: WalletType) => Promise<void>;

  // Utility
  isEVMWallet: () => boolean;
  isICPWallet: () => boolean;
}

