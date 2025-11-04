"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Upload } from "lucide-react";
import { useState } from "react";

export default function VerifyPage() {
  const [verificationId, setVerificationId] = useState("");

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Verify Document</h1>
        <p className="text-muted-foreground mt-2">
          Verify the authenticity of any Attesta document or certificate
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verify by ID</CardTitle>
          <CardDescription>
            Enter the agreement or certificate ID to verify
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-id">Document ID</Label>
            <div className="flex gap-2">
              <Input
                id="verification-id"
                placeholder="Enter document ID..."
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
              />
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700">
                <Search className="h-4 w-4 mr-2" />
                Verify
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify by File</CardTitle>
          <CardDescription>
            Upload a document to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-fuchsia-600 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium mb-1">
              Drop your file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, DOCX, and TXT files
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
