/**
 * x402 Payment Middleware Helper (Nexus)
 *
 * Reusable middleware to protect API routes with micropayments using Nexus.
 * Usage: Wrap any API route handler with withX402Payment()
 */
import { NextRequest, NextResponse } from "next/server";
import { settlePayment } from "@thirdweb-dev/nexus";
import { getNexusFacilitator, PAYMENT_CONFIG } from "./x402-facilitator";

export type PaymentEndpoint = keyof typeof PAYMENT_CONFIG;

export interface WithPaymentOptions {
  endpoint: PaymentEndpoint;
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

/**
 * Wraps an API route handler with x402 payment protection
 *
 * @param handler - The actual API route logic to execute after payment
 * @param options - Payment configuration options
 * @returns NextResponse with either the handler result or 402 Payment Required
 *
 * @example
 * ```typescript
 * export const POST = withX402Payment(
 *   async (request) => {
 *     // Your API logic here
 *     return NextResponse.json({ data: "success" });
 *   },
 *   { endpoint: "AI_GENERATION" }
 * );
 * ```
 */
export function withX402Payment(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: WithPaymentOptions
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get payment configuration for this endpoint
      const config = PAYMENT_CONFIG[options.endpoint];
      const method = options.method || request.method;

      // Get payment data from request header
      const paymentData = request.headers.get("x-payment");

      // Get or create Nexus facilitator
      const facilitator = getNexusFacilitator();

      // Construct the resource URL
      const url = new URL(request.url);
      const resourceUrl = `${url.origin}${url.pathname}`;

      // Attempt to settle payment
      const result = await settlePayment({
        resourceUrl,
        method: method as any,
        paymentData,
        network: "base-sepolia", // Using Base Sepolia testnet
        price: config.price,
        facilitator,
      });

      // If payment successful (status 200), execute the actual handler
      if (result.status === 200) {
        return await handler(request);
      }

      // If payment not made or invalid, return 402 Payment Required
      return NextResponse.json(result.responseBody, {
        status: result.status,
        headers: result.responseHeaders as any,
      });
    } catch (error) {
      console.error("x402 payment middleware error:", error);

      // Return generic error
      return NextResponse.json(
        {
          error: "Payment processing failed",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Utility to check if Nexus x402 is properly configured
 *
 * @returns true if all required environment variables are set
 */
export function isX402Configured(): boolean {
  return !!process.env.NEXUS_WALLET_SECRET;
}

/**
 * Gracefully disable x402 if not configured (for development)
 *
 * @param handler - The API handler to execute without payment
 * @param options - Payment options (ignored if disabled)
 * @returns Either payment-protected or direct handler execution
 */
export function withOptionalX402Payment(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: WithPaymentOptions
) {
  if (isX402Configured()) {
    return withX402Payment(handler, options);
  }

  // If not configured, skip payment and log warning
  return async (request: NextRequest) => {
    console.warn(
      `x402 payment disabled for ${options.endpoint} - configure NEXUS_WALLET_SECRET to enable (get it from https://nexus.thirdweb.com)`
    );
    return await handler(request);
  };
}
