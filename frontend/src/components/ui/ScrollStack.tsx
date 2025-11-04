"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
}

export function ScrollStack({ children, className }: ScrollStackProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
        className="space-y-4"
      >
        {children}
      </motion.div>
    </div>
  );
}

