"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileText, Users, Shield, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Create Agreement",
    description:
      "Use AI to generate your legal document or choose from templates. Describe your needs in plain language.",
  },
  {
    number: "02",
    icon: Users,
    title: "Add Parties & Sign",
    description:
      "Invite all parties via wallet addresses. Each party signs using WalletConnect with their preferred chain.",
  },
  {
    number: "03",
    icon: Shield,
    title: "Multi-Chain Notarization",
    description:
      "Your agreement is stored on ICP, validated on Constellation Metagraph, and minted as an NFT on Ethereum.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Verify Forever",
    description:
      "Anyone can verify the document's authenticity using the hash or NFT token ID. Proof is immutable and permanent.",
  },
];

export function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-20 md:py-32 bg-muted/50"
    >
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How it works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and verifiable in four easy steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-fuchsia-500 -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-card rounded-lg p-8 border hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-full bg-fuchsia-600 dark:bg-fuchsia-500 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-4xl font-bold text-muted-foreground/20">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

