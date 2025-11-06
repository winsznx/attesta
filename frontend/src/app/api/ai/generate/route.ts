import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { withOptionalX402Payment } from "@/lib/blockchain/thirdweb/payment-middleware";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Actual handler logic (executed after payment)
async function handleAIGeneration(request: NextRequest) {
  console.log("[AI Generation] API called");

  try {
    const body = await request.json();
    const { description, templateType, context } = body;

    console.log("[AI Generation] Request data:", {
      description: description?.substring(0, 50) + "...",
      templateType,
      hasContext: !!context
    });

    if (!description) {
      console.error("[AI Generation] ERROR: No description provided");
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("[AI Generation] ERROR: OpenAI API key not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    console.log("[AI Generation] OpenAI API key found");

    // Build the prompt based on template type
    let systemPrompt = `You are a professional legal document generator. Your task is to create complete, formal legal agreements from scratch based on user requirements.

IMPORTANT INSTRUCTIONS:
- Generate a FULL legal document with all sections, clauses, and legal language
- DO NOT just repeat or summarize the user's description
- Use proper legal formatting with sections, numbered clauses, and formal language
- Include standard legal provisions (definitions, terms, obligations, etc.)
- Make it comprehensive and ready to use
- Output ONLY the legal document content, no explanations or meta-commentary`;

    const templatePrompts: { [key: string]: string } = {
      "freelance": `Create a freelance services agreement. Include:
- Parties involved (Client and Freelancer)
- Scope of work description
- Payment terms and schedule
- Intellectual property rights
- Termination clauses
- Dispute resolution`,
      "rental": `Create a rental/lease agreement. Include:
- Property description and address
- Lease term and dates
- Rent amount and payment schedule
- Security deposit terms
- Tenant and landlord responsibilities
- Maintenance and repair obligations
- Termination conditions`,
      "employment": `Create an employment contract. Include:
- Job title and description
- Compensation and benefits
- Work schedule and location
- Confidentiality and non-compete clauses
- Termination conditions
- Intellectual property assignment`,
      "partnership": `Create a partnership agreement. Include:
- Partnership structure and purpose
- Capital contributions
- Profit and loss distribution
- Decision-making processes
- Dispute resolution
- Dissolution procedures`,
      "nda": `Create a Non-Disclosure Agreement. Include:
- Definition of confidential information
- Obligations of receiving party
- Exceptions to confidentiality
- Term and duration
- Remedies for breach`,
      "custom": `Create a custom legal agreement based on the user's specific needs.`,
    };

    const templatePrompt =
      templatePrompts[templateType || "custom"] ||
      templatePrompts["custom"];

    const userPrompt = `Generate a complete legal document with the following requirements:

DOCUMENT TYPE: ${templateType || "custom"}

REQUIREMENTS:
${templatePrompt}

USER SPECIFICATIONS:
${description}

${context ? `ADDITIONAL CONTEXT:\n${context}` : ""}

---

Now generate the COMPLETE legal document. Start with a title, then include all necessary sections with proper legal language and formatting. Make it detailed and ready for actual use.`;

    console.log("[AI Generation] Calling OpenAI API...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    console.log("[AI Generation] OpenAI response received");

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      console.error("[AI Generation] ERROR: No content generated");
      return NextResponse.json(
        { error: "Failed to generate document" },
        { status: 500 }
      );
    }

    console.log("[AI Generation] Document generated successfully");

    return NextResponse.json({
      content: generatedContent,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: any) {
    console.error("[AI Generation] ERROR:", error);
    console.error("[AI Generation] Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      {
        error: "Failed to generate document",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Use x402 payment protection with optional fallback
export const POST = withOptionalX402Payment(handleAIGeneration, {
  endpoint: "AI_GENERATION",
  method: "POST",
});
