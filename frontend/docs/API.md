# Attesta API Documentation

Complete reference for all API endpoints in the Attesta platform.

## Table of Contents

- [Authentication](#authentication)
- [AI Endpoints](#ai-endpoints)
- [Agreement Endpoints](#agreement-endpoints)
- [Payment System](#payment-system)
- [Error Handling](#error-handling)

---

## Authentication

All API requests require wallet-based authentication. Users must connect their wallet (EVM or ICP) before accessing protected endpoints.

### Supported Wallets

**EVM Wallets:**
- MetaMask
- Coinbase Wallet
- WalletConnect compatible wallets

**ICP Wallets:**
- Plug
- Internet Identity
- Stoic

### Authentication Flow

```typescript
// 1. Connect wallet
const address = await connectWallet();

// 2. Convert to principal (if EVM)
const principal = ethereumAddressToPrincipal(address);

// 3. Sign message for verification
const signature = await signMessage(principal);

// 4. Include in requests
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${signature}`
  }
});
```

---

## AI Endpoints

### Generate Legal Document

Generates a complete legal agreement using AI based on user specifications.

**Endpoint:** `POST /api/ai/generate`

**Payment Required:** Yes ($0.10 via x402)

**Request Headers:**
```http
Content-Type: application/json
x-payment: <payment_data>  // Optional, for x402 micropayment
```

**Request Body:**
```typescript
{
  "description": string,      // Required: Agreement description
  "templateType": string,     // Optional: "freelance" | "rental" | "employment" | "partnership" | "nda" | "custom"
  "context": string          // Optional: Additional context
}
```

**Example Request:**
```json
{
  "description": "Create a freelance web development agreement for a 3-month project building an e-commerce website",
  "templateType": "freelance",
  "context": "Budget: $5000, deliverables include design, frontend, and backend"
}
```

**Success Response (200):**
```typescript
{
  "content": string,         // Generated legal document
  "model": string,          // AI model used (e.g., "gpt-4o-mini")
  "usage": {
    "prompt_tokens": number,
    "completion_tokens": number,
    "total_tokens": number
  }
}
```

**Error Responses:**

```typescript
// 400 Bad Request
{
  "error": "Description is required"
}

// 402 Payment Required (x402)
{
  "error": "Payment required",
  "price": "$0.10",
  "paymentUrl": "https://..."
}

// 500 Internal Server Error
{
  "error": "Failed to generate document",
  "details": "OpenAI API key not configured"
}
```

**Template Types:**

| Template | Description | Includes |
|----------|-------------|----------|
| `freelance` | Freelance services agreement | Scope of work, payment terms, IP rights, termination |
| `rental` | Rental/lease agreement | Property details, rent, deposit, responsibilities |
| `employment` | Employment contract | Job description, compensation, confidentiality, non-compete |
| `partnership` | Partnership agreement | Structure, capital, profit sharing, dissolution |
| `nda` | Non-disclosure agreement | Confidential info definition, obligations, term, remedies |
| `custom` | Custom agreement | Based on user specifications |

**Code Example:**
```typescript
async function generateAgreement() {
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-payment': paymentData // If x402 enabled
    },
    body: JSON.stringify({
      description: 'Freelance graphic design contract',
      templateType: 'freelance',
      context: '6-month retainer, $3000/month'
    })
  });

  const data = await response.json();
  return data.content; // Generated legal document
}
```

---

### Explain Legal Clause

Provides AI-powered explanation of legal clauses in plain language.

**Endpoint:** `POST /api/ai/explain`

**Payment Required:** Yes ($0.05 via x402)

**Request Body:**
```typescript
{
  "clause": string  // Required: The legal clause to explain
}
```

**Example Request:**
```json
{
  "clause": "The Freelancer shall retain all intellectual property rights to work product until full payment is received."
}
```

**Success Response (200):**
```typescript
{
  "explanation": string,     // Plain language explanation
  "implications": string[],  // Key implications for parties
  "suggestions": string[]    // Optional: Alternative wording suggestions
}
```

---

## Agreement Endpoints

Agreement operations are handled via ICP canisters, not REST APIs. See the [Canister Integration](#canister-integration) section below.

### Canister Methods

**Create Agreement:**
```typescript
import { createAgreement } from '@/lib/services/agreements';

const agreement = await createAgreement({
  title: string,
  content: string,
  parties: Principal[],
  metadata: {
    templateType: string,
    createdAt: bigint
  }
});
```

**Get Agreement:**
```typescript
import { getAgreement } from '@/lib/services/agreements';

const agreement = await getAgreement(agreementId);
```

**Sign Agreement:**
```typescript
import { signAgreement } from '@/lib/services/agreements';

const result = await signAgreement({
  agreementId: bigint,
  signature: Uint8Array,
  signerPrincipal: Principal
});
```

**List User Agreements:**
```typescript
import { getUserAgreements } from '@/lib/services/agreements';

const agreements = await getUserAgreements(userPrincipal);
```

---

## Canister Integration

Attesta uses Internet Computer canisters for decentralized storage and logic.

### Agreement Manager Canister

**Canister ID:** `<deployed_canister_id>`

**Methods:**

#### `createAgreement`
```candid
createAgreement : (
  title: Text,
  content: Text,
  parties: vec Principal,
  metadata: AgreementMetadata
) -> (Result_1)
```

#### `getAgreement`
```candid
getAgreement : (agreementId: nat64) -> (opt Agreement) query
```

#### `signAgreement`
```candid
signAgreement : (
  agreementId: nat64,
  signature: blob
) -> (Result_2)
```

#### `getUserAgreements`
```candid
getUserAgreements : (user: Principal) -> (vec Agreement) query
```

#### `isFullySigned`
```candid
isFullySigned : (agreementId: nat64) -> (bool) query
```

### Proof Vault Canister

**Canister ID:** `<deployed_canister_id>`

**Methods:**

#### `storeProof`
```candid
storeProof : (
  agreementId: nat64,
  proofData: blob,
  attestationId: Text
) -> (Result)
```

#### `getProof`
```candid
getProof : (agreementId: nat64) -> (opt Proof) query
```

#### `verifyProof`
```candid
verifyProof : (
  agreementId: nat64,
  signature: blob
) -> (bool) query
```

---

## Payment System

Attesta uses **Thirdweb Nexus x402 micropayments** for pay-per-use API access.

### How x402 Works

1. Client requests protected endpoint
2. Server returns `402 Payment Required` with payment details
3. Client settles payment on-chain (Base Sepolia)
4. Client retries request with payment proof
5. Server validates payment and executes request

### Payment Middleware

All paid endpoints are wrapped with `withOptionalX402Payment`:

```typescript
export const POST = withOptionalX402Payment(
  handleAIGeneration,
  { endpoint: "AI_GENERATION" }
);
```

### Pricing

| Endpoint | Price | Description |
|----------|-------|-------------|
| `AI_GENERATION` | $0.10 | AI contract generation |
| `AI_EXPLANATION` | $0.05 | AI clause explanation |
| `NFT_MINTING` | $0.50 | Mint certificate NFT |
| `CONSTELLATION_VALIDATION` | $0.05 | Multi-chain validation |

### Payment Flow

**1. Initial Request (No Payment):**
```bash
POST /api/ai/generate
```

**Response (402 Payment Required):**
```json
{
  "status": 402,
  "message": "Payment required",
  "price": "$0.10",
  "resourceUrl": "https://attesta.app/api/ai/generate",
  "paymentDetails": {
    "facilitatorAddress": "0x...",
    "amount": "100000000000000000",  // 0.1 ETH equivalent
    "network": "base-sepolia"
  }
}
```

**2. Settle Payment On-Chain:**
```typescript
import { settlePayment } from '@thirdweb-dev/nexus';

const paymentResult = await settlePayment({
  resourceUrl: 'https://attesta.app/api/ai/generate',
  method: 'POST',
  price: '$0.10',
  network: 'base-sepolia',
  facilitator: facilitatorInstance
});
```

**3. Retry Request with Payment Proof:**
```bash
POST /api/ai/generate
Headers:
  x-payment: <payment_proof>
Body:
  { "description": "...", "templateType": "freelance" }
```

**Response (200 OK):**
```json
{
  "content": "FREELANCE SERVICES AGREEMENT\n\n...",
  "model": "gpt-4o-mini",
  "usage": { ... }
}
```

### Development Mode

If `NEXUS_WALLET_SECRET` is not configured, x402 payments are **disabled** and endpoints work without payment:

```
⚠️ x402 payment disabled for AI_GENERATION - configure NEXUS_WALLET_SECRET to enable
```

---

## Error Handling

### Standard Error Response

```typescript
{
  "error": string,        // Error message
  "details"?: string,     // Additional details (dev mode only)
  "code"?: string         // Error code
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `400` | Bad Request (invalid input) |
| `401` | Unauthorized (wallet not connected) |
| `402` | Payment Required (x402 micropayment) |
| `404` | Not Found (agreement/resource doesn't exist) |
| `500` | Internal Server Error |
| `503` | Service Unavailable (canister/API down) |

### Common Errors

**Missing API Key:**
```json
{
  "error": "OpenAI API key not configured",
  "code": "API_KEY_MISSING"
}
```

**Invalid Principal:**
```json
{
  "error": "Invalid principal format",
  "code": "INVALID_PRINCIPAL"
}
```

**Agreement Not Found:**
```json
{
  "error": "Agreement not found",
  "agreementId": "12345"
}
```

**Unauthorized Signer:**
```json
{
  "error": "You are not a party to this agreement",
  "code": "UNAUTHORIZED_SIGNER"
}
```

**Payment Failed:**
```json
{
  "error": "Payment processing failed",
  "message": "Insufficient funds",
  "code": "PAYMENT_FAILED"
}
```

---

## Rate Limiting

Rate limiting is handled by Vercel Edge Functions:

- **AI Generation:** 10 requests/minute per IP
- **AI Explanation:** 20 requests/minute per IP
- **Agreement Operations:** 50 requests/minute per principal

Exceeding limits returns:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Webhook Endpoints

### Thirdweb Webhook

Receives notifications for on-chain events (NFT minting, transfers).

**Endpoint:** `POST /api/webhooks/thirdweb`

**Triggered On:**
- NFT certificate minted
- NFT transferred
- Smart contract events

**Payload:**
```typescript
{
  "event": string,
  "data": {
    "tokenId": string,
    "from": string,
    "to": string,
    "transactionHash": string
  }
}
```

### Constellation Webhook

Receives DAG validation results.

**Endpoint:** `POST /api/webhooks/constellation`

**Triggered On:**
- Multi-chain proof validation complete
- DAG snapshot created

**Payload:**
```typescript
{
  "validationId": string,
  "status": "success" | "failed",
  "chains": string[],
  "snapshotHash": string
}
```

---

## SDK Usage

### TypeScript SDK

```typescript
import { AttestaClient } from '@/lib/services/agreement-service';

const client = new AttestaClient({
  network: 'mainnet', // or 'testnet'
  wallet: connectedWallet
});

// Generate agreement
const agreement = await client.generateAgreement({
  description: 'Freelance contract',
  templateType: 'freelance'
});

// Create on-chain
const agreementId = await client.createAgreement(agreement);

// Sign agreement
await client.signAgreement(agreementId);

// Mint NFT certificate
const tokenId = await client.mintCertificate(agreementId);
```

---

## Testing

### Test API Keys

Development environment uses:
- **OpenAI:** Test API key (limited to 100 requests/day)
- **Nexus:** Testnet wallet on Base Sepolia

### cURL Examples

**Generate Agreement:**
```bash
curl -X POST https://attesta.app/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Freelance web dev contract",
    "templateType": "freelance"
  }'
```

**Explain Clause:**
```bash
curl -X POST https://attesta.app/api/ai/explain \
  -H "Content-Type: application/json" \
  -d '{
    "clause": "The Contractor shall indemnify..."
  }'
```

---

## Versioning

Current API version: **v1**

All endpoints are prefixed with `/api/`

Future versions will use: `/api/v2/`, `/api/v3/`, etc.

---

## Support

- **Documentation:** https://github.com/your-repo/docs
- **Issues:** https://github.com/your-repo/issues
- **Discord:** https://discord.gg/your-server
