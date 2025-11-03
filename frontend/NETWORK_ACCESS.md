# Access Frontend from Other Devices

## 🔍 Your Local IP Address

**Current IP:** `172.20.10.4`

## 🚀 Quick Setup

### Option 1: Run Dev Server with Network Access

```bash
cd frontend

# Run Next.js on all network interfaces
pnpm dev -- --hostname 0.0.0.0
```

**Then access from other device:**
```
http://172.20.10.4:3000
```

### Option 2: Update package.json Script

Add this to `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:network": "next dev --hostname 0.0.0.0",
    ...
  }
}
```

**Then run:**
```bash
pnpm dev:network
```

## 📱 Access from Other Devices

1. **Same Wi-Fi Network**: Both devices must be on same network
2. **Open browser on other device**: `http://172.20.10.4:3000`
3. **Mobile phone**: Use `http://172.20.10.4:3000` in mobile browser

## ⚠️ Important Notes

### ICP Backend (localhost:4943)
- ICP canister runs on `localhost:4943`
- Other devices **cannot** access localhost canister directly
- **Solutions**:
  1. Use same device for frontend + backend
  2. Deploy ICP to mainnet (for production)
  3. Use VPN/tunnel (advanced)

### Environment Variables

Other devices need:
- Same environment variables (WalletConnect Project ID, etc.)
- Or use a shared `.env` file

## 🔧 Troubleshooting

### Can't Access from Other Device

1. **Check firewall**: Allow port 3000
   ```bash
   # macOS - check firewall settings in System Preferences
   ```

2. **Check IP address**: IP might have changed
   ```bash
   ipconfig getifaddr en0
   ```

3. **Verify server is listening**:
   ```bash
   lsof -ti:3000
   ```

4. **Try different network interface**:
   ```bash
   # WiFi usually: en0 or en1
   # Ethernet: en0
   ifconfig | grep "inet "
   ```

### Connection Refused

- Server might be running on `127.0.0.1` only
- Must use `--hostname 0.0.0.0` flag

## 📋 Quick Reference

**Your Setup:**
- **IP Address**: `172.20.10.4`
- **Port**: `3000` (default)
- **URL**: `http://172.20.10.4:3000`

**To Start:**
```bash
cd frontend
pnpm dev -- --hostname 0.0.0.0
```

**Access From:**
- Same device: `http://localhost:3000`
- Other device: `http://172.20.10.4:3000`

