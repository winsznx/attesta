"use client";

import { useState, useCallback } from "react";
import type { PaymentInfo } from "@/components/payment/X402PaymentModal";

export interface X402FetchOptions extends RequestInit {
  /**
   * If true, will automatically show payment modal on 402 response
   * Default: true
   */
  handlePayment?: boolean;
}

export interface X402PaymentState {
  isPaymentRequired: boolean;
  paymentInfo: PaymentInfo | null;
  isPaying: boolean;
}

/**
 * Hook to handle X402 payments for API calls
 *
 * Usage:
 * ```tsx
 * const { fetch: x402Fetch, paymentState, PaymentModal } = useX402Payment();
 *
 * const response = await x402Fetch('/api/ai/generate', {
 *   method: 'POST',
 *   body: JSON.stringify({ ... })
 * });
 *
 * return (
 *   <>
 *     {PaymentModal}
 *     ...
 *   </>
 * );
 * ```
 */
export function useX402Payment() {
  const [paymentState, setPaymentState] = useState<X402PaymentState>({
    isPaymentRequired: false,
    paymentInfo: null,
    isPaying: false,
  });

  // Store the pending request info
  const [pendingRequest, setPendingRequest] = useState<{
    url: string;
    options: X402FetchOptions;
    resolve: (value: Response) => void;
    reject: (error: any) => void;
  } | null>(null);

  /**
   * Enhanced fetch that handles 402 Payment Required responses
   */
  const x402Fetch = useCallback(
    async (url: string, options: X402FetchOptions = {}): Promise<Response> => {
      const { handlePayment = true, ...fetchOptions } = options;

      try {
        const response = await fetch(url, fetchOptions);

        // Check if payment is required (402 status)
        if (response.status === 402 && handlePayment) {
          // Parse payment headers
          const paymentHeaders = {
            price: response.headers.get("x-payment-price") || "$0.00",
            description: response.headers.get("x-payment-description") || "API Call",
            resourceUrl: response.headers.get("x-payment-resource-url") || url,
            method: response.headers.get("x-payment-method") || options.method || "GET",
          };

          // Return a promise that will resolve after payment
          return new Promise((resolve, reject) => {
            setPendingRequest({
              url,
              options: fetchOptions,
              resolve,
              reject,
            });

            setPaymentState({
              isPaymentRequired: true,
              paymentInfo: paymentHeaders,
              isPaying: false,
            });
          });
        }

        return response;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  /**
   * Handle successful payment - retry request with payment data
   */
  const handlePaymentSuccess = useCallback(
    async (paymentData: string) => {
      if (!pendingRequest) return;

      setPaymentState((prev) => ({ ...prev, isPaying: true }));

      try {
        // Retry the request with payment header
        const response = await fetch(pendingRequest.url, {
          ...pendingRequest.options,
          headers: {
            ...pendingRequest.options.headers,
            "x-payment": paymentData,
          },
        });

        // Resolve the original promise
        pendingRequest.resolve(response);

        // Reset state
        setPaymentState({
          isPaymentRequired: false,
          paymentInfo: null,
          isPaying: false,
        });
        setPendingRequest(null);
      } catch (error) {
        pendingRequest.reject(error);
        setPaymentState({
          isPaymentRequired: false,
          paymentInfo: null,
          isPaying: false,
        });
        setPendingRequest(null);
      }
    },
    [pendingRequest]
  );

  /**
   * Handle payment error
   */
  const handlePaymentError = useCallback(
    (error: string) => {
      if (!pendingRequest) return;

      pendingRequest.reject(new Error(error));

      setPaymentState({
        isPaymentRequired: false,
        paymentInfo: null,
        isPaying: false,
      });
      setPendingRequest(null);
    },
    [pendingRequest]
  );

  /**
   * Handle modal close (cancel payment)
   */
  const handlePaymentCancel = useCallback(() => {
    if (!pendingRequest) return;

    pendingRequest.reject(new Error("Payment cancelled by user"));

    setPaymentState({
      isPaymentRequired: false,
      paymentInfo: null,
      isPaying: false,
    });
    setPendingRequest(null);
  }, [pendingRequest]);

  return {
    /**
     * Enhanced fetch function that handles X402 payments
     */
    fetch: x402Fetch,

    /**
     * Current payment state
     */
    paymentState,

    /**
     * Handlers for payment modal
     */
    handlers: {
      onPaymentSuccess: handlePaymentSuccess,
      onPaymentError: handlePaymentError,
      onPaymentCancel: handlePaymentCancel,
    },
  };
}
