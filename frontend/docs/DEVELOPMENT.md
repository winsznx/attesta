# Attesta Development Guide

Complete guide for developers contributing to or building on Attesta.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

**Required:**
- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (package manager)
- **Git**: Latest version

**Optional (for full development):**
- **dfx**: ICP SDK (for canister development)
- **Rust**: For canister development
- **Hardhat**: For smart contract development

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/your-org/attesta.git
cd attesta/frontend
```

#### 2. Install Dependencies

```bash
# Install pnpm (if not installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

#### 3. Environment Setup

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your API keys
nano .env.local
```

**Required Environment Variables:**

```bash
# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-proj-...

# Thirdweb (Optional - for x402 payments)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=...
NEXUS_WALLET_SECRET=...

# Sign Protocol
NEXT_PUBLIC_SIGN_PROTOCOL_CHAIN_ID=84532  # Base Sepolia

# ICP Canister IDs (update after deployment)
NEXT_PUBLIC_AGREEMENT_CANISTER_ID=...
NEXT_PUBLIC_PROOF_VAULT_CANISTER_ID=...

# Wallet Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
```

#### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Workflow

### Standard Workflow

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# ... edit files ...

# 3. Test locally
pnpm dev
pnpm test
pnpm lint

# 4. Commit changes
git add .
git commit -m "feat: Add your feature description"

# 5. Push to remote
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub
```

### Git Branch Strategy

```
main
 ├── develop
 │   ├── feature/agreement-templates
 │   ├── feature/multi-party-signing
 │   └── fix/wallet-connection-bug
 └── hotfix/critical-security-patch
```

**Branches:**
- `main`: Production-ready code
- `develop`: Development branch (default)
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Critical production fixes

### Commit Message Convention

We use **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process, dependencies

**Examples:**

```bash
# Feature
git commit -m "feat(ai): Add NDA template generation"

# Bug fix
git commit -m "fix(wallet): Resolve ICP wallet connection timeout"

# Documentation
git commit -m "docs: Update API documentation for signing flow"

# Multiple line
git commit -m "feat(payment): Integrate x402 micropayments

- Add payment middleware
- Implement payment modal UI
- Add Nexus facilitator configuration

Closes #123"
```

---

## Project Structure

```
frontend/
├── .next/                      # Next.js build output (auto-generated)
├── docs/                       # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   └── USER_GUIDE.md
├── node_modules/               # Dependencies
├── public/                     # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes (no auth)
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── about/
│   │   │   ├── pricing/
│   │   │   └── privacy/
│   │   ├── (auth)/            # Auth pages
│   │   │   └── connect/       # Wallet connection
│   │   ├── dashboard/         # Protected dashboard
│   │   │   ├── agreements/
│   │   │   ├── certificates/
│   │   │   ├── verify/
│   │   │   └── analytics/
│   │   ├── api/               # API routes
│   │   │   ├── ai/
│   │   │   │   ├── generate/
│   │   │   │   └── explain/
│   │   │   └── webhooks/
│   │   ├── layout.tsx         # Root layout
│   │   └── loading.tsx        # Loading UI
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/            # Layout components
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppFooter.tsx
│   │   │   └── AppSidebar.tsx
│   │   ├── modals/            # Modal dialogs
│   │   ├── landing/           # Landing page sections
│   │   ├── payment/           # Payment components
│   │   └── providers/         # Context providers
│   ├── lib/
│   │   ├── blockchain/        # Blockchain integration
│   │   │   ├── icp/          # ICP canisters
│   │   │   │   ├── agent.ts
│   │   │   │   ├── actors.ts
│   │   │   │   ├── address-converter.ts
│   │   │   │   └── candid/   # Candid interfaces
│   │   │   ├── ethereum/     # EVM contracts
│   │   │   │   └── nft.ts
│   │   │   ├── constellation/ # Cross-chain DAG
│   │   │   └── thirdweb/     # Payment & wallet
│   │   │       ├── client.ts
│   │   │       ├── payment-middleware.ts
│   │   │       └── x402-facilitator.ts
│   │   ├── services/         # Business logic
│   │   │   ├── agreements.ts
│   │   │   ├── agreement-service.ts
│   │   │   └── proof-vault.ts
│   │   ├── hooks/            # React hooks
│   │   │   ├── useWallet.ts
│   │   │   ├── useAgreements.ts
│   │   │   ├── useX402Payment.ts
│   │   │   └── useAgreementData.ts
│   │   ├── constants/        # Constants & config
│   │   │   ├── networks.ts
│   │   │   └── contracts.ts
│   │   ├── config/           # App configuration
│   │   │   └── appkit.ts
│   │   ├── types/            # TypeScript types
│   │   └── utils.ts          # Utility functions
│   └── styles/
│       └── globals.css        # Global styles
├── .env.example               # Example environment variables
├── .env.local                 # Local environment (gitignored)
├── .gitignore
├── next.config.js             # Next.js configuration
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js          # PostCSS config
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
└── README.md
```

---

## Coding Standards

### TypeScript

**Use strict typing:**

```typescript
// ✅ Good
interface Agreement {
  id: bigint;
  title: string;
  parties: Principal[];
  createdAt: bigint;
}

function createAgreement(data: Agreement): Promise<bigint> {
  // ...
}

// ❌ Bad
function createAgreement(data: any): Promise<any> {
  // ...
}
```

**Use type inference when obvious:**

```typescript
// ✅ Good
const agreements = await getAgreements(); // Type inferred from function

// ❌ Bad (redundant)
const agreements: Agreement[] = await getAgreements();
```

### React Components

**Use functional components:**

```typescript
// ✅ Good
export function AgreementCard({ agreement }: { agreement: Agreement }) {
  return <div>...</div>;
}

// ❌ Bad (class components)
export class AgreementCard extends React.Component {
  render() {
    return <div>...</div>;
  }
}
```

**Props interface:**

```typescript
// ✅ Good
interface AgreementCardProps {
  agreement: Agreement;
  onSign?: () => void;
  className?: string;
}

export function AgreementCard({ agreement, onSign, className }: AgreementCardProps) {
  // ...
}

// ❌ Bad (inline types)
export function AgreementCard({ agreement, onSign }: { agreement: any, onSign: any }) {
  // ...
}
```

### File Naming

- **Components**: PascalCase (e.g., `AgreementCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWallet.ts`)
- **Types**: PascalCase (e.g., `Agreement.ts`)
- **Constants**: UPPER_SNAKE_CASE or camelCase (e.g., `PAYMENT_CONFIG`)

### Code Formatting

We use **Prettier** for automatic formatting:

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

**Prettier Config** (`.prettierrc`):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Linting

We use **ESLint** for code quality:

```bash
# Run linter
pnpm lint

# Auto-fix issues
pnpm lint:fix
```

**ESLint Rules** (`.eslintrc.json`):
```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

---

## Testing

### Unit Tests

We use **Jest** + **React Testing Library**:

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

**Example Test:**

```typescript
// __tests__/components/AgreementCard.test.tsx
import { render, screen } from '@testing-library/react';
import { AgreementCard } from '@/components/AgreementCard';

describe('AgreementCard', () => {
  it('renders agreement title', () => {
    const agreement = {
      id: 1n,
      title: 'Freelance Agreement',
      parties: [],
      createdAt: BigInt(Date.now())
    };

    render(<AgreementCard agreement={agreement} />);

    expect(screen.getByText('Freelance Agreement')).toBeInTheDocument();
  });

  it('calls onSign when button clicked', () => {
    const onSign = jest.fn();
    render(<AgreementCard agreement={mockAgreement} onSign={onSign} />);

    const signButton = screen.getByRole('button', { name: /sign/i });
    signButton.click();

    expect(onSign).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Tests

Test interactions between components:

```typescript
// __tests__/integration/agreement-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgreementPage from '@/app/dashboard/agreements/page';

describe('Agreement Creation Flow', () => {
  it('creates agreement from AI generation', async () => {
    render(<AgreementPage />);

    // Click create button
    const createButton = screen.getByRole('button', { name: /create/i });
    await userEvent.click(createButton);

    // Fill form
    const input = screen.getByLabelText(/description/i);
    await userEvent.type(input, 'Freelance web development agreement');

    // Submit
    const submitButton = screen.getByRole('button', { name: /generate/i });
    await userEvent.click(submitButton);

    // Wait for AI generation
    await waitFor(() => {
      expect(screen.getByText(/agreement created/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
pnpm test:e2e

# Run in UI mode
pnpm test:e2e:ui
```

**Example E2E Test:**

```typescript
// e2e/agreement.spec.ts
import { test, expect } from '@playwright/test';

test('user can create and sign agreement', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Connect wallet
  await page.click('button:has-text("Connect Wallet")');
  await page.click('button:has-text("MetaMask")');

  // Navigate to agreements
  await page.click('a:has-text("Agreements")');

  // Create agreement
  await page.click('button:has-text("Create Agreement")');
  await page.fill('input[name="description"]', 'Test agreement');
  await page.click('button:has-text("Generate with AI")');

  // Wait for AI generation
  await expect(page.locator('text=Agreement created')).toBeVisible();

  // Sign agreement
  await page.click('button:has-text("Sign Agreement")');
  await page.click('button:has-text("Confirm")');

  // Verify signature
  await expect(page.locator('text=Signature recorded')).toBeVisible();
});
```

---

## Debugging

### Browser DevTools

**React DevTools:**
- Install React DevTools extension
- Inspect component tree and state

**Console Logging:**

```typescript
// Development-only logs
if (process.env.NODE_ENV === 'development') {
  console.log('[DEBUG] Agreement data:', agreement);
}

// Use structured logging
console.group('Agreement Creation');
console.log('Title:', title);
console.log('Parties:', parties);
console.groupEnd();
```

### Next.js Debugging

**Enable verbose logging:**

```bash
# In .env.local
DEBUG=* pnpm dev
```

**API Route Debugging:**

```typescript
// src/app/api/ai/generate/route.ts
export async function POST(request: NextRequest) {
  console.log('[AI Generation] API called');
  console.log('[AI Generation] Request headers:', request.headers);
  console.log('[AI Generation] Request body:', await request.json());

  // ... handler logic
}
```

### Canister Debugging

**dfx logs:**

```bash
# Watch canister logs
dfx canister logs agreement_manager --follow

# Get specific call trace
dfx canister call agreement_manager getAgreement '(1)' --trace
```

**Canister debugging in Rust:**

```rust
use ic_cdk::println;

#[ic_cdk::update]
fn create_agreement(title: String) -> Result<u64, String> {
    println!("[DEBUG] Creating agreement: {}", title);

    // ... logic

    println!("[DEBUG] Agreement created with ID: {}", id);
    Ok(id)
}
```

### VSCode Debugging

**Launch configuration** (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

---

## Common Tasks

### Adding a New Component

```bash
# Create component file
touch src/components/MyComponent.tsx

# Add component code
cat > src/components/MyComponent.tsx << 'EOF'
export interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
EOF

# Create test file
touch src/components/__tests__/MyComponent.test.tsx
```

### Adding a New API Route

```bash
# Create route directory
mkdir -p src/app/api/my-endpoint

# Create route handler
touch src/app/api/my-endpoint/route.ts

# Add route code
cat > src/app/api/my-endpoint/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Handle request
  return NextResponse.json({ success: true });
}
EOF
```

### Adding a New Page

```bash
# Create page file
touch src/app/my-page/page.tsx

# Add page code
cat > src/app/my-page/page.tsx << 'EOF'
export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
}
EOF
```

### Deploying Canisters

```bash
# Start local replica
dfx start --background

# Deploy canisters locally
dfx deploy

# Deploy to IC mainnet
dfx deploy --network ic

# Get canister IDs
dfx canister id agreement_manager
dfx canister id proof_vault
```

### Deploying Smart Contracts

```bash
# Compile contracts
pnpm compile

# Deploy to testnet
pnpm deploy:base-sepolia

# Verify on Etherscan
pnpm verify:base-sepolia <contract_address>
```

### Updating Dependencies

```bash
# Check outdated packages
pnpm outdated

# Update all dependencies
pnpm update

# Update specific package
pnpm update next@latest

# Update pnpm lockfile
pnpm install --lockfile-only
```

---

## Contributing

### Pull Request Process

1. **Fork the repository**
2. **Create feature branch** from `develop`
3. **Make your changes**
4. **Write tests** for new functionality
5. **Run linter and tests**:
   ```bash
   pnpm lint
   pnpm test
   ```
6. **Commit with conventional commits**
7. **Push to your fork**
8. **Create Pull Request** to `develop` branch

### PR Guidelines

**PR Title:**
```
feat(scope): Brief description of changes
```

**PR Description Template:**

```markdown
## Description
Brief description of what this PR does.

## Changes
- List of changes made
- Another change

## Testing
- How to test these changes
- Test cases covered

## Screenshots (if UI changes)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Builds successfully
```

### Code Review

All PRs require:
- ✅ At least 1 approval
- ✅ All CI checks passing
- ✅ No merge conflicts
- ✅ Code coverage not decreased

---

## Troubleshooting

### Common Issues

#### "Module not found" error

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Restart dev server
pnpm dev
```

#### "OpenAI API key not configured"

```bash
# Check .env.local exists
cat .env.local | grep OPENAI_API_KEY

# If missing, add it
echo "OPENAI_API_KEY=sk-proj-..." >> .env.local

# Restart dev server
pnpm dev
```

#### Wallet connection timeout

```typescript
// Increase timeout in wallet config
// src/lib/config/appkit.ts
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  timeout: 30000, // Increase to 30 seconds
});
```

#### Canister calls failing

```bash
# Check dfx is running
dfx ping

# If not running, start it
dfx start --background

# Redeploy canisters
dfx deploy
```

#### TypeScript errors after update

```bash
# Regenerate types
pnpm type-check

# If still errors, clear cache
rm -rf node_modules/.cache
pnpm dev
```

### Getting Help

- **Documentation**: Check `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/your-org/attesta/issues)
- **Discord**: [Join our Discord](https://discord.gg/your-server)
- **Email**: dev@attesta.app

---

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [ICP Developer Docs](https://internetcomputer.org/docs)
- [Thirdweb Docs](https://portal.thirdweb.com)
