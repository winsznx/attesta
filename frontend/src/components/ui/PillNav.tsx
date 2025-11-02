"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PillNavProps {
  items: { label: string; href: string }[];
  className?: string;
}

export function PillNav({ items, className }: PillNavProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <nav className={cn("flex gap-2 p-1 bg-muted rounded-full w-fit", className)}>
      {items.map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          onClick={() => setActiveIndex(index)}
          className={cn(
            "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeIndex === index
              ? "text-white"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {activeIndex === index && (
            <motion.span
              layoutId="activePill"
              className="absolute inset-0 bg-fuchsia-600 rounded-full -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{item.label}</span>
        </motion.a>
      ))}
    </nav>
  );
}

