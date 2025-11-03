"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { AgreementCard } from "@/components/dashboard/AgreementCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/providers/WalletProvider";
import { useAgreementData } from "@/lib/hooks/useAgreementData";
import { getUserPrincipalFromWallet } from "@/lib/blockchain/icp/address-converter";
import { Principal } from "@dfinity/principal";

export default function AgreementsPage() {
  const router = useRouter();
  const { address } = useWallet();
  const [userPrincipal, setUserPrincipal] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Convert Ethereum address to ICP Principal for localhost development
  useEffect(() => {
    if (address) {
      // Derive Principal from Ethereum address
      const principal = getUserPrincipalFromWallet(address);
      setUserPrincipal(principal.toText());
      console.log("📝 Using Principal for wallet:", address, "→", principal.toText());
    }
  }, [address]);

  const { agreements, stats, loading, error, refetch } = useAgreementData(userPrincipal, address);

  // Filter agreements based on search and status
  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch = agreement.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || agreement.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "signed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "completed":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
      default:
        return "bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300";
    }
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
          <p className="text-muted-foreground">Loading agreements from ICP...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-md border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Connection Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Make sure the ICP replica is running:</p>
              <code className="block bg-muted p-2 rounded text-xs">
                cd backend/icp && dfx start --background
              </code>
            </div>
            <Button onClick={refetch} variant="outline" className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
            Agreements
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all your legal agreements ({agreements.length} total)
          </p>
        </div>
        <Button
          className="bg-fuchsia-600 hover:bg-fuchsia-700"
          onClick={() => router.push("/dashboard/agreements/create")}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Agreement
        </Button>
      </motion.div>

      {/* Stats Overview */}
      {agreements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 p-3">
                <FileText className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total_agreements || 0}</p>
                <p className="text-xs text-muted-foreground">Total Agreements</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 dark:border-yellow-900/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-3">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pending_signatures || 0}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 dark:border-green-900/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.signed_agreements || 0}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search and Filter */}
      {agreements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agreements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "active", "signed", "completed"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-fuchsia-600 hover:bg-fuchsia-700" : ""}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Agreements List */}
      {agreements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={FileText}
                title="No agreements yet"
                description="Create your first legal agreement to get started. Choose from our templates or create a custom document."
                actionLabel="Create Agreement"
                onAction={() => router.push("/dashboard/agreements/create")}
              />
            </CardContent>
          </Card>
        </motion.div>
      ) : filteredAgreements.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matching agreements</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4"
        >
          {filteredAgreements.map((agreement, index) => (
            <AgreementCard
              key={agreement.id}
              agreement={agreement}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
