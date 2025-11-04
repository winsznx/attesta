# Attesta - Multi-Chain Legal Document Platform

Blockchain-backed legal agreement platform with AI-powered contract generation, multi-party signing, and automated certificate NFT minting.

## Overview

Attesta enables users to create, sign, and verify legal agreements with cryptographic proof across multiple blockchains. AI assistance simplifies contract creation, while multi-chain storage ensures tamper-proof records and public verifiability.

**Core Features:**
- AI-powered legal document generation (OpenAI)
- Multi-chain notarization (ICP + Constellation + Ethereum)
- Multi-party EVM wallet signing
- Automated NFT certificate minting
- Public verification system
- Micropayment-protected API endpoints (x402 + Thirdweb Nexus)

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 14, Tailwind, Shadcn UI | User interface |
| **Authentication** | WalletConnect, Internet Identity | Multi-wallet support |
| **AI** | OpenAI GPT-4 | Contract generation |
| **Primary Storage** | Internet Computer (ICP) | Agreement storage & logic |
| **Validation** | Constellation DAG | Data validation |
| **Certificates** | Ethereum (Base Sepolia) | ERC-721 NFT certificates |
| **Payments** | Thirdweb Nexus | Micropayments (x402) |

## Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (Next.js + WalletConnect)     │
│  React UI + AI Assistant                │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┬────────┬─────────┐
    │        │        │        │         │
┌───▼───┐ ┌─▼───┐ ┌──▼────┐ ┌─▼──┐ ┌────▼────┐
│  ICP  │ │Const│ │Ethereum│ │x402│ │ Nexus   │
│Storage│ │ DAG │ │  NFTs  │ │Pay │ │Gateway  │
└───────┘ └─────┘ └────────┘ └────┘ └─────────┘
```

## Project Structure

```
attesta/
├── frontend/                    # Next.js Application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── (public)/       # Landing page
│   │   │   ├── dashboard/      # User dashboard
│   │   │   └── api/            # API routes
│   │   ├── components/         # React components
│   │   │   ├── dashboard/      # Dashboard UI
│   │   │   ├── agreements/     # Agreement forms
│   │   │   ├── wallet/         # Wallet connection
│   │   │   └── ui/             # Reusable components
│   │   └── lib/
│   │       ├── blockchain/     # Blockchain clients
│   │       │   ├── icp/        # ICP integration
│   │       │   ├── constellation/ # DAG validation
│   │       │   ├── ethereum/   # NFT minting
│   │       │   └── thirdweb/   # Nexus + x402
│   │       ├── hooks/          # React hooks
│   │       └── services/       # Business logic
│   ├── contracts/              # Smart contracts
│   │   └── AttestaCertificate.sol  # ERC-721 NFT
│   ├── scripts/                # Deployment scripts
│   └── public/                 # Static assets
│
└── backend/
    └── icp/                    # Internet Computer Backend
        └── canisters/
            ├── agreement_manager/  # CRUD operations
            └── proof_vault/        # Signature storage
```

## Quick Start

### Prerequisites

```bash
# Node.js 18+
node --version

# pnpm (recommended)
npm install -g pnpm

# ICP dfx CLI
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Rust (for ICP canisters)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

### Installation

```bash
# Clone repository
cd attesta/frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys (see Configuration section)

# Start ICP local replica (in separate terminal)
cd ../backend/icp
dfx start --background

# Deploy ICP canisters
dfx deploy

# Return to frontend and start development server
cd ../../frontend
pnpm dev
```

Open http://localhost:3000

### Configuration

Create `.env.local` with the following:

```bash
# WalletConnect (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# ICP Canister IDs (auto-generated after dfx deploy)
NEXT_PUBLIC_AGREEMENT_MANAGER_CANISTER_ID=your_canister_id
NEXT_PUBLIC_PROOF_VAULT_CANISTER_ID=your_canister_id
NEXT_PUBLIC_ICP_HOST=http://localhost:4943

# OpenAI for AI contract generation
OPENAI_API_KEY=sk-...

# Thirdweb Nexus for micropayments
NEXUS_WALLET_SECRET=your_wallet_secret

# Base Sepolia (testnet) - NFT contract
NEXT_PUBLIC_NFT_CONTRACT_BASE_SEPOLIA=0xb149C3f586098aa78d892FBEeF5361c8296B5697

# Deployment keys (for production)
DEPLOYER_PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_api_key
```

## User Flow

1. **Connect Wallet** - User connects EVM wallet via WalletConnect
2. **Create Agreement** - AI generates legal document from user description
3. **Add Parties** - User specifies signing parties (wallet addresses)
4. **Store on ICP** - Agreement stored on Internet Computer with hash
5. **Multi-Party Signing** - Parties sign with their wallets
6. **Automated Minting** - After all signatures, NFT certificate auto-mints on Base Sepolia
7. **Constellation Validation** - Agreement validated on DAG network
8. **Certificate Delivery** - User receives NFT + downloadable proof
9. **Public Verification** - Anyone can verify authenticity via blockchain

## Smart Contract Deployment

### Deploy NFT Contract to Base Sepolia

```bash
cd frontend

# Compile contracts
pnpm compile

# Deploy to Base Sepolia testnet
pnpm deploy:base-sepolia

# Verify on BaseScan
pnpm verify:base-sepolia <contract_address>
```

**Deployed Contract**: `0xb149C3f586098aa78d892FBEeF5361c8296B5697` (Base Sepolia)
**View on BaseScan**: https://sepolia.basescan.org/address/0xb149C3f586098aa78d892FBEeF5361c8296B5697

### Contract Features

- ERC-721 NFT standard
- On-chain agreement ID and content hash storage
- Multi-chain proof tracking (ICP canister ID, Constellation DAG hash)
- Certificate verification functions
- Pausable for emergency stops
- ReentrancyGuard for security
- Owner-only minting

## ICP Canister Deployment

```bash
cd backend/icp

# Start local replica
dfx start --background

# Deploy canisters
dfx deploy

# Test canister
dfx canister call agreement_manager create_agreement '("nda", "Test Agreement", "hash123", vec {})'
```

### Production Deployment (IC Mainnet)

```bash
# Deploy to mainnet
dfx deploy --network ic

# Your canisters will be live at:
# https://<canister-id>.icp0.io
```

## API Endpoints

### AI Generation (`POST /api/ai/generate`)

Generates legal documents using OpenAI GPT-4.

**Payment**: $0.10 per generation (via x402 + Nexus)

**Request**:
```json
{
  "description": "NDA for software development project",
  "templateType": "nda",
  "context": "5-year term, mutual confidentiality"
}
```

**Response**:
```json
{
  "content": "# NON-DISCLOSURE AGREEMENT\n\n...",
  "model": "gpt-4o-mini",
  "usage": { "total_tokens": 1234 }
}
```

### Payment Middleware (x402)

Protected endpoints automatically handle micropayments via Thirdweb Nexus:

```typescript
// Example: Protect API route with payment
export const POST = withX402Payment(
  async (request) => {
    // Your API logic
    return Response.json({ data: "success" });
  },
  { endpoint: "AI_GENERATION" }
);
```

**Configured Endpoints**:
- AI Generation: $0.10
- AI Explanation: $0.05
- NFT Minting: $0.50
- Constellation Validation: $0.05

**Network**: Base Sepolia testnet

## Development

### Commands

```bash
# Frontend
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript validation

# Smart Contracts
pnpm compile          # Compile Solidity contracts
pnpm deploy:base-sepolia  # Deploy to Base Sepolia

# ICP Canisters
dfx start --background    # Start local replica
dfx deploy                # Deploy canisters
dfx canister call <name> <method> '<args>'  # Call canister
```

### Testing

```bash
# ICP canister tests
cd backend/icp
cargo test

# Frontend tests (when implemented)
cd frontend
pnpm test
```

## Stub Files (Not Yet Implemented)

The following pages are stubs awaiting implementation:

1. `/src/app/(public)/about/page.tsx` - About page
2. `/src/app/(public)/pricing/page.tsx` - Pricing page
3. `/src/app/dashboard/analytics/page.tsx` - Analytics dashboard
4. `/src/app/dashboard/reports/submit/page.tsx` - Report submission
5. `/src/app/dashboard/certificates/[tokenId]/page.tsx` - Certificate details
6. `/src/app/api/ai/explain/route.ts` - AI explanation endpoint

## Security Features

### Smart Contract Security
- **ReentrancyGuard** - Prevents reentrancy attacks
- **Pausable** - Emergency stop mechanism
- **Ownable** - Access control for minting
- **Verification Functions** - On-chain certificate validation

### Application Security
- **x402 Micropayments** - Rate limiting via payment
- **Content Hashing** - SHA-256 for tamper detection
- **Multi-Chain Verification** - Cross-reference across 3 blockchains
- **Wallet Authentication** - Cryptographic signature verification

## Troubleshooting

### ICP Connection Issues

```bash
# Check if dfx is running
dfx ping

# Restart replica
dfx stop
dfx start --clean --background

# Redeploy canisters
dfx deploy
```

### Wallet Connection Issues

- Ensure WalletConnect Project ID is set in `.env.local`
- Check browser console for errors
- Try clearing browser cache
- Verify wallet extension is installed

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

## Production Deployment

### Frontend (Vercel/ICP)

```bash
# Build production bundle
pnpm build

# Deploy to ICP (via asset canister)
dfx deploy frontend --network ic

# Or deploy to Vercel
vercel deploy
```

### Environment Variables (Production)

Ensure all production values are set:
- Switch `NEXT_PUBLIC_ICP_HOST` to mainnet
- Update canister IDs to production IDs
- Use production API keys
- Deploy NFT contract to Base mainnet

## License

MIT

## Repository

https://github.com/yourusername/attesta
