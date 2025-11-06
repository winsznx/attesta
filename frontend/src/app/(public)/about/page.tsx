import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Shield, Zap, Globe, Users, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-fuchsia-600 dark:text-fuchsia-400">
              About Attesta
            </h1>
            <p className="text-xl text-muted-foreground">
              Your legal truth layer powered by AI and blockchain
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Attesta is revolutionizing legal document verification by combining the power of AI and
              multi-chain blockchain technology. We make it easy to create, sign, and verify legal
              agreements with cryptographic proof that lasts forever.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our platform eliminates the need for centralized intermediaries while ensuring your
              documents are secure, verifiable, and legally binding across multiple blockchain networks.
            </p>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">How Attesta Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-fuchsia-600 dark:bg-fuchsia-500 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
                  <p className="text-muted-foreground">
                    Use OpenAI to generate legal documents from simple descriptions. No legal expertise required.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-fuchsia-600 dark:bg-fuchsia-500 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Multi-Party Signing</h3>
                  <p className="text-muted-foreground">
                    All parties sign with their blockchain wallets. Each signature is cryptographically secured.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-fuchsia-600 dark:bg-fuchsia-500 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Multi-Chain Notarization</h3>
                  <p className="text-muted-foreground">
                    Documents are stored on ICP, validated on Constellation DAG, and certified as NFTs on Ethereum.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-fuchsia-600 dark:bg-fuchsia-500 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Permanent Verification</h3>
                  <p className="text-muted-foreground">
                    Anyone can verify document authenticity using a hash or NFT token ID. Proof is immutable.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Internet Computer (ICP)</h3>
                <p className="text-sm text-muted-foreground">
                  Primary storage and business logic execution with canister smart contracts.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Constellation Network</h3>
                <p className="text-sm text-muted-foreground">
                  Scalable DAG validation layer for real-time compliance checking.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Ethereum & Base</h3>
                <p className="text-sm text-muted-foreground">
                  NFT certificate issuance via Thirdweb for portable proof of execution.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">OpenAI</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced language models for intelligent contract generation and analysis.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">Nexus (x402)</h3>
                <p className="text-sm text-muted-foreground">
                  Micropayment protocol for seamless API usage via Thirdweb's payment layer.
                </p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">WalletConnect</h3>
                <p className="text-sm text-muted-foreground">
                  Universal multi-chain wallet authentication for signing and verification.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Attesta */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Why Choose Attesta</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Decentralized & Trustless:</strong>{" "}
                  <span className="text-muted-foreground">No single point of failure or centralized authority</span>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Legally Binding:</strong>{" "}
                  <span className="text-muted-foreground">Cryptographic signatures provide legal proof of agreement</span>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Multi-Chain Security:</strong>{" "}
                  <span className="text-muted-foreground">Redundant verification across multiple blockchains</span>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">AI-Powered:</strong>{" "}
                  <span className="text-muted-foreground">Generate complex legal documents in seconds</span>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Permanent & Immutable:</strong>{" "}
                  <span className="text-muted-foreground">Once signed, your proof exists forever</span>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Privacy-First:</strong>{" "}
                  <span className="text-muted-foreground">No personal data required - only wallet addresses</span>
                </div>
              </li>
            </ul>
          </section>

          {/* CTA */}
          <section className="text-center p-8 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-950/20 border border-fuchsia-200 dark:border-fuchsia-800">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join the future of legal verification with Attesta
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-fuchsia-600 text-white font-semibold hover:bg-fuchsia-700 transition-colors"
            >
              Start Creating Agreements
            </a>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

