"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Shield,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { AgreementService } from "@/lib/services/agreements";
import type { AgreementUI } from "@/lib/blockchain/icp/candid/agreement_manager";
import { useWallet } from "@/components/providers/WalletProvider";
import { useMultiChainFinalization } from "@/lib/hooks/useMultiChainFinalization";

export default function SignAgreementPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected, connect } = useWallet();
  const agreementId = params.id as string;
  const [agreement, setAgreement] = useState<AgreementUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const { finalizeAgreement, status: finalizationStatus, isProcessing: isFinalizing } = useMultiChainFinalization();

  useEffect(() => {
    loadAgreement();
  }, [agreementId]);

  useEffect(() => {
    if (agreement && isConnected) {
      // Check if user has already signed
      const hasSigned = agreement.signatures.some(
        (sig) => sig.signer.toLowerCase() === address?.toLowerCase()
      );
      setSigned(hasSigned);
    }
  }, [agreement, isConnected, address]);

  const loadAgreement = async () => {
    try {
      setLoading(true);
      const data = await AgreementService.getAgreement(agreementId);
      setAgreement(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    if (!agreement) return;

    if (!confirm("Are you sure you want to sign this agreement? This action is irreversible.")) {
      return;
    }

    setSigning(true);
    try {
      const success = await AgreementService.signAgreement(agreementId);
      if (success) {
        setSigned(true);
        await loadAgreement();
        
        // Check if all parties have signed - if so, trigger multi-chain finalization
        const updatedAgreement = await AgreementService.getAgreement(agreementId);
        if (updatedAgreement && updatedAgreement.signatures.length === updatedAgreement.parties.length) {
          // All parties signed - trigger multi-chain finalization
          await finalizeAgreement(updatedAgreement);
        }
      } else {
        alert("Failed to sign agreement. Please try again.");
      }
    } catch (error) {
      alert("Failed to sign agreement. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-fuchsia-600" />
          <p className="text-muted-foreground">Loading agreement...</p>
        </div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Agreement Not Found</CardTitle>
            <CardDescription>
              The agreement you're looking for doesn't exist or has been removed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const signatureCount = agreement.signatures.length;
  const totalParties = agreement.parties.length;
  const date = new Date(Number(agreement.created_at) / 1000000);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{agreement.title}</h1>
          <p className="text-muted-foreground">{agreement.template_type}</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Agreement Overview */}
        <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              Agreement Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{date.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge>{agreement.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parties</p>
                <p className="font-medium">{totalParties}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Signed</p>
                <p className="font-medium">
                  {signatureCount}/{totalParties}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signing Section */}
        {signed ? (
          <Card className="border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                Already Signed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You have already signed this agreement. Your signature has been
                recorded on the blockchain.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/agreements/${agreementId}`)}
              >
                View Agreement Details
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                Sign Agreement
              </CardTitle>
              <CardDescription>
                Review the agreement details below and sign with your wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isConnected ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <p className="font-medium">Wallet Not Connected</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please connect your wallet to sign this agreement.
                  </p>
                  <Button
                    onClick={handleSign}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
                  >
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Your Wallet Address
                    </p>
                    <code className="text-xs break-all">{address}</code>
                  </div>

                  <div className="p-4 border-2 border-fuchsia-200 dark:border-fuchsia-800 rounded-lg">
                    <p className="text-sm font-medium mb-2">
                      By signing this agreement, you confirm:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0" />
                        <span>
                          You have read and understood the agreement terms
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0" />
                        <span>
                          You agree to be bound by the terms of this agreement
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-fuchsia-600 dark:text-fuchsia-400 flex-shrink-0" />
                        <span>
                          Your signature will be permanently recorded on the
                          blockchain
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleSign}
                    disabled={signing}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
                    size="lg"
                  >
                    {signing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Signing...
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5 mr-2" />
                        Sign Agreement
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Agreement Info */}
        <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
          <CardHeader>
            <CardTitle>Agreement Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Content Hash</p>
              <code className="text-xs bg-muted p-2 rounded block break-all mt-1">
                {agreement.content_hash}
              </code>
            </div>
            <div>
              <p className="text-muted-foreground">Creator</p>
              <code className="text-xs bg-muted p-2 rounded block break-all mt-1">
                {agreement.creator}
              </code>
            </div>
            <div>
              <p className="text-muted-foreground">Agreement ID</p>
              <code className="text-xs bg-muted p-2 rounded block break-all mt-1">
                {agreement.id}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
