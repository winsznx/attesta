import { HttpAgent, Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

// ICP Network Configuration
const HOST = process.env.NEXT_PUBLIC_ICP_HOST || "http://localhost:4943";
const IS_LOCAL = HOST.includes("localhost") || HOST.includes("127.0.0.1");

let agent: HttpAgent | null = null;
let authClient: AuthClient | null = null;

/**
 * Create or get the ICP HTTP Agent
 */
export async function createAgent(): Promise<HttpAgent> {
  if (agent) return agent;

  agent = new HttpAgent({
    host: HOST,
  });

  // Fetch root key for local development (insecure, only for testing)
  if (IS_LOCAL) {
    try {
      // Add timeout to prevent hanging
      await Promise.race([
        agent.fetchRootKey(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("fetchRootKey timeout")), 5000)
        ),
      ]);
      console.log("✅ Connected to local ICP replica");
    } catch (error) {
      console.warn("⚠️ Could not fetch root key from local replica. Make sure dfx is running.");
      console.warn("Error:", error);
      // Don't throw - allow the agent to be used anyway
    }
  }

  return agent;
}

/**
 * Initialize the ICP HTTP Agent (alias for createAgent)
 */
export async function initAgent(): Promise<HttpAgent> {
  return createAgent();
}

/**
 * Get or create AuthClient instance
 */
export async function getAuthClient(): Promise<AuthClient> {
  if (authClient) return authClient;

  authClient = await AuthClient.create();
  return authClient;
}

/**
 * Login with Internet Identity
 */
export async function loginWithII(): Promise<boolean> {
  try {
    const client = await getAuthClient();

    return new Promise((resolve) => {
      client.login({
        identityProvider: IS_LOCAL
          ? `http://localhost:4943/?canisterId=${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}`
          : "https://identity.ic0.app",
        onSuccess: () => {
          resolve(true);
        },
        onError: (error) => {
          resolve(false);
        },
      });
    });
  } catch (error) {
    return false;
  }
}

/**
 * Logout from Internet Identity
 */
export async function logout(): Promise<void> {
  const client = await getAuthClient();
  await client.logout();
  agent = null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const client = await getAuthClient();
  return await client.isAuthenticated();
}

/**
 * Get the current identity principal
 */
export async function getPrincipal(): Promise<string> {
  const client = await getAuthClient();
  const identity = client.getIdentity();
  return identity.getPrincipal().toText();
}

/**
 * Create an authenticated agent
 */
export async function getAuthenticatedAgent(): Promise<HttpAgent> {
  const client = await getAuthClient();
  const identity = client.getIdentity();

  const authenticatedAgent = new HttpAgent({
    host: HOST,
    identity,
  });

  if (IS_LOCAL) {
    await authenticatedAgent.fetchRootKey();
  }

  return authenticatedAgent;
}
