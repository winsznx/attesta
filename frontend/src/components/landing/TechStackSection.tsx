"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Network,
  Link2,
  Zap,
  Shield,
  Sparkles,
  Layers,
} from "lucide-react";

const techStack = [
  {
    name: "ICP",
    role: "Core Backend",
    description: "Primary storage and business logic",
    icon: Network,
    color: "bg-fuchsia-500",
  },
  {
    name: "Constellation",
    role: "Validation Layer",
    description: "Scalable DAG validation & compliance",
    icon: Layers,
    color: "bg-fuchsia-600",
  },
  {
    name: "Ethereum",
    role: "Certificate Layer",
    description: "NFT certificates via Thirdweb",
    icon: Sparkles,
    color: "bg-fuchsia-700",
  },
  {
    name: "Nexus (x402)",
    role: "Payment Layer",
    description: "Micropayments for AI API calls via Thirdweb",
    icon: Zap,
    color: "bg-fuchsia-500",
  },
  {
    name: "OpenAI",
    role: "AI Engine",
    description: "Contract generation & analysis",
    icon: Zap,
    color: "bg-fuchsia-400",
  },
  {
    name: "WalletConnect",
    role: "Universal Auth",
    description: "Multi-chain wallet authentication",
    icon: Link2,
    color: "bg-fuchsia-800",
  },
];

export function TechStackSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="tech" ref={ref} className="py-20 md:py-32 bg-background">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built on{" "}
            <span className="text-fuchsia-600 dark:text-fuchsia-400">
              cutting-edge technology
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Multi-chain infrastructure ensuring security, scalability, and
            interoperability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 rounded-lg border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div
                  className={`w-14 h-14 rounded-lg ${tech.color} p-3 mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-1">{tech.name}</h3>
                  <p className="text-sm font-medium text-primary mb-2">
                    {tech.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tech.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture diagram placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 p-8 rounded-lg border bg-card"
        >
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">Multi-Chain Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/20">
                <p className="font-semibold">ICP</p>
                <p className="text-sm text-muted-foreground">Storage</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30">
                <p className="font-semibold">Constellation</p>
                <p className="text-sm text-muted-foreground">Validation</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-fuchsia-50 dark:bg-fuchsia-900/20">
                <p className="font-semibold">Ethereum</p>
                <p className="text-sm text-muted-foreground">Certificates</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30">
                <p className="font-semibold">Nexus</p>
                <p className="text-sm text-muted-foreground">Payments</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

