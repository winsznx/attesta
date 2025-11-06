"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, TrendingUp, Clock, Shield } from "lucide-react";

export default function ReportsPage() {
  // Mock data - in production, this would come from your backend
  const stats = {
    totalAgreements: 0,
    pendingSignatures: 0,
    completedThisMonth: 0,
    averageSigningTime: "N/A",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your agreement activity and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Agreements
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgreements}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Signatures
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSignatures}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed This Month
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Signing Time
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSigningTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Time to completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Agreement Activity
            </CardTitle>
            <CardDescription>
              Monthly agreement creation and completion trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agreement Types</CardTitle>
            <CardDescription>
              Distribution of agreement categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Analytics</CardTitle>
          <CardDescription>
            Multi-chain verification status and costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">ICP Storage</p>
                <p className="text-sm text-muted-foreground">Primary document storage</p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Constellation Validation</p>
                <p className="text-sm text-muted-foreground">DAG-based compliance checking</p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Ethereum NFTs</p>
                <p className="text-sm text-muted-foreground">Certificate minting on Base</p>
              </div>
              <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
