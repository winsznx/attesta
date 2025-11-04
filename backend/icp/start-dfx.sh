#!/bin/bash

# Fix PocketIC and Color errors when starting dfx

# Source Cargo if needed
source "$HOME/.cargo/env" 2>/dev/null

# Kill any existing dfx processes
pkill -9 dfx 2>/dev/null
pkill -9 pocketic 2>/dev/null

# Clear port if needed
lsof -ti:4943 | xargs kill -9 2>/dev/null

# Change to ICP directory
cd "$(dirname "$0")" || exit

# Start dfx with legacy replica (bypass PocketIC)
# Disable color to avoid terminal color errors
TERM=dumb NO_COLOR=1 dfx start --background

# Wait a moment and check if it started
sleep 3

# Verify it's running
if dfx ping 2>/dev/null | grep -q "ic_api_version"; then
    echo "✅ dfx started successfully!"
    echo "📡 Local replica running on http://127.0.0.1:4943"
else
    echo "⚠️  dfx may not have started properly"
    echo "Try running: dfx start (without --background) to see errors"
fi

