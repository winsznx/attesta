import { Principal } from "@dfinity/principal";
import {
  getAgreementManagerActor,
  getAuthenticatedAgreementManagerActor,
} from "../blockchain/icp/actors";
import type {
  Agreement,
  AgreementUI,
  UserStats,
} from "../blockchain/icp/candid/agreement_manager";
import { convertAgreement } from "../blockchain/icp/candid/agreement_manager";
import { convertPartyToPrincipal, getUserPrincipalFromWallet } from "../blockchain/icp/address-converter";

export class AgreementService {
  /**
   * Create a new agreement
   */
  static async createAgreement(
    templateType: string,
    title: string,
    contentHash: string,
    parties: string[]
  ): Promise<string> {
    try {
      const actor = await getAuthenticatedAgreementManagerActor();
      // Convert parties (Ethereum addresses or ICP Principals) to ICP Principals
      const partiesPrincipals = parties.map((p) => convertPartyToPrincipal(p));
      const agreementId = await actor.create_agreement(
        templateType,
        title,
        contentHash,
        partiesPrincipals
      );
      return agreementId;
    } catch (error) {
      console.error("Failed to create agreement:", error);
      throw error;
    }
  }

  /**
   * Get a single agreement by ID
   */
  static async getAgreement(id: string): Promise<AgreementUI | null> {
    try {
      const actor = await getAgreementManagerActor();
      const result = await actor.get_agreement(id);
      // Handle tuple return type: [Agreement] or []
      if (result.length > 0) {
        return convertAgreement(result[0]);
      }
      return null;
    } catch (error) {
      console.error("Failed to get agreement:", error);
      return null;
    }
  }

  /**
   * Get all agreements for a user
   */
  static async getUserAgreements(
    userPrincipal: string | null,
    ethAddress?: string | null
  ): Promise<AgreementUI[]> {
    try {
      const actor = await getAgreementManagerActor();
      // If userPrincipal is provided and is a valid Principal, use it
      // Otherwise, derive from Ethereum address
      const principal = userPrincipal
        ? convertPartyToPrincipal(userPrincipal)
        : ethAddress
        ? getUserPrincipalFromWallet(ethAddress)
        : Principal.anonymous();
      const agreements = await actor.get_user_agreements(principal);
      // Convert from canister format to UI format
      return agreements.map(convertAgreement);
    } catch (error) {
      console.error("Failed to get user agreements:", error);
      return [];
    }
  }

  /**
   * Update agreement status
   */
  static async updateStatus(
    id: string,
    status: string
  ): Promise<boolean> {
    try {
      const actor = await getAuthenticatedAgreementManagerActor();
      return await actor.update_status(id, status);
    } catch (error) {
      console.error("Failed to update status:", error);
      return false;
    }
  }

  /**
   * Sign an agreement
   */
  static async signAgreement(id: string): Promise<boolean> {
    try {
      const actor = await getAuthenticatedAgreementManagerActor();
      return await actor.sign_agreement(id);
    } catch (error) {
      console.error("Failed to sign agreement:", error);
      return false;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(
    userPrincipal: string | null,
    ethAddress?: string | null
  ): Promise<UserStats> {
    try {
      const actor = await getAgreementManagerActor();
      // If userPrincipal is provided and is a valid Principal, use it
      // Otherwise, derive from Ethereum address
      const principal = userPrincipal
        ? convertPartyToPrincipal(userPrincipal)
        : ethAddress
        ? getUserPrincipalFromWallet(ethAddress)
        : Principal.anonymous();
      return await actor.get_user_stats(principal);
    } catch (error) {
      console.error("Failed to get user stats:", error);
      return {
        total_agreements: BigInt(0),
        pending_signatures: BigInt(0),
        signed_agreements: BigInt(0),
      };
    }
  }
}
