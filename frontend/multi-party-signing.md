# Multi-Party Signing with Native ICP Principals

## Current State
- Agreement creator signs with WalletConnect (EVM wallet)
- EVM addresses are converted to ICP principals using `addressToPrincipal()`
- All signatures go through EVM wallet flow

## Requirement
- Add other parties' principals to agreements
- Allow those parties to sign with their **native ICP wallets** (Plug, Internet Identity, Stoic, etc.)
- Not force them through EVM/WalletConnect conversion

## Implementation Approach

### 1. Detect Principal Type
When a party attempts to sign, check if the principal is:
- **EVM-derived**: `addressToPrincipal(evmAddress)` format
- **Native ICP**: Direct principal from ICP wallet

### 2. Dual Wallet Support

```typescript
// Add to wallet connection logic
interface WalletProvider {
  type: 'EVM' | 'ICP_NATIVE';
  connect: () => Promise<string>; // Returns principal
  sign: (message: string) => Promise<Signature>;
}

// EVM Provider (existing)
const evmProvider: WalletProvider = {
  type: 'EVM',
  connect: async () => {
    const address = await connectEVM();
    return addressToPrincipal(address);
  },
  sign: signWithEVM
};

// ICP Native Provider (new)
const icpProvider: WalletProvider = {
  type: 'ICP_NATIVE',
  connect: async () => {
    const principal = await window.ic.plug.requestConnect();
    return principal.toText();
  },
  sign: signWithICP
};
```

### 3. Update Agreement Modal

**Add Party Input:**
```typescript
// In agreement creation form
<input
  placeholder="Other party principal (e.g., abc123-xyz...)"
  onChange={(e) => setOtherPartyPrincipal(e.target.value)}
/>
<button onClick={validatePrincipal}>Add Party</button>
```

**Validate Principal Format:**
```typescript
import { Principal } from '@dfinity/principal';

function validatePrincipal(principalText: string): boolean {
  try {
    Principal.fromText(principalText);
    return true;
  } catch {
    return false;
  }
}
```

### 4. Signing Flow

```typescript
async function signAgreement(agreementId: string) {
  const agreement = await getAgreement(agreementId);
  const currentUserPrincipal = await getCurrentPrincipal();

  // Find if user is a party in this agreement
  const party = agreement.parties.find(p => p.principal === currentUserPrincipal);

  if (!party) {
    throw new Error("You are not a party to this agreement");
  }

  // Detect wallet type based on principal format
  if (isEVMDerivedPrincipal(currentUserPrincipal)) {
    // Use EVM wallet (WalletConnect)
    await signWithEVMWallet(agreementId);
  } else {
    // Use native ICP wallet (Plug, II, etc.)
    await signWithICPWallet(agreementId);
  }
}

function isEVMDerivedPrincipal(principal: string): boolean {
  // Check if principal was derived from EVM address
  // Could store metadata or check known EVM principals
  return principal.startsWith('your-evm-conversion-prefix');
}
```

### 5. Wallet Detection UI

```tsx
// In signing modal
function WalletSelector({ principal }: { principal: string }) {
  const isEVM = isEVMDerivedPrincipal(principal);

  return (
    <div>
      {isEVM ? (
        <button onClick={connectWalletConnect}>
          Connect with WalletConnect
        </button>
      ) : (
        <div>
          <button onClick={connectPlug}>Connect Plug</button>
          <button onClick={connectII}>Connect Internet Identity</button>
          <button onClick={connectStoic}>Connect Stoic</button>
        </div>
      )}
    </div>
  );
}
```

### 6. Backend Updates (Canister)

```rust
// Store principal type with signature
pub struct Signature {
    pub principal: Principal,
    pub signature_data: Vec<u8>,
    pub wallet_type: WalletType,
    pub timestamp: u64,
}

pub enum WalletType {
    EVMDerived,
    ICPNative,
}
```

## Key Files to Modify

1. **Agreement Modal**: `src/components/modals/agreement-modal.tsx`
   - Add multi-party principal input
   - Validate principal format

2. **Wallet Connection**: `src/lib/blockchain/wallet-provider.tsx`
   - Add ICP native wallet providers (Plug, II)
   - Detect principal type

3. **Signing Logic**: `src/lib/blockchain/thirdweb/contract-signing.ts`
   - Route to correct wallet based on principal type
   - Handle both EVM and ICP signatures

4. **Canister Backend**: Update signature verification
   - Accept both EVM and ICP native signatures
   - Store wallet type metadata

## Testing

1. Create agreement with EVM principal (existing flow)
2. Add native ICP principal as second party
3. EVM party signs with WalletConnect ✓
4. ICP party signs with Plug wallet ✓
5. Verify both signatures on-chain ✓

## Security Considerations

- Always validate principal format before storage
- Verify signatures match the correct wallet type
- Ensure each party signs with their own wallet
- Prevent principal impersonation
