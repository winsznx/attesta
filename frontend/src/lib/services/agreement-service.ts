/**
 * Agreement Service
 *
 * Orchestrates multi-chain agreement creation and validation:
 * - ICP: Primary storage and state management
 * - Constellation: DAG validation and immutable proof
 * - Ethereum: NFT certificate minting
 */

import { constellationClient, type ValidationRequest } from "../blockchain/constellation/client";

export interface AgreementCreationRequest {
  templateType: string;
  title: string;
  contentHash: string;
  parties: string[];
  content?: string;
}

export interface AgreementCreationResult {
  agreementId: string;
  constellationDagHash?: string;
  constellationOrdinal?: number;
  constellationExplorerUrl?: string;
  error?: string;
}

/**
 * Create agreement with multi-chain validation
 */
export async function createAgreementWithValidation(
  request: AgreementCreationRequest,
  icpCreateFn: (
    templateType: string,
    title: string,
    contentHash: string,
    parties: string[]
  ) => Promise<string>
): Promise<AgreementCreationResult> {
  try {
    // Step 1: Create agreement on ICP
    console.log("Creating agreement on ICP...");
    const agreementId = await icpCreateFn(
      request.templateType,
      request.title,
      request.contentHash,
      request.parties
    );

    console.log("Agreement created on ICP:", agreementId);

    // Step 2: Validate on Constellation Network (parallel, non-blocking)
    console.log("Validating on Constellation Network...");

    try {
      const constellationRequest: ValidationRequest = {
        agreement_id: agreementId,
        content_hash: request.contentHash,
        parties: request.parties,
        created_at: Date.now(),
        signed_at: Date.now(),
        metadata: {
          title: request.title,
          template_type: request.templateType,
        },
      };

      const constellationResult = await constellationClient.validateAgreement(
        constellationRequest
      );

      if (constellationResult.success) {
        console.log("Constellation validation successful:", {
          dagHash: constellationResult.dag_hash,
          ordinal: constellationResult.snapshot_ordinal,
        });

        return {
          agreementId,
          constellationDagHash: constellationResult.dag_hash,
          constellationOrdinal: constellationResult.snapshot_ordinal,
          constellationExplorerUrl: constellationResult.snapshot_ordinal
            ? constellationClient.getExplorerUrl(constellationResult.snapshot_ordinal)
            : undefined,
        };
      } else {
        console.warn("WARNING: Constellation validation failed:", constellationResult.error);

        // Return agreement ID even if Constellation validation fails
        return {
          agreementId,
          error: `Constellation validation failed: ${constellationResult.error}`,
        };
      }
    } catch (constellationError) {
      console.error("ERROR: Constellation validation error:", constellationError);

      // Return agreement ID even if Constellation fails
      return {
        agreementId,
        error: "Could not validate on Constellation Network",
      };
    }
  } catch (error) {
    console.error("ERROR: Agreement creation failed:", error);
    throw error;
  }
}

/**
 * Test Constellation network connectivity
 */
export async function testConstellationConnection(): Promise<boolean> {
  try {
    const isAvailable = await constellationClient.isNetworkAvailable();

    if (isAvailable) {
      const networkInfo = await constellationClient.getNetworkInfo();
      console.log("Constellation network connected:", networkInfo);
    } else {
      console.warn("WARNING: Constellation network not available");
    }

    return isAvailable;
  } catch (error) {
    console.error("ERROR: Constellation connection test failed:", error);
    return false;
  }
}
