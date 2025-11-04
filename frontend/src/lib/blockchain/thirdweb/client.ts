/**
 * Thirdweb v5 client configuration with x402 support
 */
import { createThirdwebClient } from "thirdweb";

// Client for frontend (uses clientId)
export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Server-side client (uses secretKey) - only in API routes
export function getThirdwebServerClient() {
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("THIRDWEB_SECRET_KEY is not configured");
  }

  return createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });
}
