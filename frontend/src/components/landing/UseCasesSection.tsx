"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Briefcase,
  Home,
  User,
  Building2,
  FileCheck,
  Users,
} from "lucide-react";

const useCases = [
  {
    icon: Briefcase,
    title: "Freelancers & Clients",
    description:
      "Create contracts for freelance work with instant verification and automatic NFT certificates.",
    color: "bg-fuchsia-500",
  },
  {
    icon: Home,
    title: "Rental Agreements",
    description:
      "Secure rental agreements with blockchain-backed proof that stands up to legal scrutiny.",
    color: "bg-fuchsia-600",
  },
  {
    icon: FileCheck,
    title: "Legal Professionals",
    description:
      "Streamline document creation, signing, and verification for law firms and legal departments.",
    color: "bg-fuchsia-700",
  },
  {
    icon: Building2,
    title: "SMB Compliance",
    description:
      "Ensure corporate compliance with real-time validation and audit trails on Constellation.",
    color: "bg-fuchsia-500",
  },
  {
    icon: User,
    title: "Employment Contracts",
    description:
      "Secure employment agreements with multi-party signing and permanent verification.",
    color: "bg-fuchsia-400",
  },
  {
    icon: Users,
    title: "Partnership Agreements",
    description:
      "Multi-party business agreements with transparent verification and immutable records.",
    color: "bg-fuchsia-800",
  },
];

export function UseCasesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
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
            Perfect for{" "}
            <span className="text-fuchsia-600 dark:text-fuchsia-400">
              everyone
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a freelancer, business owner, or legal professional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-lg border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${useCase.color} p-3 mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

