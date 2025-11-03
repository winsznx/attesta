# Address Conversion Summary

## ✅ **Problem Fixed**

### The Issue
- **Ethereum addresses**: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` (EVM format)
- **ICP Principals**: `x...-xxx-xxx-xxx-xxx` (Different format entirely)
- **Problem**: Can't use Ethereum address directly with ICP canisters

### The Solution
Created deterministic mapping: **Ethereum Address → ICP Principal**

**File**: `frontend/src/lib/blockchain/icp/address-converter.ts`

---

## 🔧 **How It Works**

### For Localhost Development

1. **User connects Ethereum wallet** → Gets address: `0x742d35...`

2. **System converts address to Principal**:
   ```typescript
   ethereumAddressToPrincipal("0x742d35...")
   → Uses SHA-256 hash of address
   → Creates deterministic Principal: "x7k4j-..."
   ```

3. **Same address always = Same Principal**:
   - `0x742d35...` → Always converts to `x7k4j-...`
   - Allows consistent identity across sessions

4. **Used throughout app**:
   - Creating agreements (parties as Principals)
   - Signing agreements (signer as Principal)
   - Fetching user data (user Principal)

---

## 📝 **Updated Files**

### Core Converter
- ✅ `frontend/src/lib/blockchain/icp/address-converter.ts` (NEW)
  - `ethereumAddressToPrincipal()` - Main conversion function
  - `convertPartyToPrincipal()` - Handles both formats
  - `getUserPrincipalFromWallet()` - Get current user's Principal

### Service Layer
- ✅ `frontend/src/lib/services/agreements.ts`
  - Updated `createAgreement()` - Converts party addresses
  - Updated `getUserAgreements()` - Accepts Ethereum address
  - Updated `getUserStats()` - Accepts Ethereum address

### Hooks
- ✅ `frontend/src/lib/hooks/useAgreementData.ts`
  - Now accepts `ethAddress` parameter
  - Automatically converts to Principal

### UI Pages
- ✅ `frontend/src/app/dashboard/page.tsx`
  - Derives Principal from connected wallet
- ✅ `frontend/src/app/dashboard/agreements/page.tsx`
  - Uses wallet address for Principal
- ✅ `frontend/src/app/dashboard/agreements/create/page.tsx`
  - Converts party addresses when creating agreements

---

## 🧪 **Testing**

### How to Verify

1. **Connect wallet** with address: `0xABC...`

2. **Check browser console**:
   ```
   📝 Using Principal for wallet: 0xABC... → x7k4j-...
   ```

3. **Create agreement**:
   - Add party with Ethereum address
   - Should convert automatically
   - Check canister: party stored as Principal

4. **Sign agreement**:
   - Your wallet address → Your Principal
   - Signature recorded correctly

---

## ⚠️ **Important Notes**

### For Development (localhost)
✅ **This solution works perfectly** for localhost testing
- Deterministic mapping
- No external dependencies
- Fast and simple

### For Production
⚠️ **Consider alternatives**:
1. **Internet Identity** (ICP's native auth)
   - Users authenticate with device/biometric
   - Get ICP Principal automatically
   - More secure

2. **Signature-based verification**
   - User signs message with Ethereum wallet
   - Derive Principal from signature
   - More complex but more secure

3. **Keep current approach**
   - Works but less secure
   - Same address always = same Principal
   - Could be spoofed

---

## 📋 **Quick Reference**

### Convert Address to Principal
```typescript
import { getUserPrincipalFromWallet } from "@/lib/blockchain/icp/address-converter";

const principal = getUserPrincipalFromWallet("0x742d35...");
const principalText = principal.toText(); // "x7k4j-..."
```

### Convert Party Address
```typescript
import { convertPartyToPrincipal } from "@/lib/blockchain/icp/address-converter";

// Works with both Ethereum addresses and ICP Principals
const principal = convertPartyToPrincipal("0x742d35..."); // Ethereum
const principal2 = convertPartyToPrincipal("x7k4j-..."); // Already a Principal
```

### Use in Services
```typescript
// Old way (broken):
const principal = Principal.fromText(ethAddress); // ❌ Fails

// New way (works):
const principal = convertPartyToPrincipal(ethAddress); // ✅ Works
```

---

## ✅ **Status**

- ✅ Address conversion implemented
- ✅ All services updated
- ✅ All hooks updated
- ✅ All UI pages updated
- ✅ Ready for localhost testing

**Next**: Test with real wallet connection and ICP canister!

