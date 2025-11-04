"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  index?: number;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  index = 0,
}: StatsCardProps) {
  const isPositive = trend ? trend.value > 0 : true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden border-fuchsia-200 dark:border-fuchsia-900/50 hover:border-fuchsia-300 dark:hover:border-fuchsia-800 transition-colors group">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50/50 via-transparent to-transparent dark:from-fuchsia-950/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-3xl font-bold text-foreground"
              >
                {value}
              </motion.div>
            </div>
            <div className="rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30 p-3 group-hover:bg-fuchsia-200 dark:group-hover:bg-fuchsia-900/50 transition-colors">
              <Icon className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground mb-2">{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center gap-1 mt-3">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                {trend.label}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
