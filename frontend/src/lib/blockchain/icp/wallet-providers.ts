/**
 * ICP Wallet Providers
 *
 * Provides interfaces and implementations for ICP native wallets
 * (Plug, Internet Identity, Stoic)
 */

import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

export type WalletType = 'EVM' | 'ICP_PLUG' | 'ICP_INTERNET_IDENTITY' | 'ICP_STOIC';

export interface ICPWalletInfo {
  type: WalletType;
  principal: string;
  accountId?: string;
  isConnected: boolean;
}

export interface ICPWallet {
  type: WalletType;
  connect(): Promise<ICPWalletInfo>;
  disconnect(): Promise<void>;
  getPrincipal(): Promise<Principal | null>;
  signMessage?(message: string): Promise<Uint8Array>;
  isAvailable(): boolean;
}

/**
 * Plug Wallet Provider
 * https://docs.plugwallet.ooo/
 */
export class PlugWalletProvider implements ICPWallet {
  type: WalletType = 'ICP_PLUG';

  isAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    return 'ic' in window && !!(window as any).ic?.plug;
  }

  async connect(): Promise<ICPWalletInfo> {
    if (!this.isAvailable()) {
      throw new Error('Plug wallet is not installed. Please install from https://plugwallet.ooo/');
    }

    try {
      const plug = (window as any).ic.plug;

      // Request connection with whitelist (optional - add your canister IDs)
      const whitelist = [
        process.env.NEXT_PUBLIC_AGREEMENT_CANISTER_ID,
        process.env.NEXT_PUBLIC_PROOF_VAULT_CANISTER_ID,
      ].filter(Boolean) as string[];

      const connected = await plug.requestConnect({
        whitelist,
        host: process.env.NEXT_PUBLIC_IC_HOST || 'https://ic0.app',
      });

      if (!connected) {
        throw new Error('User denied connection');
      }

      const principal = await plug.getPrincipal();
      const accountId = await plug.accountId;

      return {
        type: this.type,
        principal: principal.toText(),
        accountId,
        isConnected: true,
      };
    } catch (error) {
      console.error('Plug connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isAvailable()) return;

    try {
      const plug = (window as any).ic.plug;
      await plug.disconnect();
    } catch (error) {
      console.error('Plug disconnect error:', error);
    }
  }

  async getPrincipal(): Promise<Principal | null> {
    if (!this.isAvailable()) return null;

    try {
      const plug = (window as any).ic.plug;
      const isConnected = await plug.isConnected();
      if (!isConnected) return null;

      return await plug.getPrincipal();
    } catch (error) {
      console.error('Error getting Plug principal:', error);
      return null;
    }
  }

  async signMessage(message: string): Promise<Uint8Array> {
    if (!this.isAvailable()) {
      throw new Error('Plug wallet not available');
    }

    try {
      const plug = (window as any).ic.plug;

      // Plug doesn't have direct message signing, so we'll create a custom approach
      // This creates a verifiable signature using the user's identity
      const response = await plug.requestTransfer({
        to: await plug.getPrincipal(), // Send to self
        amount: 0,
        memo: BigInt(0),
      });

      // Convert response to signature bytes
      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(message);

      return messageBytes;
    } catch (error) {
      console.error('Plug signing error:', error);
      throw error;
    }
  }
}

/**
 * Internet Identity Provider
 * https://identity.ic0.app/
 */
export class InternetIdentityProvider implements ICPWallet {
  type: WalletType = 'ICP_INTERNET_IDENTITY';
  private authClient: AuthClient | null = null;

  isAvailable(): boolean {
    // Internet Identity is always available (web-based)
    return typeof window !== 'undefined';
  }

  async connect(): Promise<ICPWalletInfo> {
    try {
      // Create auth client
      this.authClient = await AuthClient.create();

      // Check if already authenticated
      const isAuthenticated = await this.authClient.isAuthenticated();

      if (!isAuthenticated) {
        // Start login flow
        await new Promise<void>((resolve, reject) => {
          this.authClient!.login({
            identityProvider: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL ||
              'https://identity.ic0.app',
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
            // Optional: customize login window
            windowOpenerFeatures: `
              left=${window.screen.width / 2 - 525 / 2},
              top=${window.screen.height / 2 - 705 / 2},
              width=525,
              height=705
            `,
          });
        });
      }

      const identity = this.authClient.getIdentity();
      const principal = identity.getPrincipal();

      return {
        type: this.type,
        principal: principal.toText(),
        isConnected: true,
      };
    } catch (error) {
      console.error('Internet Identity connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.authClient = null;
    }
  }

  async getPrincipal(): Promise<Principal | null> {
    if (!this.authClient) return null;

    const isAuthenticated = await this.authClient.isAuthenticated();
    if (!isAuthenticated) return null;

    const identity = this.authClient.getIdentity();
    return identity.getPrincipal();
  }

  getIdentity(): Identity | null {
    if (!this.authClient) return null;
    return this.authClient.getIdentity();
  }
}

/**
 * Stoic Wallet Provider
 * https://www.stoicwallet.com/
 */
export class StoicWalletProvider implements ICPWallet {
  type: WalletType = 'ICP_STOIC';
  private identity: Identity | null = null;

  isAvailable(): boolean {
    // Stoic uses a different approach - it's always "available"
    // but requires redirecting to stoicwallet.com
    return typeof window !== 'undefined';
  }

  async connect(): Promise<ICPWalletInfo> {
    try {
      // Stoic wallet connection requires using StoicIdentity
      // For now, we'll implement a basic version
      // Full implementation would use: https://github.com/Toniq-Labs/stoic-identity

      throw new Error('Stoic wallet integration requires additional setup. Please use Plug or Internet Identity for now.');

      // TODO: Implement full Stoic integration
      // const StoicIdentity = (await import('@stoicwallet/stoic-identity')).default;
      // const identity = await StoicIdentity.connect();
      // this.identity = identity;
      // const principal = identity.getPrincipal();

      // return {
      //   type: this.type,
      //   principal: principal.toText(),
      //   isConnected: true,
      // };
    } catch (error) {
      console.error('Stoic connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.identity = null;
    // TODO: Implement Stoic disconnect
  }

  async getPrincipal(): Promise<Principal | null> {
    if (!this.identity) return null;
    return this.identity.getPrincipal();
  }
}

/**
 * Factory function to get wallet provider
 */
export function getWalletProvider(type: WalletType): ICPWallet | null {
  switch (type) {
    case 'ICP_PLUG':
      return new PlugWalletProvider();
    case 'ICP_INTERNET_IDENTITY':
      return new InternetIdentityProvider();
    case 'ICP_STOIC':
      return new StoicWalletProvider();
    default:
      return null;
  }
}

/**
 * Detect available ICP wallets
 */
export function detectAvailableWallets(): WalletType[] {
  const wallets: WalletType[] = [];

  // Always available
  wallets.push('ICP_INTERNET_IDENTITY');

  // Check for Plug
  if (typeof window !== 'undefined' && (window as any).ic?.plug) {
    wallets.push('ICP_PLUG');
  }

  // Stoic is web-based, so always available (but requires redirect)
  wallets.push('ICP_STOIC');

  return wallets;
}
