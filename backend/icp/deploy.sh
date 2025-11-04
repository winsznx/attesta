#!/bin/bash

# Script to deploy ICP canisters with proper environment setup

# Source Cargo environment
export PATH="$HOME/.cargo/bin:$PATH"

# Verify Cargo is available
if ! command -v cargo &> /dev/null; then
    echo "❌ Error: Cargo not found. Please install Rust:"
    echo "   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Change to ICP directory
cd "$(dirname "$0")"

# Check if dfx is available
if ! command -v dfx &> /dev/null; then
    echo "❌ Error: dfx not found. Please install dfx:"
    echo "   sh -ci \"\$(curl -fsSL https://sdk.dfinity.org/install.sh)\""
    exit 1
fi

# Check if canister name is provided
CANISTER_NAME="${1:-agreement_manager}"

echo "🚀 Deploying canister: $CANISTER_NAME"
echo "📦 Cargo version: $(cargo --version)"
echo "🔧 dfx version: $(dfx --version)"

# Deploy the canister
dfx deploy "$CANISTER_NAME"

