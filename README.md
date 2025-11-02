# Attesta - Multi-Chain Legal Document Platform

A decentralized platform for creating, signing, and verifying legal agreements using multiple blockchains.

## Architecture

```
Frontend (Next.js) → WalletConnect Kit (Universal Auth)
    │
    ├── ICP (Core Backend)
    ├── Constellation (Validation Layer)
    ├── Ethereum (Certificate Layer)
    └── x402 (Identity Layer)
```

## Features

- AI-powered contract generation
- Multi-party wallet-based signing
- Multi-chain notarization (ICP, Constellation, Ethereum)
- NFT certificate minting
- Anonymous whistleblower reporting
- Public verification

## Getting Started

See [docs/DEVELOPER.md](docs/DEVELOPER.md) for setup instructions.

## Project Structure

- `frontend/` - Next.js 14+ application
- `backend/icp/` - Internet Computer canisters
- `backend/constellation/` - Constellation metagraph
- `contracts/` - Ethereum smart contracts
- `ai/` - AI service layer

## License

See LICENSE file.

