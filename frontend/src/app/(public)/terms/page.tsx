import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-fuchsia-600 dark:text-fuchsia-400">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: January 6, 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Attesta ("the Platform"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, do not use the Platform.
              </p>
              <p>
                Attesta reserves the right to modify these Terms at any time. Continued use of the Platform after changes
                constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p>
                Attesta provides a blockchain-based platform for creating, signing, and verifying legal agreements.
                The Platform includes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>AI-powered document generation using OpenAI technology</li>
                <li>Multi-chain blockchain verification (Internet Computer, Constellation Network, Ethereum/Base)</li>
                <li>Cryptographic signature capabilities</li>
                <li>Document verification services</li>
                <li>NFT certificate issuance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. NOT Legal Advice</h2>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-500 p-4 rounded-lg">
                <p className="font-bold text-yellow-900 dark:text-yellow-100">IMPORTANT DISCLAIMER:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2 text-yellow-800 dark:text-yellow-200">
                  <li>Attesta does NOT provide legal advice or legal services</li>
                  <li>Attesta is NOT a law firm and does not employ attorneys</li>
                  <li>No attorney-client relationship is created by using the Platform</li>
                  <li>AI-generated documents are NOT reviewed by licensed attorneys</li>
                  <li>You should consult a licensed attorney before signing important agreements</li>
                </ul>
              </div>
              <p className="mt-4">
                The Platform provides technical infrastructure for document creation and blockchain verification.
                Legal enforceability of documents depends on jurisdiction, contract type, and compliance with local laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. User Responsibilities</h2>
              <p>By using the Platform, you agree to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Provide accurate information when creating agreements</li>
                <li>Ensure you have legal capacity to enter into contracts</li>
                <li>Verify that agreements comply with applicable laws in your jurisdiction</li>
                <li>Consult a licensed attorney for important or high-value agreements</li>
                <li>Not use the Platform for illegal purposes or to create fraudulent documents</li>
                <li>Keep your wallet private keys secure</li>
                <li>Understand that blockchain transactions are irreversible</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Wallet and Identity</h2>
              <p>
                You are responsible for maintaining the security of your wallet and private keys.
                Attesta cannot recover lost private keys or reverse blockchain transactions.
              </p>
              <p>
                You acknowledge that wallet addresses are pseudonymous and may not constitute legal identity
                verification in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. AI-Generated Content</h2>
              <p>
                Documents generated using AI technology may contain errors, omissions, or clauses that are
                unenforceable in your jurisdiction. You are responsible for:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Reviewing all AI-generated content carefully</li>
                <li>Editing documents to meet your specific needs</li>
                <li>Ensuring compliance with local laws and regulations</li>
                <li>Having documents reviewed by a qualified attorney when appropriate</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-500 p-4 rounded-lg">
                <p className="font-bold text-red-900 dark:text-red-100">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                <ul className="list-disc ml-6 mt-2 space-y-2 text-red-800 dark:text-red-200">
                  <li>Attesta provides the Platform "AS IS" without warranties of any kind</li>
                  <li>We do not guarantee legal enforceability of documents created on the Platform</li>
                  <li>We are not liable for damages arising from use of the Platform</li>
                  <li>We are not responsible for AI-generated content accuracy or completeness</li>
                  <li>We are not liable for blockchain network failures or downtime</li>
                  <li>Total liability shall not exceed the fees paid in the last 12 months (if any)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Blockchain and Cryptocurrency Risks</h2>
              <p>You acknowledge and accept the following risks:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Blockchain transactions are irreversible and permanent</li>
                <li>Smart contract vulnerabilities may exist</li>
                <li>Gas fees and network congestion may affect transaction costs</li>
                <li>Cryptocurrency prices are volatile</li>
                <li>Regulatory changes may affect blockchain services</li>
                <li>You may lose access to documents if you lose your private keys</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
              <p>
                You retain ownership of documents you create on the Platform. By using the Platform, you grant
                Attesta a non-exclusive license to store and process your documents for service provision.
              </p>
              <p>
                The Platform's code, design, and branding are protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Privacy and Data</h2>
              <p>
                Your use of the Platform is also governed by our Privacy Policy. Please review it to understand
                how we collect, use, and protect your information.
              </p>
              <p>
                Note: Blockchain data is public and immutable. Document hashes and signatures are visible on-chain.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Prohibited Uses</h2>
              <p>You may not use the Platform to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Create fraudulent or illegal documents</li>
                <li>Impersonate others or misrepresent your identity</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to hack or compromise the Platform</li>
                <li>Use automated systems to scrape or abuse the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the Platform at any time for violation
                of these Terms or for any other reason at our sole discretion.
              </p>
              <p>
                Blockchain records created before termination will remain on-chain permanently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Governing Law and Disputes</h2>
              <p>
                These Terms are governed by the laws of [YOUR JURISDICTION - TO BE DETERMINED].
                Any disputes shall be resolved through binding arbitration in accordance with [ARBITRATION RULES].
              </p>
              <p>
                You agree to waive any right to a jury trial or to participate in class action lawsuits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions shall
                continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
              <p>
                For questions about these Terms, please contact us at:
              </p>
              <p className="font-mono mt-2">
                Email: legal@attesta.app<br />
                GitHub: https://github.com/winsznx/attesta
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. Acknowledgment</h2>
              <p className="font-bold">
                By using Attesta, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
