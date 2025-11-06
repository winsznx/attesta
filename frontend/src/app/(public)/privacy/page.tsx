import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-fuchsia-600 dark:text-fuchsia-400">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: January 6, 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>
                Attesta ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use our Platform.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
                please do not access the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Information You Provide</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Wallet Address:</strong> Your blockchain wallet address when you connect to the Platform</li>
                <li><strong>Agreement Content:</strong> Text and data you input when creating legal agreements</li>
                <li><strong>Party Information:</strong> Wallet addresses of co-signers you add to agreements</li>
                <li><strong>Signatures:</strong> Cryptographic signatures when you sign documents</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on Platform</li>
                <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                <li><strong>Blockchain Data:</strong> Transaction hashes, block numbers, timestamps</li>
                <li><strong>Cookies:</strong> Session data, preferences, analytics (see Section 8)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">2.3 Third-Party Data</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>WalletConnect:</strong> Connection metadata when you link your wallet</li>
                <li><strong>OpenAI:</strong> Prompts sent for AI document generation</li>
                <li><strong>Blockchain Networks:</strong> Public on-chain data (ICP, Constellation, Ethereum)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p>We use collected information for the following purposes:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Service Provision:</strong> Create, store, and verify legal agreements</li>
                <li><strong>AI Generation:</strong> Send prompts to OpenAI to generate document content</li>
                <li><strong>Blockchain Operations:</strong> Store hashes and signatures on-chain</li>
                <li><strong>Communication:</strong> Send notifications about agreement status (if enabled)</li>
                <li><strong>Analytics:</strong> Improve Platform performance and user experience</li>
                <li><strong>Security:</strong> Detect fraud, abuse, and security threats</li>
                <li><strong>Legal Compliance:</strong> Comply with laws and respond to legal requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Blockchain and Public Data</h2>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-500 p-4 rounded-lg">
                <p className="font-bold text-blue-900 dark:text-blue-100">IMPORTANT: Blockchain Data is Public</p>
                <p className="mt-2 text-blue-800 dark:text-blue-200">
                  When you use Attesta, the following information is stored permanently on public blockchains:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-2 text-blue-800 dark:text-blue-200">
                  <li>Document content hashes (SHA-256)</li>
                  <li>Wallet addresses of all signers</li>
                  <li>Cryptographic signatures</li>
                  <li>Timestamps of signing</li>
                  <li>Transaction hashes</li>
                  <li>NFT metadata (if certificate minted)</li>
                </ul>
                <p className="mt-2 text-blue-800 dark:text-blue-200">
                  <strong>This data is publicly visible and CANNOT be deleted or modified.</strong> Anyone can view
                  this information on blockchain explorers.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.1 Third-Party Services</h3>
              <p>We share data with the following third parties:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>OpenAI:</strong> Document prompts for AI generation (subject to OpenAI's privacy policy)</li>
                <li><strong>WalletConnect:</strong> Wallet connection metadata</li>
                <li><strong>Blockchain Networks:</strong> ICP, Constellation, Ethereum/Base (public data)</li>
                <li><strong>Thirdweb (Nexus):</strong> Payment processing for AI services (if enabled)</li>
                <li><strong>Vercel:</strong> Hosting and analytics (subject to Vercel's privacy policy)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.2 Legal Requirements</h3>
              <p>We may disclose your information if required to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Comply with legal obligations (court orders, subpoenas)</li>
                <li>Protect our rights and property</li>
                <li>Prevent fraud or abuse</li>
                <li>Ensure user safety</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">5.3 Business Transfers</h3>
              <p>
                If Attesta is acquired or merged, your information may be transferred to the new entity.
                We will notify you via email or Platform notice before such transfer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Data Storage and Security</h2>

              <h3 className="text-xl font-semibold mb-3 mt-4">6.1 On-Chain Storage</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>ICP Canisters:</strong> Full agreement content stored in canister stable memory</li>
                <li><strong>Constellation:</strong> Validation proofs stored on DAG</li>
                <li><strong>Ethereum/Base:</strong> NFT metadata and certificate references</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">6.2 Off-Chain Storage</h3>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Vercel:</strong> Application hosting and edge caching</li>
                <li><strong>Browser Storage:</strong> Local session data and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">6.3 Security Measures</h3>
              <p>We implement security measures including:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>HTTPS encryption for all data in transit</li>
                <li>Cryptographic hashing (SHA-256) for document content</li>
                <li>Blockchain immutability for tamper-proof records</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p className="mt-4">
                <strong>However, no method of transmission over the Internet is 100% secure.</strong> We cannot
                guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Your Data Rights</h2>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.1 Access and Portability</h3>
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Access your agreements and data on the Platform</li>
                <li>Export your data in machine-readable format</li>
                <li>View all on-chain data via blockchain explorers</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.2 Correction and Deletion</h3>
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-500 p-4 rounded-lg">
                <p className="font-bold text-yellow-900 dark:text-yellow-100">Important Limitation:</p>
                <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                  Blockchain data is immutable and CANNOT be deleted or modified. This includes:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-yellow-800 dark:text-yellow-200">
                  <li>Document hashes</li>
                  <li>Signatures</li>
                  <li>Timestamps</li>
                  <li>Wallet addresses</li>
                </ul>
                <p className="mt-2 text-yellow-800 dark:text-yellow-200">
                  We can delete off-chain data (full document content in ICP canister) upon request, but
                  on-chain references will remain permanently.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.3 GDPR Rights (EU Users)</h3>
              <p>If you are in the European Union, you have additional rights:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Right to be Forgotten:</strong> Limited due to blockchain immutability</li>
                <li><strong>Data Portability:</strong> Export your data in JSON format</li>
                <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
                <li><strong>Object:</strong> Object to certain data processing activities</li>
                <li><strong>Lodge Complaint:</strong> File complaint with your data protection authority</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-4">7.4 Exercising Your Rights</h3>
              <p>
Ÿ                To exercise any of these rights, contact us at: <strong>attestahq@proton.me</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for Platform functionality (wallet session)</li>
                <li><strong>Analytics Cookies:</strong> Understand usage patterns (Vercel Analytics)</li>
                <li><strong>Preference Cookies:</strong> Remember your settings (theme, language)</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. Note that disabling essential cookies
                may limit Platform functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
              <p>
                Your data may be transferred to and processed in countries outside your jurisdiction, including:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>United States (Vercel hosting, OpenAI processing)</li>
                <li>Blockchain nodes globally distributed</li>
              </ul>
              <p className="mt-4">
                We ensure appropriate safeguards are in place for international transfers, including
                standard contractual clauses and adequacy decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
              <p>
                Attesta is not intended for users under 18 years of age. We do not knowingly collect personal
                information from children. If you believe we have collected data from a child, please contact us
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Data Retention</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Blockchain Data:</strong> Retained permanently (immutable)</li>
                <li><strong>ICP Canister Data:</strong> Retained indefinitely unless deletion requested</li>
                <li><strong>Analytics Data:</strong> Retained for 24 months</li>
                <li><strong>Logs:</strong> Retained for 90 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of changes by:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending email notification (for material changes)</li>
              </ul>
              <p className="mt-4">
                Your continued use of the Platform after changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, contact us at:
              </p>
              <p className="font-mono mt-2">
                Email: attestahq@proton.me<br />
                GitHub: https://github.com/winsznx/attesta<br />
                Data Protection Officer: attestahq@proton.me
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Third-Party Privacy Policies</h2>
              <p>Please review the privacy policies of our third-party service providers:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>OpenAI: https://openai.com/privacy/</li>
                <li>WalletConnect: https://walletconnect.com/privacy</li>
                <li>Vercel: https://vercel.com/legal/privacy-policy</li>
                <li>Thirdweb: https://thirdweb.com/privacy</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
