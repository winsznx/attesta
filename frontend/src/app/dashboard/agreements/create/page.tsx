"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  FileText,
  Users,
  Loader2,
  ArrowLeft,
  Wand2,
  CheckCircle2,
  X,
  Briefcase,
  Home,
  UserCheck,
  UsersRound,
  Lock,
  PenTool,
} from "lucide-react";
import { useWallet } from "@/components/providers/WalletProvider";
import { useAgreementData } from "@/lib/hooks/useAgreementData";
import { useX402Payment } from "@/lib/hooks/useX402Payment";
import { X402PaymentModal } from "@/components/payment/X402PaymentModal";
import { createAgreementWithValidation } from "@/lib/services/agreement-service";
import { sha256 } from "js-sha256";
import { Principal } from "@dfinity/principal";
import { convertPartyToPrincipal } from "@/lib/blockchain/icp/address-converter";
import { DocumentEditor } from "@/components/agreements/wizard/DocumentEditor";

const TEMPLATES = [
  {
    id: "freelance",
    name: "Freelance Services",
    description: "Contracts for freelance work and services",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "rental",
    name: "Rental Agreement",
    description: "Lease agreements for property rentals",
    icon: Home,
    color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "employment",
    name: "Employment Contract",
    description: "Employment agreements and contracts",
    icon: UserCheck,
    color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "partnership",
    name: "Partnership Agreement",
    description: "Business partnership agreements",
    icon: UsersRound,
    color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
  },
  {
    id: "nda",
    name: "Non-Disclosure Agreement",
    description: "Confidentiality and NDA agreements",
    icon: Lock,
    color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "custom",
    name: "Custom Agreement",
    description: "Create a completely custom agreement",
    icon: PenTool,
    color: "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-900/30",
  },
];

export default function CreateAgreementPage() {
  const router = useRouter();
  const { address } = useWallet();
  const { fetch: x402Fetch, paymentState, handlers } = useX402Payment();
  const [step, setStep] = useState<"template" | "details" | "ai" | "review">(
    "template"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parties, setParties] = useState<string[]>(["", ""]);
  const [aiContent, setAiContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const { createAgreement } = useAgreementData();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep("details");
  };

  const handleGenerateAI = async () => {
    if (!description.trim()) {
      alert("Please provide a description for the agreement");
      return;
    }

    setIsGenerating(true);
    try {
      // Use X402-enabled fetch that handles payments automatically
      const response = await x402Fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          templateType: selectedTemplate,
          context: `Title: ${title}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      const data = await response.json();
      setAiContent(data.content);
      setStep("review");
    } catch (error: any) {
      // Only show alert if it's not a payment cancellation
      if (!error?.message?.includes("cancelled")) {
        alert("Failed to generate document. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAgreement = async () => {
    if (!title.trim()) {
      alert("Please provide a title");
      return;
    }

    // We need at least 2 party slots (can be blank)
    if (parties.length < 2) {
      alert("Please provide at least 2 party slots");
      return;
    }

    setIsCreating(true);
    try {
      // Calculate content hash
      const content = aiContent || description;
      const contentHash = sha256(content);

      // Convert wallet addresses to principals
      const partyPrincipals: string[] = [];

      for (const addr of parties) {
        const trimmedAddr = addr.trim();

        if (trimmedAddr === "") {
          // Empty field - use placeholder
          partyPrincipals.push(Principal.anonymous().toText());
        } else {
          try {
            // Try to parse as principal
            // Convert Ethereum address or ICP Principal to Principal
            const principal = convertPartyToPrincipal(trimmedAddr);
            partyPrincipals.push(principal.toText());
          } catch {
            // If not a valid principal, generate a unique placeholder
            // In production, you'd want to convert Ethereum addresses properly
            partyPrincipals.push(Principal.anonymous().toText());
          }
        }
      }

      // Add creator as first party (derive from connected wallet)
      const creatorPrincipal = address
        ? convertPartyToPrincipal(address).toText()
        : Principal.anonymous().toText();
      const allParties = [creatorPrincipal, ...partyPrincipals];

      // Create agreement with multi-chain validation (ICP + Constellation)
      const result = await createAgreementWithValidation(
        {
          templateType: selectedTemplate || "custom",
          title,
          contentHash,
          parties: allParties,
          content,
        },
        createAgreement
      );

      if (result.constellationDagHash) {
        console.log("Agreement validated on Constellation:", {
          dagHash: result.constellationDagHash,
          ordinal: result.constellationOrdinal,
        });
      }

      router.push(`/dashboard/agreements/${result.agreementId}`);
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create agreement";
      alert(`Failed to create agreement: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  const addParty = () => {
    setParties([...parties, ""]);
  };

  const removeParty = (index: number) => {
    if (parties.length > 2) {
      setParties(parties.filter((_, i) => i !== index));
    }
  };

  const updateParty = (index: number, value: string) => {
    const newParties = [...parties];
    newParties[index] = value;
    setParties(newParties);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
          Create Agreement
        </h1>
        <p className="text-muted-foreground mt-2">
          Create a new blockchain-backed legal agreement with AI assistance
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { key: "template", label: "Template" },
            { key: "details", label: "Details" },
            { key: "ai", label: "AI Generate" },
            { key: "review", label: "Review" },
          ].map((s, index) => {
            const stepKeys = ["template", "details", "ai", "review"];
            const currentStepIndex = stepKeys.indexOf(step);
            const isActive = step === s.key;
            const isCompleted = stepKeys.indexOf(s.key) < currentStepIndex;

            return (
              <div key={s.key} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      isActive
                        ? "bg-fuchsia-600 text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive
                        ? "text-fuchsia-600 dark:text-fuchsia-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? "bg-green-600" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Selection */}
      {step === "template" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
              <CardDescription>
                Select a template or create a custom agreement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  return (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? "border-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/20"
                            : "hover:border-fuchsia-300 dark:hover:border-fuchsia-800"
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardContent className="p-6">
                          <div className={`rounded-lg p-3 w-fit mb-3 ${template.color}`}>
                            <Icon className="h-8 w-8" />
                          </div>
                          <h3 className="font-semibold mb-2">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Details Form */}
      {step === "details" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
              <CardDescription>
                Provide the basic information for your agreement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Agreement Title *
                </label>
                <Input
                  placeholder="e.g., Freelance Services Agreement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe what this agreement covers, key terms, parties involved, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This description will be used by AI to generate the full
                  legal document
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Parties *</label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addParty}
                    type="button"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Party
                  </Button>
                </div>
                <div className="space-y-2">
                  {parties.map((party, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Enter ICP Principal (e.g., aaaaa-aa) or leave blank for placeholder`}
                        value={party}
                        onChange={(e) => updateParty(index, e.target.value)}
                      />
                      {parties.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeParty(index)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum 2 parties required. You can leave blank to use placeholders for testing.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="useAI" className="text-sm">
                  Use AI to generate document content
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("template")}>
              Back
            </Button>
            <Button
              onClick={() => (useAI ? setStep("ai") : handleCreateAgreement())}
              disabled={!title.trim() || !description.trim()}
              className="bg-fuchsia-600 hover:bg-fuchsia-700"
            >
              {useAI ? "Generate with AI" : "Create Agreement"}
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* AI Generation */}
      {step === "ai" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                AI Document Generation
              </CardTitle>
              <CardDescription>
                Generating your legal document with AI...
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-fuchsia-600 mb-4" />
                  <p className="text-muted-foreground">
                    AI is creating your legal document...
                  </p>
                </div>
              ) : aiContent ? (
                <div className="space-y-4">
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">
                      Edit your document
                    </label>
                    <p className="text-xs text-muted-foreground mb-4">
                      You can edit the AI-generated content below. Use the toolbar to format your document.
                    </p>
                    <DocumentEditor
                      content={aiContent}
                      onChange={setAiContent}
                      placeholder="AI-generated content will appear here..."
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("details")}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep("review")}
                      className="bg-fuchsia-600 hover:bg-fuchsia-700"
                    >
                      Review & Create
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={handleGenerateAI}
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
                    disabled={!description.trim()}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Review & Create */}
      {step === "review" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="border-fuchsia-200 dark:border-fuchsia-900/50">
            <CardHeader>
              <CardTitle>Review & Create</CardTitle>
              <CardDescription>
                Review your agreement before creating it on-chain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Title</h3>
                <p className="text-muted-foreground">{title}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Template</h3>
                <Badge>
                  {TEMPLATES.find((t) => t.id === selectedTemplate)?.name ||
                    "Custom"}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Parties</h3>
                <div className="space-y-1">
                  {parties
                    .filter((p) => p.trim() !== "")
                    .map((party, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        Party {index + 1}: {party}
                      </div>
                    ))}
                </div>
              </div>

              {aiContent && (
                <div>
                  <h3 className="font-semibold mb-2">Generated Content</h3>
                  <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {aiContent}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("ai")}>
                  Back
                </Button>
                <Button
                  onClick={handleCreateAgreement}
                  disabled={isCreating}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Agreement
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* X402 Payment Modal */}
      <X402PaymentModal
        isOpen={paymentState.isPaymentRequired}
        onClose={handlers.onPaymentCancel}
        paymentInfo={paymentState.paymentInfo}
        onPaymentSuccess={handlers.onPaymentSuccess}
        onPaymentError={handlers.onPaymentError}
      />
    </div>
  );
}
