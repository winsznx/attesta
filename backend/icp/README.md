# ICP Backend Setup

## Prerequisites

1. **Install Rust & Cargo**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

2. **Verify Installation**
   ```bash
   cargo --version
   rustc --version
   ```

3. **Install dfx (ICP SDK)**
   ```bash
   sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
   ```

## Building & Deploying Canisters

### Deploy Locally

```bash
# Start local replica (in separate terminal)
dfx start

# Deploy canister
dfx deploy agreement_manager

# Or deploy all canisters
dfx deploy
```

### Deploy to Mainnet

```bash
# Set your identity
dfx identity use default

# Deploy to IC
dfx deploy --network ic agreement_manager
```

## Canister Structure

- `agreement_manager/` - Main agreement storage and management
- `proof_vault/` - Cryptographic proof storage
- `witness_module/` - Anonymous reporting module
- `public_registry/` - Public agreement registry
- `constellation_bridge/` - Bridge to Constellation metagraph

## Troubleshooting

### "cargo locate-project" Error

If you see `Failed to run 'cargo locate-project'`:
1. Ensure Rust/Cargo is installed: `cargo --version`
2. Ensure you're in the `backend/icp/` directory when running `dfx deploy`
3. Try running `cargo check` in the canister directory first

### Build Errors

```bash
# Clean and rebuild
dfx clean
dfx build agreement_manager
```
