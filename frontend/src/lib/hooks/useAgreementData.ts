"use client";

import { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import { getAgreementManagerActor } from "../blockchain/icp/actors";
import type {
  Agreement,
  AgreementUI,
  UserStats,
} from "../blockchain/icp/candid/agreement_manager";
import { convertAgreement } from "../blockchain/icp/candid/agreement_manager";
import { getUserPrincipalFromWallet, convertPartyToPrincipal } from "../blockchain/icp/address-converter";

/**
 * Hook to fetch agreements from ICP canister
 */
export function useAgreementData(userPrincipal?: string, ethAddress?: string | null) {
  const [agreements, setAgreements] = useState<AgreementUI[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userPrincipal && !ethAddress) {
      setLoading(false);
      return;
    }

    loadData();
  }, [userPrincipal, ethAddress]);

  async function loadData() {
    if (!userPrincipal && !ethAddress) return;

    try {
      setLoading(true);
      setError(null);

      // Add timeout to prevent hanging (10 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );

      const dataPromise = (async () => {
        const actor = await getAgreementManagerActor();
        // Get principal: use provided principal, or derive from Ethereum address
        const principal = userPrincipal
          ? convertPartyToPrincipal(userPrincipal)
          : ethAddress
          ? getUserPrincipalFromWallet(ethAddress)
          : Principal.anonymous();

        // Fetch agreements and stats in parallel
        const [agreementsData, statsData] = await Promise.all([
          actor.get_user_agreements(principal),
          actor.get_user_stats(principal),
        ]);

        // Convert agreements from canister format to UI format
        const convertedAgreements = agreementsData.map(convertAgreement);

        return { agreements: convertedAgreements, stats: statsData };
      })();

      // Race between data loading and timeout
      const result = await Promise.race([dataPromise, timeoutPromise]) as any;

      setAgreements(result.agreements);
      setStats(result.stats);

    } catch (err: any) {
      const errorMsg = err?.message?.includes("timeout")
        ? "Request timed out. Make sure ICP backend is running (cd backend/icp && dfx start)"
        : "Failed to connect to ICP canister";
      setError(errorMsg);
      console.error("Load data error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createAgreement(
    templateType: string,
    title: string,
    contentHash: string,
    parties: string[]
  ) {
    try {
      const actor = await getAgreementManagerActor();
      // Convert parties (Ethereum addresses or ICP Principals) to ICP Principals
      const partiesPrincipals = parties.map((p) => convertPartyToPrincipal(p));

      const agreementId = await actor.create_agreement(
        templateType,
        title,
        contentHash,
        partiesPrincipals
      );

      // Reload data
      await loadData();

      return agreementId;
    } catch (err) {
      throw err;
    }
  }

  return {
    agreements,
    stats,
    loading,
    error,
    refetch: loadData,
    createAgreement,
  };
}
