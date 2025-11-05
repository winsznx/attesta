"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { constellationClient, type ConstellationSnapshot } from "@/lib/blockchain/constellation/client";

export function ConstellationStatus() {
  const [networkInfo, setNetworkInfo] = useState<ConstellationSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkNetwork();
  }, []);

  async function checkNetwork() {
    setIsLoading(true);
    try {
      const info = await constellationClient.getNetworkInfo();
      setNetworkInfo(info);
      setIsConnected(info !== null);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-purple-200 dark:border-purple-900/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Network className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          Constellation Network
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <div className="flex items-center gap-1">
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                <span className="text-[10px] text-muted-foreground">Checking...</span>
              </>
            ) : isConnected ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-[10px] text-green-600 dark:text-green-400">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-red-500" />
                <span className="text-[10px] text-red-600 dark:text-red-400">Offline</span>
              </>
            )}
          </div>
        </div>

        {networkInfo && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Network</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {networkInfo.name}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ordinal</span>
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                {networkInfo.ordinal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">DAG Integration</span>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Active
              </span>
            </div>
          </>
        )}

        <p className="text-[10px] text-muted-foreground pt-2 border-t">
          Multi-chain proof validation with HGTP
        </p>
      </CardContent>
    </Card>
  );
}
