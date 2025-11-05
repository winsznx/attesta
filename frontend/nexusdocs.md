Nexus Router
The Nexus Router is a high-performance, hosted proxy that handles payment verification, settlement and request forwarding.

How It Works
Your API
Nexus Router
Consumer
Your API
Nexus Router
Consumer
API Request
Return 402 Payment Required
API Request + Payment
Settle Payment
Forward Request
Response
Return Response
Request Flow
Consumer initiates request: The consumer sends an API request with payment information
Payment verification: The router validates the payment on-chain
Request forwarding: Upon successful payment, the request is forwarded to your API
Response handling: The router returns your API's response to the consumer
Configuration
In the Nexus Dashboard, you can create your own payable endpoints.

Registering your API
Import from OpenAPI spec (recommended) or enter details manually
Add authentication headers or query parameters to your API that will authorize access to your API
Configuring your price per request
Enter your price, chain and token per request
Enter the recipient address that will receive the payment
Select the payment mode:
Async: The payment is settled asynchronously after the request is completed (fastest)
Before: The payment is settled before the request is completed
After: The payment is settled after the request is completed (slowest)
Select the settlement mode:
Simulated: Payment is considered successful after the transaction is simulated (fastest)
Submitted: Payment is considered successful after the transaction is submitted onchain
Confirmed: Payment is considered successful after the transaction is confirmed onchain (slowest)
Configuring your API Metadata
If you have an OpenAPI spec, you can import it to automatically configure your API metadata. Otherwise, you can enter the details manually. Follow the OpenAPI spec for declaring how to use your API (body, query parameters, path parameters, etc.) It's important for AI agents to have clear descriptions and input schemas to understand how to use your API.

Testing your paid API
You can test your proxied API in the API Tester of your nexus dashboard. This will use your connected wallet to pay for the request, and return the response from your API if successful.
AI Agents Integration
Integrate Nexus with AI agents to enable autonomous API payments. This allows AI assistants to make paid API calls on behalf of users.

The Nexus MCP URL is

https://nexus-api.thirdweb.com/mcp

which gives every agent:

A wallet to pay for API calls
A semantic search engine to find APIs
A tool to pay for API calls following the x402 protocol
Integrate into popular AI clients
ChatGPT
Claude Desktop
Claude Code
Cursor
Install Nexus MCP in ChatGPT
Go to ChatGPT
Click Settings > Apps & Connectors (enable Developer mode in Advanced Settings first) > Create
Enter the MCP name: "Nexus"
Enter the MCP URL:
https://nexus-api.thirdweb.com/mcp
Click Save and follow the authentication steps
Using Nexus with Your Own Agent
If you're building your own AI agent, you can integrate Nexus MCP as a remote server:

Prerequisites
Create a agent wallet from the Nexus Dashboard
Get your wallet secret
Integration
Add the Nexus MCP URL as a remote MCP server transport and replace <YOUR_WALLET_SECRET> with your agent wallet secret:

import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(
    new URL("https://nexus-api.thirdweb.com/mcp"),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer <YOUR_WALLET_SECRET>`,
        },
      },
    },
  ),
});

const response = await generateText({
  model: openai("gpt-4o"),
  tools: await mcpClient.tools(),
  prompt: "What stocks should I buy and sell today?",
});