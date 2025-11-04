"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2">
          Analytics and insights for your agreements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Coming Soon
          </CardTitle>
          <CardDescription>
            Detailed reports and analytics will be available here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This feature is currently under development. You'll soon be able to view:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>• Agreement signing trends</li>
            <li>• Time to signature metrics</li>
            <li>• Popular agreement types</li>
            <li>• Network usage statistics</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
