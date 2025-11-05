"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Wallet, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { useWallet } from "@/components/providers/WalletProvider";

export interface PaymentInfo {
  price: string;
  description: string;
  resourceUrl: string;
  method: string;
}

interface X402PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentInfo: PaymentInfo | null;
  onPaymentSuccess: (paymentData: string) => void;
  onPaymentError: (error: string) => void;
}

export function X402PaymentModal({
  isOpen,
  onClose,
  paymentInfo,
  onPaymentSuccess,
  onPaymentError,
}: X402PaymentModalProps) {
  const { address, isConnected } = useWallet();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!isConnected || !address) {
      setErrorMessage("Please connect your wallet first");
      setPaymentStatus("error");
      return;
    }

    if (!paymentInfo) {
      setErrorMessage("Payment information is missing");
      setPaymentStatus("error");
      return;
    }

    setIsPaying(true);
    setPaymentStatus("idle");
    setErrorMessage(null);

    try {
      // TODO: Implement X402 payment with Nexus SDK
      // For now, create a mock payment structure
      const payment = {
        resourceUrl: paymentInfo.resourceUrl,
        method: paymentInfo.method,
        network: "base-sepolia",
        price: paymentInfo.price,
        timestamp: Date.now(),
        payer: address,
      };

      // Encode payment data as base64
      const paymentData = btoa(JSON.stringify(payment));

      setPaymentStatus("success");
      onPaymentSuccess(paymentData);

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Payment failed:", error);
      const message = error?.message || "Payment failed. Please try again.";
      setErrorMessage(message);
      setPaymentStatus("error");
      onPaymentError(message);
    } finally {
      setIsPaying(false);
    }
  };

  const handleClose = () => {
    if (!isPaying) {
      onClose();
      // Reset state after close animation
      setTimeout(() => {
        setPaymentStatus("idle");
        setErrorMessage(null);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-fuchsia-600" />
            Payment Required
          </DialogTitle>
          <DialogDescription>
            This action requires a micropayment to proceed
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Info */}
          {paymentInfo && (
            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/20 dark:to-pink-950/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Service</span>
                <span className="text-sm font-medium">{paymentInfo.description}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">
                  {paymentInfo.price}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="text-sm font-medium">Base Sepolia</span>
              </div>
            </div>
          )}

          {/* Wallet Status */}
          {!isConnected && (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to make a payment
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Status */}
          {paymentStatus === "success" && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                Payment successful! Processing your request...
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === "error" && errorMessage && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isPaying}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!isConnected || isPaying || paymentStatus === "success"}
              className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-700"
            >
              {isPaying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : paymentStatus === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Paid
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Pay {paymentInfo?.price || "$0.00"}
                </>
              )}
            </Button>
          </div>

          {/* Powered by Nexus */}
          <p className="text-xs text-center text-muted-foreground">
            Powered by{" "}
            <a
              href="https://nexus.thirdweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fuchsia-600 hover:underline"
            >
              Thirdweb Nexus
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
