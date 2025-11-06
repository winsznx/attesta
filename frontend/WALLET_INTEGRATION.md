# Multi-Wallet Integration Complete

## Overview

Attesta now supports **both EVM and ICP native wallets** for multi-party agreement signing. Users can connect with their preferred wallet type, and agreements support mixed wallet parties.

## Supported Wallets

### EVM Wallets
- **MetaMask** - Browser extension
- **Coinbase Wallet** - Browser extension & mobile
- **Any WalletConnect** compatible wallet
- **Rainbow**, **Trust Wallet**, etc.

**How it works:**
- Uses Reown AppKit (formerly WalletConnect)
- EVM addresses are converted to ICP principals using `ethereumAddressToPrincipal()`
- Users sign with their EVM wallet

### ICP Wallets
- **Plug Wallet** ✅ Fully integrated
- **Internet Identity** ✅ Fully integrated
- **Stoic Wallet** ⚠️ Placeholder (requires additional setup)

**How it works:**
- Native ICP principal (no conversion needed)
- Direct connection to ICP canisters
- Users sign with their ICP wallet

## Files Changed/Created

### New Files

1. **`src/lib/blockchain/icp/wallet-providers.ts`**
   - ICP wallet provider interfaces
   - Plug, Internet Identity, Stoic implementations
   - Wallet detection and factory functions

2. **`src/components/wallet/WalletSelectionModal.tsx`**
   - Unified wallet selection UI
   - Shows both EVM and ICP wallet options
   - Install prompts for missing wallets
   - Error handling

3. **`WALLET_INTEGRATION.md`** (this file)
   - Integration documentation

### Modified Files

1. **`src/lib/types/wallet.ts`**
   - Added `principal` and `walletType` to WalletState
   - Added `connectICP()` method
   - Added `isEVMWallet()` and `isICPWallet()` helpers

2. **`src/components/providers/WalletProvider.tsx`**
   - Added ICP wallet state management
   - Implemented `connectICP()` for ICP wallets
   - Added wallet type detection
   - LocalStorage persistence for ICP wallets
   - Automatic reconnection on page load

3. **`src/components/wallet/ConnectButton.tsx`**
   - Shows wallet selection modal instead of direct AppKit
   - Displays principal for ICP wallets
   - Shows wallet type badge
   - Handles both wallet types

4. **`src/lib/blockchain/constellation/client.ts`**
   - Updated explorer URL to `https://testnet.dagexplorer.io`

5. **`src/app/dashboard/verify/page.tsx`**
   - Updated Constellation explorer link

## Usage

### For Users

**Connecting a Wallet:**

1. Click "Connect Wallet"
2. Choose wallet type:
   - **EVM Wallets** → Click "MetaMask / WalletConnect"
   - **ICP Wallets** → Click "Plug Wallet" or "Internet Identity"
3. Approve in your wallet
4. You're connected!

**Multi-Party Signing:**

```
Agreement Created by: Alice (EVM wallet)
Other Parties:
  - Bob (Plug wallet)
  - Carol (Internet Identity)
  - Dave (MetaMask)

✅ All can sign with their preferred wallet type!
```

### For Developers

**Check Wallet Type:**

```typescript
import { useWallet } from '@/lib/hooks/useWallet';

function MyComponent() {
  const { walletType, isEVMWallet, isICPWallet, principal, address } = useWallet();

  if (isEVMWallet()) {
    console.log('EVM Address:', address);
    console.log('Converted Principal:', principal);
  }

  if (isICPWallet()) {
    console.log('ICP Principal:', principal);
    console.log('Wallet Type:', walletType); // 'ICP_PLUG' or 'ICP_INTERNET_IDENTITY'
  }
}
```

**Connect ICP Wallet Programmatically:**

```typescript
import { useWallet } from '@/lib/hooks/useWallet';

function MyComponent() {
  const { connectICP } = useWallet();

  const handleConnectPlug = async () => {
    try {
      await connectICP('ICP_PLUG');
      console.log('Plug wallet connected!');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleConnectII = async () => {
    try {
      await connectICP('ICP_INTERNET_IDENTITY');
      console.log('Internet Identity connected!');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };
}
```

**Get Wallet Provider (for advanced usage):**

```typescript
import { getWalletProvider } from '@/lib/blockchain/icp/wallet-providers';

async function signMessageWithICP(message: string) {
  const provider = getWalletProvider('ICP_PLUG');

  if (provider && provider.isAvailable()) {
    const signature = await provider.signMessage?.(message);
    return signature;
  }

  throw new Error('Plug wallet not available');
}
```

## Wallet Features Comparison

| Feature | EVM Wallets | ICP Plug | Internet Identity |
|---------|-------------|----------|-------------------|
| **Installation** | Browser extension | Browser extension | Web-based (no install) |
| **Authentication** | Signature | Identity | Passkeys (WebAuthn) |
| **Mobile Support** | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Hardware Wallet** | ✅ Yes | ❌ No | ❌ No |
| **Multi-device** | Via seed phrase | Via seed phrase | ✅ Yes (passkeys) |
| **Gas/Fees** | ETH required | ICP cycles | Free |

## Technical Details

### EVM → ICP Principal Conversion

EVM addresses are converted to ICP principals using:

```typescript
import { ethereumAddressToPrincipal } from '@/lib/blockchain/icp/address-converter';

const evmAddress = "0x1234...5678";
const principal = ethereumAddressToPrincipal(evmAddress);

console.log(principal.toText()); // "abc12...xyz89"
```

**How it works:**
1. Remove `0x` prefix from EVM address
2. SHA-224 hash the address
3. Take first 29 bytes
4. Convert to Principal format

**Important:** This is a **one-way conversion**. You cannot derive the EVM address from the principal.

### Wallet Persistence

**EVM Wallets:**
- Handled by Wagmi/AppKit
- Persists in browser storage automatically

**ICP Wallets:**
- Stored in localStorage:
  ```typescript
  localStorage.setItem('icp_wallet_type', 'ICP_PLUG');
  localStorage.setItem('icp_wallet_info', JSON.stringify(walletInfo));
  ```
- Auto-reconnect on page load
- Cleared on disconnect

### Wallet State Management

```typescript
interface WalletState {
  // EVM
  address: string | null;
  chainId: number | null;

  // ICP
  principal: string | null;
  walletType: WalletType | null;

  // Connection
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}
```

## Environment Variables

Required for ICP wallets:

```bash
# ICP Network (optional)
NEXT_PUBLIC_IC_HOST=https://ic0.app

# Internet Identity URL (optional, defaults to ic0.app)
NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app

# Canister IDs (for Plug whitelist)
NEXT_PUBLIC_AGREEMENT_CANISTER_ID=...
NEXT_PUBLIC_PROOF_VAULT_CANISTER_ID=...
```

## Known Issues & Limitations

### Plug Wallet

- **Issue**: Signing arbitrary messages not directly supported
- **Workaround**: Using transfer-to-self approach (may need improvement)
- **Status**: Works for authentication, may need enhancement for message signing

### Internet Identity

- **Issue**: Opens popup window (may be blocked by some browsers)
- **Solution**: User must allow popups for Attesta domain
- **Best Practice**: Show instruction if popup blocked

### Stoic Wallet

- **Status**: Placeholder only
- **Reason**: Requires additional package `@stoicwallet/stoic-identity`
- **TODO**: Implement full Stoic integration when needed

## Testing

### Test Plug Wallet Connection

1. Install Plug from https://plugwallet.ooo/
2. Create/import account
3. Visit Attesta → "Connect Wallet"
4. Select "Plug Wallet"
5. Approve connection in Plug extension
6. Verify principal displayed

### Test Internet Identity

1. Visit Attesta → "Connect Wallet"
2. Select "Internet Identity"
3. Allow popup (if blocked, check browser settings)
4. Create passkey or use existing
5. Verify principal displayed

### Test EVM Wallet

1. Install MetaMask
2. Visit Attesta → "Connect Wallet"
3. Select "MetaMask / WalletConnect"
4. Approve in MetaMask
5. Verify address AND principal displayed

### Test Multi-Party Signing

1. Create agreement with Alice (EVM wallet)
2. Add Bob's principal (from Plug wallet)
3. Alice signs with MetaMask
4. Share agreement link with Bob
5. Bob connects with Plug
6. Bob signs
7. Verify both signatures recorded

## Migration Notes

### For Existing Users

**EVM Wallet Users:**
- No change required
- Existing connections work as before
- Principal is auto-generated from address

**What's New:**
- Can now add ICP wallet users to agreements
- See wallet type badge in UI
- Multi-wallet support in signing flow

## Future Enhancements

### Planned Features

1. **Stoic Wallet Full Integration**
   - Add `@stoicwallet/stoic-identity` package
   - Implement redirect-based auth flow

2. **NFID Wallet**
   - Add NFID as ICP wallet option
   - Popular alternative to Internet Identity

3. **Wallet Switching**
   - Allow users to switch between connected wallets
   - Multi-wallet session management

4. **Enhanced Signing**
   - Improve Plug message signing
   - Add signature verification UI

5. **Mobile Optimization**
   - Deep links for mobile wallets
   - QR code connection flow

## Troubleshooting

### "Plug wallet is not installed"

**Solution:**
1. Install Plug from https://plugwallet.ooo/
2. Refresh Attesta page
3. Try connecting again

### "User denied connection"

**Causes:**
- User clicked "Cancel" in wallet
- Wallet extension crashed

**Solution:**
- Try connecting again
- Refresh page if issue persists

### "Internet Identity popup blocked"

**Solution:**
1. Check browser popup blocker
2. Allow popups for Attesta domain
3. Try connecting again

### Principal Not Showing

**EVM Wallet:**
- Check that wallet is connected
- Principal is auto-generated from address
- Refresh page to verify

**ICP Wallet:**
- Disconnect and reconnect
- Clear localStorage if issue persists
- Check wallet is approved

## Support

- **Documentation**: `/docs` folder
- **Issues**: GitHub Issues
- **Discord**: Community support

## API Reference

See full API documentation in:
- `/docs/API.md` - Complete API reference
- `/docs/ARCHITECTURE.md` - System architecture
- `/docs/DEVELOPMENT.md` - Development guide

---

**Integration Status**: ✅ Complete

**Next Steps**: Test in production, gather user feedback, implement Stoic wallet
