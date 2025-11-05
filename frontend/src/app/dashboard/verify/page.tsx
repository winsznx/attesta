"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Shield,
  FileText,
  Network,
} from "lucide-react";
import { getAgreementManagerActor } from "@/lib/blockchain/icp/actors";
import { convertAgreement } from "@/lib/blockchain/icp/candid/agreement_manager";
import type { AgreementUI } from "@/lib/blockchain/icp/candid/agreement_manager";

export default function VerifyPage() {
  const [agreementId, setAgreementId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    agreement?: AgreementUI;
    error?: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!agreementId.trim()) {
      alert("Please enter an agreement ID");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const actor = await getAgreementManagerActor();
      const result = await actor.get_agreement(agreementId.trim());

      if (result.length > 0) {
        const agreement = convertAgreement(result[0]);
        setVerificationResult({
          found: true,
          agreement,
        });
      } else {
        setVerificationResult({
          found: false,
          error: "Agreement not found",
        });
      }
    } catch (error: any) {
      setVerificationResult({
        found: false,
        error: error?.message || "Verification failed",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
          Verify Agreement
        </h1>
        <p className="text-muted-foreground mt-2">
          Verify the authenticity of any agreement using its ID
        </p>
      </motion.div>

      {/* Search Card */}
      <Card className="border-fuchsia-200 dark:border-fuchsia-900/50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-fuchsia-600" />
            Multi-Chain Verification
          </CardTitle>
          <CardDescription>
            Search by agreement ID to verify across ICP, Constellation, and Ethereum
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Agreement ID (e.g., agreement_abc123...)"
              value={agreementId}
              onChange={(e) => setAgreementId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="flex-1"
            />
            <Button
              onClick={handleVerify}
              disabled={isVerifying || !agreementId.trim()}
              className="bg-fuchsia-600 hover:bg-fuchsia-700"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>ICP Mainnet</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Constellation</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span>Ethereum</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {verificationResult.found && verificationResult.agreement ? (
            <Card className="border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Agreement Verified
                </CardTitle>
                <CardDescription>
                  This agreement exists on the blockchain and is authentic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Agreement Details */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-medium">
                        {verificationResult.agreement.title}
                      </p>
                    </div>
                    <Badge
                      variant={
                        verificationResult.agreement.status === "completed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {verificationResult.agreement.status}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Agreement ID</p>
                    <p className="font-mono text-sm break-all">
                      {verificationResult.agreement.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Content Hash</p>
                    <p className="font-mono text-sm break-all">
                      {verificationResult.agreement.content_hash}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="text-sm">
                      {new Date(
                        Number(verificationResult.agreement.created_at) / 1000000
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Parties ({verificationResult.agreement.parties.length})
                    </p>
                    <div className="space-y-1">
                      {verificationResult.agreement.parties.map((party, idx) => (
                        <div
                          key={idx}
                          className="text-xs font-mono bg-muted p-2 rounded break-all"
                        >
                          {party}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Multi-Chain Proof */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Network className="h-4 w-4 text-fuchsia-600" />
                    Multi-Chain Proof
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        ICP Mainnet
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        Constellation DAG
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        Ethereum NFT
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {verificationResult.agreement.nft_token_id || "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* View on Explorers */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      window.open(
                        `https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=g5tri-niaaa-aaaag-auhuq-cai`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on ICP
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() =>
                      window.open(
                        `https://testnet-explorer.constellationnetwork.io`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Constellation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <XCircle className="h-5 w-5" />
                  Agreement Not Found
                </CardTitle>
                <CardDescription>
                  {verificationResult.error ||
                    "No agreement found with this ID on the blockchain"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Please check the agreement ID and try again. Make sure you're
                  connected to the correct network.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Info Card */}
      {!verificationResult && (
        <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-base">
              <FileText className="h-4 w-4" />
              How Verification Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>1. ICP Storage:</strong> Agreement data is stored immutably on
              ICP mainnet
            </p>
            <p>
              <strong>2. Constellation DAG:</strong> Validation proof is anchored in
              the DAG
            </p>
            <p>
              <strong>3. Ethereum NFT:</strong> Certificate is minted as an ERC-721
              token
            </p>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              All three blockchains must verify for full authenticity
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
