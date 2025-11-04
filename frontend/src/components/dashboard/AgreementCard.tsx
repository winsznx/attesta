"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { AgreementUI } from "@/lib/blockchain/icp/candid/agreement_manager";

interface AgreementCardProps {
  agreement: AgreementUI;
  index?: number;
}

const statusConfig = {
  Draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    icon: FileText,
  },
  Pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  Signed: {
    label: "Signed",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: XCircle,
  },
};

export function AgreementCard({ agreement, index = 0 }: AgreementCardProps) {
  const status = statusConfig[agreement.status] || statusConfig.Draft;
  const StatusIcon = status.icon;
  const date = new Date(Number(agreement.created_at) / 1000000);
  const signatureCount = agreement.signatures.length;
  const totalParties = agreement.parties.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-fuchsia-200 dark:border-fuchsia-900/50 hover:border-fuchsia-300 dark:hover:border-fuchsia-800 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400 transition-colors">
                  {agreement.title}
                </h3>
                <Badge
                  className={`${status.color} flex items-center gap-1`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {agreement.template_type}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {signatureCount}/{totalParties} signed
              </span>
            </div>
            <span>{date.toLocaleDateString()}</span>
          </div>

          {agreement.signatures.length > 0 && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium mb-2">Signatures:</p>
              <div className="flex flex-wrap gap-2">
                {agreement.signatures.map((sig, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs"
                  >
                    {sig.signer.slice(0, 6)}...{sig.signer.slice(-4)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Link href={`/dashboard/agreements/${agreement.id}`}>
            <Button
              variant="outline"
              className="w-full group-hover:border-fuchsia-300 dark:group-hover:border-fuchsia-700"
            >
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}


