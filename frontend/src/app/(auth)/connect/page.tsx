"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/providers/WalletProvider";
import { ConnectButton } from "@/components/wallet/ConnectButton";
import { Wallet, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ConnectPage() {
  const { isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      // Redirect to dashboard after connection
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950/30 mb-4">
            <Wallet className="h-10 w-10 text-fuchsia-600 dark:text-fuchsia-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Connect Your Wallet
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Connect your wallet to start creating, signing, and verifying legal documents
            on the blockchain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <ConnectButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12"
        >
          <div className="p-6 rounded-lg border bg-card">
            <Shield className="h-6 w-6 text-fuchsia-600 mb-3" />
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet remains in your control. We never store your private keys.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <Wallet className="h-6 w-6 text-fuchsia-600 mb-3" />
            <h3 className="font-semibold mb-2">Multi-Chain</h3>
            <p className="text-sm text-muted-foreground">
              Connect with Ethereum, Polygon, Arbitrum, and more via WalletConnect.
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card">
            <ArrowRight className="h-6 w-6 text-fuchsia-600 mb-3" />
            <h3 className="font-semibold mb-2">Easy</h3>
            <p className="text-sm text-muted-foreground">
              One-click connection. No signup required. Start using immediately.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center pt-8"
        >
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
