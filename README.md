# Attesta - Multi-Chain Legal Agreement Platform

> Verify anything, prove everything. AI-powered legal agreements with blockchain-backed proof across ICP, Constellation, and Ethereum.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![ICP Mainnet](https://img.shields.io/badge/ICP-Mainnet-29ABE2)](https://dashboard.internetcomputer.org)
[![Constellation](https://img.shields.io/badge/Constellation-TestNet-blueviolet)](https://testnet-explorer.constellationnetwork.io)

## 🌟 Overview

Attesta is a production-ready legal document platform that leverages multiple blockchain networks to provide unprecedented security and verification:

- **ICP (Internet Computer)**: Primary storage and state management on mainnet
- **Constellation Network**: DAG-based validation with HGTP protocol
- **Ethereum/Base**: NFT certificate minting for visual proof
- **AI Generation**: GPT-4 powered document creation with X402 micropayments

## 🎯 Live Deployment

### ICP Mainnet Canisters
- **Agreement Manager**: [`g5tri-niaaa-aaaag-auhuq-cai`](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=g5tri-niaaa-aaaag-auhuq-cai)
- **Proof Vault**: [`guq2u-3aaaa-aaaag-auhva-cai`](https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=guq2u-3aaaa-aaaag-auhva-cai)

### Ethereum Contracts
- **NFT Certificate (Base Sepolia)**: [`0xb149C3f586098aa78d892FBEeF5361c8296B5697`](https://sepolia.basescan.org/address/0xb149C3f586098aa78d892FBEeF5361c8296B5697)

### Constellation Network
- **Network**: TestNet L0 Global Network
- **Protocol**: HGTP 1.0 compliant
- **Validation**: Real-time DAG proof generation

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  • Multi-wallet support (WalletConnect, AppKit)         │
│  • AI document generation with payment modal            │
│  • Real-time multi-chain validation                     │
└──────────────┬──────────────┬──────────────┬───────────┘
               │              │              │
       ┌───────▼──────┐  ┌───▼────────┐  ┌─▼──────────┐
       │              │  │            │  │            │
       │   ICP        │  │Constellation│  │ Ethereum   │
       │   Mainnet    │  │  TestNet   │  │Base Sepolia│
       │              │  │            │  │            │
       │ • Agreements │  │ • DAG Hash │  │ • NFT Cert │
       │ • Storage    │  │ • HGTP     │  │ • ERC-721  │
       │ • Rust       │  │ • Proof    │  │ • Solidity │
       └──────────────┘  └────────────┘  └────────────┘
```

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js & npm
node --version  # v18.0.0 or higher
npm --version   # v8.0.0 or higher

# For ICP development
dfx --version   # v0.22.0 or higher

# Rust (for ICP canisters)
rustc --version # v1.70.0 or higher
```

### Installation

```bash
# Clone the repository
git clone https://github.com/winsznx/attesta.git
cd attesta

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (ICP)
cd ../backend/icp
cargo build
```

## ⚙️ Environment Configuration

### Step 1: Copy Environment Template

```bash
cd frontend
cp .env.example .env.local
```

### Step 2: Configure Required Variables

Open `.env.local` and fill in the following:

#### 🔑 **Required for Development:**

```bash
# WalletConnect Project ID (Get from: https://cloud.reown.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# OpenAI API Key (Get from: https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...your_key_here

# Nexus Wallet Secret (Get from: https://nexus.thirdweb.com)
NEXUS_WALLET_SECRET=your_secret_here
```

#### 🌐 **Network Configuration:**

**For Mainnet (Production):**
```bash
NEXT_PUBLIC_AGREEMENT_MANAGER_CANISTER_ID=g5tri-niaaa-aaaag-auhuq-cai
NEXT_PUBLIC_PROOF_VAULT_CANISTER_ID=guq2u-3aaaa-aaaag-auhva-cai
NEXT_PUBLIC_ICP_HOST=https://icp-api.io
NEXT_PUBLIC_CONSTELLATION_NETWORK=testnet
```

**For Local Development:**
```bash
# Start local ICP replica first: cd backend/icp && dfx start
NEXT_PUBLIC_AGREEMENT_MANAGER_CANISTER_ID=your_local_canister_id
NEXT_PUBLIC_PROOF_VAULT_CANISTER_ID=your_local_canister_id
NEXT_PUBLIC_ICP_HOST=http://localhost:4943
NEXT_PUBLIC_CONSTELLATION_NETWORK=testnet
```

#### 🔐 **Important Security Notes:**

- ⚠️ **NEVER commit `.env.local` to git!**
- ✅ `.env.local` is already in `.gitignore`
- ✅ Use `.env.example` as a reference only
- ✅ Use different keys for development and production
- ✅ Keep your private keys secure

### Step 3: Verify Configuration

```bash
# Check that .env.local exists and is not tracked by git
ls -la .env.local  # Should exist
git status         # Should NOT show .env.local
```

## 🏃 Running the Application

### Option 1: Production (Mainnet)

```bash
# Frontend connects to deployed ICP mainnet canisters
cd frontend
npm run dev

# Access at http://localhost:3000
# Or from network: http://YOUR_IP:3000
```

### Option 2: Local Development

```bash
# Terminal 1: Start ICP replica
cd backend/icp
dfx start --clean

# Terminal 2: Deploy canisters
dfx deploy

# Terminal 3: Start frontend
cd frontend
npm run dev
```

## 🌍 Deploying to Production

### Frontend Deployment (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard:
# https://vercel.com/dashboard/project/settings/environment-variables
```

### ICP Mainnet Deployment (Already Done!)

```bash
# Create secure identity
dfx identity new attesta_mainnet
dfx identity use attesta_mainnet

# Redeem cycles coupon
dfx cycles redeem-faucet-coupon YOUR_COUPON_CODE --network ic

# Create and deploy canisters
dfx canister create --all --network ic
dfx build --network ic
dfx deploy --network ic

# Note the canister IDs and update frontend .env.local
```

## 🧪 Testing

### Test ICP Canisters (Local)

```bash
cd backend/icp

# Test agreement creation
dfx canister call agreement_manager create_agreement '(
  "freelance",
  "Test Agreement",
  "hash123",
  vec {principal "aaaaa-aa"}
)'
```

### Test Constellation Integration

```bash
# Check console logs when creating an agreement
# Look for: ✅ Constellation validation created
```

### Test Frontend

```bash
cd frontend
npm test              # Run unit tests
npm run build         # Test production build
npm run type-check    # Check TypeScript errors
```

## 📁 Project Structure

```
attesta/
├── frontend/                # Next.js 14 App Router
│   ├── src/
│   │   ├── app/            # Pages and API routes
│   │   ├── components/     # React components
│   │   ├── lib/            # Core libraries
│   │   │   ├── blockchain/ # Multi-chain clients
│   │   │   │   ├── icp/           # ICP integration
│   │   │   │   ├── constellation/ # Constellation client
│   │   │   │   └── ethereum/      # Ethereum/Base
│   │   │   ├── hooks/      # React hooks
│   │   │   └── services/   # Business logic
│   │   └── contracts/      # Solidity contracts
│   ├── .env.example        # Environment template
│   └── package.json
│
├── backend/
│   └── icp/                # ICP Rust canisters
│       ├── canisters/
│       │   ├── agreement_manager/  # Main canister
│       │   └── proof_vault/        # Proof storage
│       ├── dfx.json        # ICP configuration
│       └── Cargo.toml
│
├── LICENSE                 # MIT License
└── README.md              # This file
```

## 🔑 Key Features

### 1. Multi-Chain Validation
- **ICP**: Primary storage with Rust canisters
- **Constellation**: DAG-based immutable proof
- **Ethereum**: NFT certificates for visual ownership

### 2. AI Document Generation
- GPT-4 powered legal document creation
- Template-based generation (NDA, Employment, etc.)
- X402 micropayment protection ($0.10 per generation)

### 3. X402 Micropayments (Nexus)
- Pay-per-use API model
- Thirdweb Nexus integration
- Payment modal with wallet connection

### 4. Production-Ready
- TypeScript + Rust
- Error handling and timeouts
- Responsive UI with Tailwind CSS
- Multi-wallet support

## 🎥 Demo Video

[Link to demo video] - Coming soon!

**What the demo shows:**
1. Complete agreement creation flow
2. AI document generation with payment
3. Multi-chain validation (ICP + Constellation + Ethereum)
4. NFT certificate minting
5. Code walkthrough and architecture
6. Live mainnet canisters

## 🏆 Hackathon Submission

### ICP Track
- ✅ Mainnet deployment with 6TC cycles
- ✅ Rust canisters with stable storage
- ✅ Multi-party signing mechanism
- ✅ Professional code quality

### Constellation Track
- ✅ HGTP protocol implementation
- ✅ L0 Global Network integration
- ✅ DAG-based validation
- ✅ Real-time network status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **ICP Dashboard**: https://dashboard.internetcomputer.org
- **Constellation Explorer**: https://testnet-explorer.constellationnetwork.io
- **Base Sepolia Explorer**: https://sepolia.basescan.org
- **Documentation**: [Coming soon]

## 👥 Team

Built for ICP + Constellation Hackathon 2024

## 🙏 Acknowledgments

- Internet Computer Protocol (DFINITY)
- Constellation Network
- Thirdweb Nexus
- OpenAI
- The blockchain community

---

**⚠️ Important**: This is hackathon/demo software. For production use, conduct thorough security audits and legal review.
