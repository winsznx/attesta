# Attesta User Guide

Complete guide for using the Attesta platform to create, sign, and verify legal agreements on the blockchain.

## Table of Contents

- [What is Attesta?](#what-is-attesta)
- [Getting Started](#getting-started)
- [Connecting Your Wallet](#connecting-your-wallet)
- [Creating Agreements](#creating-agreements)
- [Signing Agreements](#signing-agreements)
- [Managing Agreements](#managing-agreements)
- [NFT Certificates](#nft-certificates)
- [Verification](#verification)
- [Understanding Payments](#understanding-payments)
- [Security & Privacy](#security--privacy)
- [FAQs](#faqs)

---

## What is Attesta?

Attesta is a **blockchain-powered legal agreement platform** that allows you to:

- ✍️ **Create** legal agreements using AI
- 📝 **Sign** documents with cryptographic signatures
- 🔒 **Store** agreements on decentralized blockchain
- 🎫 **Mint** proof certificates as NFTs
- ✅ **Verify** agreement authenticity on-chain

### Why Use Attesta?

**Traditional Agreements:**
- ❌ Paper-based, easy to lose
- ❌ Centralized storage (vulnerable)
- ❌ No cryptographic proof
- ❌ Expensive legal fees

**Attesta Agreements:**
- ✅ Digital, immutable, always accessible
- ✅ Decentralized blockchain storage
- ✅ Cryptographic signatures (tamper-proof)
- ✅ AI-powered generation (cost-effective)

---

## Getting Started

### Step 1: Visit Attesta

Go to **[attesta.app](https://attesta.app)**

### Step 2: Connect Your Wallet

Click **"Connect Wallet"** in the top-right corner.

### Step 3: Choose Your Wallet Type

You can use either:
- **EVM Wallets** (MetaMask, Coinbase Wallet, etc.)
- **ICP Wallets** (Plug, Internet Identity, Stoic)

### Step 4: Approve Connection

Follow your wallet's prompts to connect to Attesta.

---

## Connecting Your Wallet

Attesta supports two types of wallets:

### EVM Wallets (Ethereum-Compatible)

**Supported Wallets:**
- MetaMask
- Coinbase Wallet
- Trust Wallet
- Rainbow
- Any WalletConnect-compatible wallet

**How to Connect:**

1. Click **"Connect Wallet"**
2. Select **"WalletConnect"** or your specific wallet
3. Approve the connection in your wallet app
4. Your EVM address will be converted to an ICP principal automatically

**Example:**
```
Your Address: 0x1234...5678
→ Converted to ICP Principal: abc12...xyz89
```

### ICP Wallets (Internet Computer)

**Supported Wallets:**
- **Plug Wallet** (Browser extension)
- **Internet Identity** (Native ICP authentication)
- **Stoic Wallet**

**How to Connect:**

1. Click **"Connect Wallet"**
2. Select **"ICP Wallet"**
3. Choose your wallet provider:
   - **Plug**: Browser extension
   - **Internet Identity**: Web-based authentication
   - **Stoic**: Mobile or browser
4. Approve the connection

**Plug Wallet Setup:**

```bash
1. Install Plug extension from Chrome Web Store
2. Create account or import existing
3. Click "Connect Wallet" on Attesta
4. Select "Plug Wallet"
5. Approve in extension popup
```

---

## Creating Agreements

### Method 1: AI Generation (Recommended)

**Step-by-Step:**

1. **Navigate to Dashboard**
   - Click **"Dashboard"** in the navigation menu

2. **Start Agreement Creation**
   - Click **"Create Agreement"** button

3. **Choose Template Type**
   - Select from:
     - 📄 Freelance Services
     - 🏠 Rental/Lease
     - 💼 Employment Contract
     - 🤝 Partnership Agreement
     - 🔒 Non-Disclosure Agreement (NDA)
     - ✏️ Custom Agreement

4. **Describe Your Needs**
   ```
   Example for Freelance Agreement:
   "Create a freelance web development contract for a 3-month
   project building an e-commerce website. Budget is $5,000.
   Include milestones for design, development, and deployment."
   ```

5. **Add Context (Optional)**
   ```
   - Payment schedule: 50% upfront, 50% on completion
   - Deliverables: Figma designs, React frontend, Node.js backend
   - Timeline: Start Feb 1, 2025; End April 30, 2025
   ```

6. **Generate with AI**
   - Click **"Generate Agreement"**
   - Wait for AI to create full legal document (~10 seconds)
   - **Cost**: $0.10 (paid via x402 micropayment)

7. **Review & Edit**
   - AI generates complete agreement
   - Review all clauses
   - Edit any section as needed
   - Click **"Save Changes"**

8. **Add Parties**
   - Add other signers by their wallet address or principal:
     - **EVM**: `0x1234...5678` (auto-converted)
     - **ICP**: `abc12...xyz89`
   - Click **"Add Party"** for each signer
   - Minimum 2 parties required (you + at least 1 other)

9. **Deploy On-Chain**
   - Review final agreement
   - Click **"Create Agreement"**
   - Confirm transaction in wallet
   - Agreement is stored on ICP blockchain

**What Happens Next:**
- You'll receive an **Agreement ID** (e.g., `#12345`)
- Other parties receive notification to sign
- You can share the agreement link with signers

### Method 2: Manual Creation

1. Click **"Create Agreement"** → **"Custom"**
2. Enter agreement title
3. Write or paste legal document content
4. Add parties manually
5. Deploy on-chain

---

## Signing Agreements

### As Agreement Creator

After creating an agreement, you can sign it immediately or wait for other parties.

### As Other Party

1. **Receive Agreement Link**
   ```
   https://attesta.app/agreements/12345
   ```

2. **Open Agreement**
   - Click the link sent by the agreement creator
   - Or navigate to **Dashboard** → **Agreements**

3. **Connect Wallet**
   - Ensure you're connected with the wallet address/principal listed as a party

4. **Review Agreement**
   - Read all clauses carefully
   - Scroll through entire document
   - Click **"I have read and understood"**

5. **Sign Agreement**
   - Click **"Sign Agreement"** button
   - Your wallet will open

6. **Wallet Signature Prompt**

   **For EVM Wallets (MetaMask):**
   ```
   Sign this message to agree to the terms:

   Agreement ID: 12345
   Agreement Hash: 0xabc123...
   Timestamp: 2025-02-01 12:00:00 UTC

   By signing, you agree to all terms in this agreement.
   ```

   **For ICP Wallets (Plug):**
   ```
   Sign this agreement with your ICP identity.

   Agreement: #12345
   Hash: abc123...
   ```

7. **Approve in Wallet**
   - Click **"Sign"** in your wallet
   - Wait for confirmation (~5 seconds)

8. **Signature Recorded**
   - You'll see: ✅ **"Signature recorded on-chain"**
   - Your signature is now immutable

### Multi-Party Signing Progress

Track who has signed:

```
Agreement Status:
✅ Alice (Creator) - Signed
✅ Bob - Signed
⏳ Carol - Pending signature

Progress: 2/3 parties signed
```

---

## Managing Agreements

### Dashboard Overview

Navigate to **Dashboard** to see:

1. **My Agreements**: Agreements you created
2. **To Sign**: Agreements waiting for your signature
3. **Signed**: Fully executed agreements
4. **Drafts**: Unfinished agreements

### Agreement Details Page

Click any agreement to view:

- **Agreement Content**: Full legal document
- **Parties**: All signers and their status
- **Signatures**: Cryptographic signatures with timestamps
- **Attestation**: On-chain proof details
- **NFT Status**: Certificate minting status

### Actions You Can Take

**On Pending Agreements:**
- 📝 Edit content (before any signatures)
- ➕ Add/remove parties (before any signatures)
- ✍️ Sign agreement
- 🗑️ Delete draft

**On Signed Agreements:**
- 👀 View content (read-only)
- 📥 Download PDF
- 🎫 Mint NFT certificate
- ✅ Verify on-chain
- 🔗 Share proof link

---

## NFT Certificates

Once an agreement is **fully signed** by all parties, you can mint it as an NFT certificate.

### Why Mint an NFT?

- 🎫 **Proof of Ownership**: NFT = verifiable proof you signed
- 💼 **Portfolio**: Showcase signed agreements (e.g., freelance work)
- 🔒 **Immutable**: NFT on blockchain, can't be altered
- 🎨 **Visual Proof**: Certificate with agreement metadata

### How to Mint

1. **Navigate to Signed Agreement**
   - Go to **Dashboard** → **Signed Agreements**
   - Click the agreement

2. **Check Eligibility**
   - Must be fully signed by all parties
   - You must be a signer

3. **Mint Certificate**
   - Click **"Mint NFT Certificate"**
   - Review certificate preview
   - Click **"Mint Now"**

4. **Pay Minting Fee**
   - **Cost**: $0.50 (via x402 micropayment)
   - Approve payment in wallet

5. **Receive NFT**
   - NFT minted to your wallet address
   - View in **Dashboard** → **Certificates**
   - Also visible in OpenSea, Rarible, etc.

### Certificate Contents

Your NFT certificate includes:

```json
{
  "tokenId": "12345",
  "agreementId": "67890",
  "title": "Freelance Web Development Agreement",
  "parties": [
    "alice.eth",
    "bob.eth"
  ],
  "signedDate": "2025-02-01T12:00:00Z",
  "proofHash": "0xabc123...",
  "attestationId": "xyz789"
}
```

### Viewing Your Certificates

**In Attesta:**
- **Dashboard** → **Certificates**
- View metadata, image, and proof

**In External NFT Marketplaces:**
- OpenSea
- Rarible
- LooksRare

**On Blockchain Explorers:**
- Etherscan (for Base Sepolia)
- View contract, token ID, metadata

---

## Verification

Anyone can verify the authenticity of an Attesta agreement.

### Verify Agreement by ID

1. **Navigate to Verification Page**
   - Click **"Verify"** in navigation
   - Or go to: `attesta.app/verify`

2. **Enter Agreement ID**
   ```
   Agreement ID: 12345
   ```

3. **View Verification Results**
   ```
   ✅ Agreement found on-chain
   ✅ All signatures verified
   ✅ Attestation valid
   ✅ No tampering detected

   Agreement Details:
   - Created: 2025-02-01
   - Parties: 3
   - Fully Signed: Yes
   - NFT Minted: Yes
   ```

### Verify by Attestation ID

```
Attestation ID: 0xabc123...
→ Shows linked agreement
```

### Verify by NFT Token ID

```
Token ID: 54321
→ Shows certificate and agreement
```

### What Gets Verified?

- ✅ **Agreement exists** on blockchain
- ✅ **Signatures are valid** (cryptographic verification)
- ✅ **Parties match** wallet addresses
- ✅ **Content hasn't been tampered** with (hash check)
- ✅ **Attestation is valid** on Sign Protocol
- ✅ **Timestamps are accurate**

---

## Understanding Payments

Attesta uses **x402 micropayments** for pay-per-use API access.

### What is x402?

- **Micropayment protocol** for on-demand services
- **Pay only when you use** (no subscriptions)
- **Powered by Thirdweb Nexus**
- **Settled on Base Sepolia** blockchain

### Pricing

| Service | Cost |
|---------|------|
| AI Agreement Generation | $0.10 |
| AI Clause Explanation | $0.05 |
| NFT Certificate Minting | $0.50 |
| Multi-chain Validation | $0.05 |

### How Payment Works

1. **Request Service**
   - Click "Generate Agreement" or "Mint NFT"

2. **Payment Required**
   - Modal appears showing cost
   ```
   AI Generation Required
   Cost: $0.10
   Network: Base Sepolia
   ```

3. **Approve Payment**
   - Click "Pay & Continue"
   - Wallet opens for approval

4. **Payment Settles**
   - Funds sent to Nexus facilitator
   - Transaction confirmed (~5 seconds)

5. **Service Delivered**
   - API request executes
   - You receive generated agreement/NFT

### Payment in Development

If you're testing on localhost or testnet:
- x402 is **disabled by default**
- All services are **free**
- No payment required

To enable payments in development:
```bash
# In .env.local
NEXUS_WALLET_SECRET=your_secret_here
```

---

## Security & Privacy

### Your Data

**What's Stored On-Chain:**
- Agreement metadata (title, parties, timestamps)
- Cryptographic signatures
- Attestation IDs
- Proof hashes

**What's NOT On-Chain:**
- Full agreement content (stored on ICP, decentralized but private)
- Personal information (only wallet addresses)
- Payment details (handled by Nexus)

### Signatures

**Cryptographic Security:**
- **EVM**: ECDSA signatures (same as Ethereum)
- **ICP**: Ed25519 signatures (ICP standard)
- **Immutable**: Signatures can't be forged or altered
- **Verifiable**: Anyone can verify authenticity

### Wallet Safety

**Best Practices:**
- ✅ Only connect to official Attesta domain
- ✅ Verify URLs before connecting wallet
- ✅ Never share private keys or seed phrases
- ✅ Use hardware wallets for high-value agreements
- ❌ Don't approve suspicious signature requests

### Agreement Privacy

**Public vs. Private:**

**Public Information:**
- Agreement exists
- Parties involved (wallet addresses)
- Signatures and timestamps
- Attestation IDs

**Private Information:**
- Agreement content (only visible to parties)
- Specific clauses (unless shared)
- Party identities (only wallet addresses shown)

**Sharing Agreements:**
- Share agreement link only with intended parties
- Links are not guessable (use random IDs)
- Only parties can view full content

---

## FAQs

### General

**Q: Do I need cryptocurrency to use Attesta?**
A: Yes, you need a small amount of ETH (on Base Sepolia) for transaction fees and micropayments. Testnet faucets provide free test ETH.

**Q: Can I use Attesta without a wallet?**
A: No, a crypto wallet is required for authentication and signatures.

**Q: Is Attesta legally binding?**
A: Agreements created on Attesta can be legally binding if they meet your jurisdiction's requirements for electronic signatures (e.g., ESIGN Act in the US). Consult a lawyer for specific legal advice.

**Q: What blockchains does Attesta use?**
A: Attesta uses **Internet Computer (ICP)** for storage and **Base Sepolia** for attestations and NFTs.

### Agreements

**Q: Can I edit an agreement after it's created?**
A: Yes, but only **before any party signs**. Once signed, agreements are immutable.

**Q: What happens if a party doesn't sign?**
A: The agreement remains in "pending" status. You can send reminders or remove/replace the party (before anyone signs).

**Q: Can I have more than 2 parties?**
A: Yes! Attesta supports multi-party agreements with up to 10 parties.

**Q: Can I delete an agreement?**
A: Draft agreements can be deleted. Signed agreements are permanent on the blockchain (can be "archived" in your dashboard).

### Wallets & Signing

**Q: I have an EVM wallet, but the other party uses ICP. Can we still sign?**
A: Yes! Attesta supports **both EVM and ICP wallets**. Each party signs with their preferred wallet type.

**Q: What if I lose access to my wallet?**
A: Unfortunately, blockchain signatures are tied to your wallet. If you lose access, you cannot prove you signed. Always backup your wallet securely.

**Q: Can I sign on mobile?**
A: Yes! Use mobile wallets like:
- MetaMask Mobile (EVM)
- Coinbase Wallet (EVM)
- Plug Mobile (ICP)

### Payments

**Q: Why do I need to pay for AI generation?**
A: AI generation uses OpenAI's API, which has per-request costs. x402 micropayments cover these API expenses.

**Q: Can I get a refund?**
A: Payments are on-chain and cannot be refunded. However, if a service fails (e.g., AI generation errors), you won't be charged.

**Q: What if I don't want to pay?**
A: You can skip AI generation and manually write your agreement for free. Only pay for services you use.

### NFTs & Verification

**Q: Do I need to mint an NFT?**
A: No, NFTs are optional. Your agreement is still valid and verifiable without an NFT. NFTs provide a portable proof certificate.

**Q: Can I sell my agreement NFT?**
A: Yes, but it may be configured as **Soulbound (non-transferable)** for certain agreement types. Check the NFT metadata.

**Q: How do I verify someone else's agreement?**
A: Go to `attesta.app/verify` and enter the Agreement ID or Attestation ID. You'll see verification results.

### Troubleshooting

**Q: My wallet won't connect. What should I do?**
A: Try:
1. Refresh the page
2. Clear browser cache
3. Try a different browser
4. Ensure wallet extension is updated
5. Check if you're on the correct network (Base Sepolia)

**Q: AI generation failed. What happened?**
A: Common causes:
- OpenAI API rate limit exceeded
- API key not configured (contact support)
- Network timeout (retry)

**Q: I can't sign an agreement. Why?**
A: Check:
- Are you connected with the correct wallet?
- Is your address listed as a party?
- Is your wallet on the right network?

---

## Support & Resources

### Get Help

- 📧 **Email**: support@attesta.app
- 💬 **Discord**: [discord.gg/attesta](https://discord.gg/attesta)
- 📖 **Docs**: [docs.attesta.app](https://docs.attesta.app)
- 🐛 **Report Bug**: [github.com/attesta/issues](https://github.com/attesta/issues)

### Learn More

- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Development Guide](./DEVELOPMENT.md)
- [Sign Protocol Docs](https://docs.sign.global)
- [Thirdweb Nexus](https://nexus.thirdweb.com)

### Video Tutorials

- 🎥 Getting Started with Attesta
- 🎥 Creating Your First Agreement
- 🎥 Multi-Party Signing Walkthrough
- 🎥 Minting NFT Certificates

---

## Glossary

**Agreement**: A legal contract stored on the blockchain

**Attestation**: Cryptographic proof of an agreement on-chain (via Sign Protocol)

**EVM**: Ethereum Virtual Machine (compatible wallets: MetaMask, Coinbase, etc.)

**ICP**: Internet Computer Protocol (decentralized blockchain for storage)

**NFT**: Non-Fungible Token (unique digital certificate of signed agreement)

**Principal**: ICP's equivalent of an address (like Ethereum addresses)

**Signature**: Cryptographic proof that you agreed to an agreement

**x402**: Micropayment protocol for pay-per-use API access

---

**Ready to get started?** Visit [attesta.app](https://attesta.app) and create your first agreement!
