"use client";

import { createContext, useContext, ReactNode } from "react";
import { WalletContextType, WalletState } from "@/lib/types/wallet";
import { useAccount, useDisconnect } from "wagmi";
import { appKitModal, initializeAppKit } from "@/lib/config/appkit-init";

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { address, isConnected, chainId, connector } = useAccount();
  const { disconnect } = useDisconnect();

  // Use connector status for connection state
  const isConnecting = false;

  const state: WalletState = {
    address: address || null,
    chainId: chainId || null,
    isConnected: isConnected,
    isConnecting: isConnecting,
    error: null,
  };

  const handleConnect = async () => {
    try {
      // Ensure AppKit is initialized before opening modal
      const modal = appKitModal || initializeAppKit();
      if (!modal) {
        return;
      }
      modal.open();
    } catch (error: any) {
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
    }
  };

  const handleSwitchChain = async (targetChainId: number) => {
    try {
      const modal = appKitModal || initializeAppKit();
      if (modal) {
        modal.open({ view: "Networks" });
      }
    } catch (error) {
    }
  };

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect: handleConnect,
        disconnect: handleDisconnect,
        switchChain: handleSwitchChain,
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
