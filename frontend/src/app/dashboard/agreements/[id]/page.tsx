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
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Share2,
  Loader2,
} from "lucide-react";
import { AgreementService } from "@/lib/services/agreements";
import type { AgreementUI } from "@/lib/blockchain/icp/candid/agreement_manager";
import { useWallet } from "@/components/providers/WalletProvider";

const statusConfig = {
  Draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    icon: Clock,
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

export default function AgreementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const agreementId = params.id as string;
  const [agreement, setAgreement] = useState<AgreementUI | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAgreement();
  }, [agreementId]);

  const loadAgreement = async () => {
    try {
      setLoading(true);
      const data = await AgreementService.getAgreement(agreementId);
      setAgreement(data);
    } catch (error) {
      console.error("Failed to load agreement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!agreement) return;

    setSigning(true);
    try {
      const success = await AgreementService.signAgreement(agreementId);
      if (success) {
        await loadAgreement();
      } else {
        alert("Failed to sign agreement");
      }
    } catch (error) {
      console.error("Sign error:", error);
      alert("Failed to sign agreement");
    } finally {
      setSigning(false);
    }
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/dashboard/agreements/${agreementId}/sign`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-fuchsia-600" />
          <p className="text-muted-foreground">Loading agreement...</p>
        </div>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Agreement Not Found</CardTitle>
            <CardDescription>
              The agreement you're looking for doesn't exist
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

  const status = statusConfig[agreement.status] || statusConfig.Draft;
  const StatusIcon = status.icon;
  const date = new Date(Number(agreement.created_at) / 1000000);
  const signatureCount = agreement.signatures.length;
  const totalParties = agreement.parties.length;
  const isSigned = agreement.status === "Signed";
  const canSign = agreement.status === "Pending" && isConnected;

  // Check if current user has already signed
  const hasSigned = agreement.signatures.some(
    (sig) => sig.signer.toLowerCase() === address?.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{agreement.title}</h1>
              <Badge className={`${status.color} flex items-center gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">{agreement.template_type}</p>
          </div>
          <Button variant="outline" onClick={copyShareLink}>
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agreement Info */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Created
                </h3>
                <p>{date.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Content Hash
                </h3>
                <code className="text-xs bg-muted p-2 rounded block break-all">
                  {agreement.content_hash}
                </code>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Creator
                </h3>
                <code className="text-xs bg-muted p-2 rounded block">
                  {agreement.creator}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Signatures */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Signatures ({signatureCount}/{totalParties})
              </CardTitle>
              <CardDescription>
                Parties who have signed this agreement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {agreement.parties.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No parties added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {agreement.parties.map((party, index) => {
                    const signature = agreement.signatures.find(
                      (sig) => sig.signer === party
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {signature ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium text-sm">Party {index + 1}</p>
                            <code className="text-xs text-muted-foreground">
                              {party.slice(0, 20)}...
                            </code>
                          </div>
                        </div>
                        {signature && (
                          <Badge variant="outline" className="text-xs">
                            {new Date(
                              Number(signature.signed_at) / 1000000
                            ).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Sign Action */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isSigned ? (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    Agreement Fully Signed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All parties have signed
                  </p>
                </div>
              ) : hasSigned ? (
                <div className="p-4 bg-fuchsia-50 dark:bg-fuchsia-950/20 rounded-lg text-center">
                  <CheckCircle2 className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    You've Already Signed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Waiting for other parties
                  </p>
                </div>
              ) : canSign ? (
                <Button
                  onClick={handleSign}
                  disabled={signing}
                  className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
                >
                  {signing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Sign Agreement
                    </>
                  )}
                </Button>
              ) : (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-center">
                  <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Waiting for Signatures
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect wallet to sign
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/dashboard/agreements/${agreementId}/sign`)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Signing Link
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium">{agreement.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Parties</p>
                <p className="font-medium">{totalParties}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Signed</p>
                <p className="font-medium">{signatureCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Agreement ID</p>
                <code className="text-xs bg-muted p-1 rounded block break-all">
                  {agreement.id}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
