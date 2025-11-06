"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { WalletContextType, WalletState } from "@/lib/types/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { appKitModal, initializeAppKit } from "@/lib/config/appkit-init";
import {
  WalletType,
  getWalletProvider,
  ICPWalletInfo,
} from "@/lib/blockchain/icp/wallet-providers";
import { addressToPrincipal } from "@/lib/blockchain/icp/address-converter";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  // EVM wallet state (from Wagmi)
  const { address, isConnected: evmIsConnected, chainId } = useAccount();
  const { disconnect: evmDisconnect } = useDisconnect();

  // ICP wallet state
  const [icpWallet, setIcpWallet] = useState<ICPWalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine overall connection state
  const isConnected = evmIsConnected || (icpWallet?.isConnected ?? false);

  // Determine principal (ICP native or converted from EVM)
  const principal = icpWallet?.principal ||
    (address ? addressToPrincipal(address).toText() : null);

  const state: WalletState = {
    // EVM
    address: address || null,
    chainId: chainId || null,

    // ICP
    principal,
    walletType: icpWallet?.type || (address ? 'EVM' : null),

    // Connection
    isConnected,
    isConnecting,
    error,
  };

  const handleConnect = async (type?: 'EVM' | 'ICP') => {
    try {
      setIsConnecting(true);
      setError(null);

      if (type === 'ICP') {
        // Show ICP wallet selection (will be handled by UI component)
        return;
      }

      // Default to EVM connection
      const modal = appKitModal || initializeAppKit();
      if (!modal) {
        throw new Error('AppKit not initialized');
      }
      modal.open();
    } catch (error: any) {
      setError(error.message || 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectICP = async (walletType: WalletType) => {
    try {
      setIsConnecting(true);
      setError(null);

      const provider = getWalletProvider(walletType);
      if (!provider) {
        throw new Error(`Wallet provider ${walletType} not found`);
      }

      if (!provider.isAvailable()) {
        if (walletType === 'ICP_PLUG') {
          throw new Error('Plug wallet is not installed. Please install from https://plugwallet.ooo/');
        }
        throw new Error(`${walletType} is not available`);
      }

      const walletInfo = await provider.connect();
      setIcpWallet(walletInfo);

      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('icp_wallet_type', walletType);
        localStorage.setItem('icp_wallet_info', JSON.stringify(walletInfo));
      }
    } catch (error: any) {
      setError(error.message || 'ICP wallet connection failed');
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect EVM wallet
      if (evmIsConnected) {
        await evmDisconnect();
      }

      // Disconnect ICP wallet
      if (icpWallet) {
        const provider = getWalletProvider(icpWallet.type);
        if (provider) {
          await provider.disconnect();
        }
        setIcpWallet(null);

        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('icp_wallet_type');
          localStorage.removeItem('icp_wallet_info');
        }
      }

      setError(null);
    } catch (error: any) {
      setError(error.message || 'Disconnect failed');
    }
  };

  const handleSwitchChain = async (targetChainId: number) => {
    try {
      const modal = appKitModal || initializeAppKit();
      if (modal) {
        modal.open({ view: "Networks" });
      }
    } catch (error: any) {
      setError(error.message || 'Chain switch failed');
    }
  };

  const isEVMWallet = () => {
    return evmIsConnected;
  };

  const isICPWallet = () => {
    return icpWallet?.isConnected ?? false;
  };

  // Restore ICP wallet connection on mount
  useEffect(() => {
    const restoreICPConnection = async () => {
      if (typeof window === 'undefined') return;

      const savedWalletType = localStorage.getItem('icp_wallet_type') as WalletType | null;
      const savedWalletInfo = localStorage.getItem('icp_wallet_info');

      if (savedWalletType && savedWalletInfo) {
        try {
          const provider = getWalletProvider(savedWalletType);
          if (provider && provider.isAvailable()) {
            const principal = await provider.getPrincipal();
            if (principal) {
              const walletInfo: ICPWalletInfo = JSON.parse(savedWalletInfo);
              setIcpWallet(walletInfo);
            } else {
              // Wallet disconnected, clear storage
              localStorage.removeItem('icp_wallet_type');
              localStorage.removeItem('icp_wallet_info');
            }
          }
        } catch (error) {
          console.error('Failed to restore ICP wallet connection:', error);
          localStorage.removeItem('icp_wallet_type');
          localStorage.removeItem('icp_wallet_info');
        }
      }
    };

    restoreICPConnection();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect: handleConnect,
        disconnect: handleDisconnect,
        switchChain: handleSwitchChain,
        connectICP: handleConnectICP,
        isEVMWallet,
        isICPWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
