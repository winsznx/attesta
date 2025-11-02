"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BorderButton } from "@/components/ui/BorderButton";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

export function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background - fuchsia theme */}
      <div className="absolute inset-0 bg-fuchsia-50 dark:bg-fuchsia-950/30" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d946ef12_1px,transparent_1px),linear-gradient(to_bottom,#d946ef12_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 text-sm font-medium mb-6"
          >
            <Shield className="h-4 w-4" />
            <span>Blockchain-Powered Legal Verification</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-fuchsia-600 dark:text-fuchsia-400"
          >
            <TypewriterText
              words={[
                "Verify anything",
                "Prove everything",
                "Trust verified",
                "Truth on-chain",
              ]}
              className="text-fuchsia-600 dark:text-fuchsia-400"
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 text-balance"
          >
            Your legal truth layer powered by AI and blockchain.
            <br />
            Create, sign, and verify agreements across multiple chains.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link href="/dashboard">
              <BorderButton size="lg" className="text-lg px-8 py-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </BorderButton>
            </Link>
            <Link href="#how-it-works">
              <BorderButton size="lg" variant="outline" className="text-lg px-8 py-6 border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20">
                Learn More
              </BorderButton>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              <span>Multi-Chain Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              <span>AI-Powered Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              <span>Zero-Knowledge Identity</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

