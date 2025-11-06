"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface AcknowledgmentCheckboxesProps {
  onValidChange: (isValid: boolean) => void;
}

export function AcknowledgmentCheckboxes({ onValidChange }: AcknowledgmentCheckboxesProps) {
  const [checks, setChecks] = useState({
    notLegalAdvice: false,
    reviewed: false,
    jurisdiction: false,
    permanent: false,
  });

  const handleCheckChange = (key: keyof typeof checks, checked: boolean) => {
    const newChecks = { ...checks, [key]: checked };
    setChecks(newChecks);

    // All checkboxes must be checked for validation to pass
    const allChecked = Object.values(newChecks).every(Boolean);
    onValidChange(allChecked);
  };

  const allChecked = Object.values(checks).every(Boolean);

  return (
    <div className="space-y-4 border rounded-lg p-6 bg-muted/50">
      <div className="flex items-start gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-lg">Legal Acknowledgment Required</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Please read and accept the following statements before creating an agreement
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Checkbox 1: Not Legal Advice */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="notLegalAdvice"
            checked={checks.notLegalAdvice}
            onCheckedChange={(checked) => handleCheckChange("notLegalAdvice", checked as boolean)}
          />
          <Label
            htmlFor="notLegalAdvice"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I understand that Attesta <strong>does NOT provide legal advice</strong> and is not a law firm.
            AI-generated documents are not reviewed by attorneys. I should consult a licensed attorney before
            signing important agreements.{" "}
            <Link href="/terms" className="text-fuchsia-600 hover:underline" target="_blank">
              (Terms of Service)
            </Link>
          </Label>
        </div>

        {/* Checkbox 2: Reviewed Agreement */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="reviewed"
            checked={checks.reviewed}
            onCheckedChange={(checked) => handleCheckChange("reviewed", checked as boolean)}
          />
          <Label
            htmlFor="reviewed"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I have <strong>reviewed the agreement content</strong> or will have it reviewed by a qualified
            attorney. I understand that AI-generated content may contain errors or omissions.
          </Label>
        </div>

        {/* Checkbox 3: Jurisdiction Awareness */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="jurisdiction"
            checked={checks.jurisdiction}
            onCheckedChange={(checked) => handleCheckChange("jurisdiction", checked as boolean)}
          />
          <Label
            htmlFor="jurisdiction"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I understand that <strong>legal requirements vary by jurisdiction</strong> and this agreement may
            not be enforceable in my country/state without proper legal compliance. I am responsible for
            ensuring compliance with local laws.
          </Label>
        </div>

        {/* Checkbox 4: Blockchain Permanence */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="permanent"
            checked={checks.permanent}
            onCheckedChange={(checked) => handleCheckChange("permanent", checked as boolean)}
          />
          <Label
            htmlFor="permanent"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I understand that <strong>blockchain records are permanent and immutable</strong>. Document hashes,
            signatures, and wallet addresses will be publicly visible on-chain and cannot be deleted.{" "}
            <Link href="/privacy" className="text-fuchsia-600 hover:underline" target="_blank">
              (Privacy Policy)
            </Link>
          </Label>
        </div>
      </div>

      {!allChecked && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-500 rounded-md">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You must accept all statements above to continue
          </p>
        </div>
      )}
    </div>
  );
}
