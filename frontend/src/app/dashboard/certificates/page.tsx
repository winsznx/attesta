"use client";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function CertificatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your blockchain-verified certificates
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Award}
            title="No certificates yet"
            description="Certificates are issued when agreements are fully signed and verified on the blockchain."
          />
        </CardContent>
      </Card>
    </div>
  );
}
