import { useState, useEffect } from "react";
import { Agreement, UserStats } from "../blockchain/icp/actors";
import { AgreementService } from "../services/agreements";

export function useAgreements(userPrincipal?: string) {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userPrincipal) {
      setLoading(false);
      return;
    }

    const fetchAgreements = async () => {
      try {
        setLoading(true);
        const data = await AgreementService.getUserAgreements(userPrincipal);
        setAgreements(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch agreements");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreements();
  }, [userPrincipal]);

  return { agreements, loading, error };
}

export function useUserStats(userPrincipal?: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userPrincipal) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await AgreementService.getUserStats(userPrincipal);
        setStats(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userPrincipal]);

  return { stats, loading, error };
}
