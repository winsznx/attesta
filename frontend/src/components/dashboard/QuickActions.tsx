"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FileCheck, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "Create Agreement",
      icon: Plus,
      onClick: () => router.push("/dashboard/agreements/create"),
      color: "bg-fuchsia-600 hover:bg-fuchsia-700",
    },
    {
      label: "Verify Proof",
      icon: Search,
      onClick: () => router.push("/dashboard/verify"),
      color: "bg-transparent hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 border-fuchsia-200 dark:border-fuchsia-800",
    },
    {
      label: "View Certificates",
      icon: FileCheck,
      onClick: () => router.push("/dashboard/certificates"),
      color: "bg-transparent hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 border-fuchsia-200 dark:border-fuchsia-800",
    },
  ];

  return (
    <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Get started with common tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                variant={action.color.includes("bg-transparent") ? "outline" : "default"}
                className={`w-full ${action.color} transition-all group`}
                onClick={action.onClick}
              >
                <Icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                {action.label}
              </Button>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
