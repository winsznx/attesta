"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorTarget() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-50 mix-blend-difference"
      style={{
        left: position.x - 20,
        top: position.y - 20,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500 bg-fuchsia-500/20 blur-sm" />
        <div className="relative w-10 h-10 rounded-full border-2 border-fuchsia-500">
          <div className="absolute inset-2 rounded-full border border-fuchsia-400" />
        </div>
      </div>
    </motion.div>
  );
}

