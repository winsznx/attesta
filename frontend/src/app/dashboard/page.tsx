"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AgreementCard } from "@/components/dashboard/AgreementCard";
import {
  FileText,
  Clock,
  Award,
  TrendingUp,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAgreementData } from "@/lib/hooks/useAgreementData";
import { getUserPrincipalFromWallet } from "@/lib/blockchain/icp/address-converter";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { address } = useWallet();
  const router = useRouter();
  const [userPrincipal, setUserPrincipal] = useState<string | undefined>();

  // Convert Ethereum address to ICP Principal for localhost development
  useEffect(() => {
    if (address) {
      // Derive Principal from Ethereum address
      const principal = getUserPrincipalFromWallet(address);
      setUserPrincipal(principal.toText());
    }
  }, [address]);

  const { agreements, stats: icpStats, loading, error } =
    useAgreementData(userPrincipal, address);

  // Convert ICP stats to dashboard format
  const stats = {
    totalAgreements: icpStats ? Number(icpStats.total_agreements) : 0,
    pendingSignatures: icpStats ? Number(icpStats.pending_signatures) : 0,
    certificates: icpStats ? Number(icpStats.signed_agreements) : 0,
    totalValue: agreements?.length || 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-fuchsia-600" />
          <p className="text-muted-foreground">Loading data from ICP...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Connection Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Make sure the ICP replica is running:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                cd backend/icp && dfx start --background
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your legal agreements and track their status
          </p>
        </div>
        <Link href="/dashboard/agreements/create">
          <Button
            className="bg-fuchsia-600 hover:bg-fuchsia-700 group"
          >
            <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
            Create Agreement
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Agreements"
          value={stats.totalAgreements}
          description="All time agreements created"
          icon={FileText}
          index={0}
        />
        <StatsCard
          title="Pending Signatures"
          value={stats.pendingSignatures}
          description="Awaiting signatures"
          icon={Clock}
          index={1}
        />
        <StatsCard
          title="Certificates"
          value={stats.certificates}
          description="Verified certificates earned"
          icon={Award}
          index={2}
        />
        <StatsCard
          title="Active Agreements"
          value={stats.totalValue}
          description="Currently active"
          icon={TrendingUp}
          index={3}
        />
      </div>

      {/* Main Content - Improved Responsive Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Main Content Area - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recent Agreements */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
              <div>
                <CardTitle className="text-lg">Recent Agreements</CardTitle>
                <CardDescription className="text-xs">
                  {agreements.length} total
                </CardDescription>
              </div>
              {agreements.length > 0 && (
                <Link href="/dashboard/agreements">
                  <Button variant="ghost" size="sm" className="text-fuchsia-600">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {agreements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="rounded-full bg-gradient-to-br from-fuchsia-100 to-pink-100 dark:from-fuchsia-900/30 dark:to-pink-900/30 p-8 mb-4"
                  >
                    <FileText className="h-16 w-16 text-fuchsia-600 dark:text-fuchsia-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    No agreements yet
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Create your first agreement to get started with blockchain-backed
                    legal verification.
                  </p>
                  <Link href="/dashboard/agreements/create">
                    <Button className="bg-fuchsia-600 hover:bg-fuchsia-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Your First Agreement
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {agreements.slice(0, 5).map((agreement, index) => (
                    <AgreementCard
                      key={agreement.id}
                      agreement={agreement}
                      index={index}
                    />
                  ))}
                  {agreements.length > 5 && (
                    <Link href="/dashboard/agreements">
                      <Button variant="outline" className="w-full mt-4 border-fuchsia-200 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20">
                        View {agreements.length - 5} More Agreements
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline / Recent Actions */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-4 w-4 text-fuchsia-600" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-xs">
                Latest actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agreements.length > 0 ? (
                  agreements.slice(0, 3).map((agreement, idx) => (
                    <motion.div
                      key={agreement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 pb-3 border-b last:border-0 border-fuchsia-100 dark:border-fuchsia-900/30"
                    >
                      <div className="rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 p-1.5">
                        <FileText className="h-3 w-3 text-fuchsia-600 dark:text-fuchsia-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{agreement.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(Number(agreement.created_at) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300">
                        {agreement.status}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No activity yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Compact on large screens */}
        <div className="lg:col-span-1 space-y-4">
          <QuickActions />

          {/* Getting Started Card */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  { step: 1, title: "Create agreement" },
                  { step: 2, title: "Add parties" },
                  { step: 3, title: "Get certificate" },
                ].map((item) => (
                  <motion.li
                    key={item.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: item.step * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400 font-semibold text-[10px]">
                      {item.step}
                    </div>
                    <p className="text-xs font-medium">{item.title}</p>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Storage/Blockchain Info */}
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50 bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/20 dark:to-pink-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Network</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Chain</span>
                <span className="text-xs font-medium">ICP Local</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Agreements</span>
                <span className="text-xs font-medium text-fuchsia-600 dark:text-fuchsia-400">
                  {stats.totalAgreements}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-600 dark:text-green-400">Live</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
