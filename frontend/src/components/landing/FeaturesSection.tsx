"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Brain,
  FileText,
  Shield,
  Users,
  Eye,
  Lock,
  Zap,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Contract Generation",
    description:
      "Describe what you need and get a legally sound document generated instantly with OpenAI.",
  },
  {
    icon: FileText,
    title: "Multi-Party Signing",
    description:
      "All parties sign with their wallet. No email chains, no printing, no hassle.",
  },
  {
    icon: Shield,
    title: "Multi-Chain Notarization",
    description:
      "Get proof on ICP, validated on Constellation, and certified on Ethereum.",
  },
  {
    icon: Users,
    title: "Identity Verification",
    description:
      "Zero-knowledge identity verification with x402 ensures privacy while proving authenticity.",
  },
  {
    icon: Eye,
    title: "Public Verification",
    description:
      "Anyone can verify document authenticity using a hash or link.",
  },
  {
    icon: Lock,
    title: "Anonymous Reporting",
    description:
      "Whistleblowers can submit reports with end-to-end encryption.",
  },
  {
    icon: Zap,
    title: "NFT Certificates",
    description:
      "Receive verifiable NFT certificates as proof of agreement execution.",
  },
  {
    icon: CheckCircle2,
    title: "Real-Time Compliance",
    description:
      "Constellation Metagraph validates compliance in real-time.",
  },
];


export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="features"
      ref={ref}
      className="py-20 md:py-32 bg-background"
    >
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need for{" "}
            <span className="text-fuchsia-600 dark:text-fuchsia-400">
              legal verification
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by multiple blockchains and AI to ensure trust,
            transparency, and compliance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-lg border bg-card hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-fuchsia-600 dark:bg-fuchsia-500 p-3 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

