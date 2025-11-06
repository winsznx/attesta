"use client";

import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LegalDisclaimerBanner() {
  return (
    <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20 mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
              Legal Disclaimer - Important Notice
            </h3>
            <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
              <p>
                <strong>This is NOT legal advice.</strong> AI-generated documents are provided for informational purposes only and should be reviewed by a qualified attorney licensed in your jurisdiction before use.
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Attesta does not provide legal advice or attorney services</li>
                <li>Legal requirements vary by country, state, and contract type</li>
                <li>These documents may not be legally binding in your jurisdiction without proper review</li>
                <li>Consult a licensed attorney before signing important agreements</li>
                <li>By using this service, you agree you are not relying on Attesta for legal counsel</li>
              </ul>
              <p className="pt-2">
                <strong>What Attesta provides:</strong> Blockchain-verified proof of document existence, signatures, and timestamps. We do NOT provide legal validation of document contents.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
