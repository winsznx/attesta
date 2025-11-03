import { Actor, ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory as agreementManagerIDL } from "./candid/agreement_manager";
import type {
  Agreement as CandidAgreement,
  AgreementStatus,
  Signature,
  UserStats as CandidUserStats,
} from "./candid/agreement_manager";
import { createAgent } from "./agent";

// Re-export types from candid for convenience
export type {
  Agreement,
  AgreementStatus,
  Signature,
  UserStats,
} from "./candid/agreement_manager";

// AgreementManager actor interface matching the Candid interface
export interface AgreementManagerActor {
  create_agreement: (
    template_type: string,
    title: string,
    content_hash: string,
    parties: Principal[]
  ) => Promise<string>;
  get_agreement: (id: string) => Promise<[CandidAgreement] | []>;
  get_user_agreements: (user: Principal) => Promise<CandidAgreement[]>;
  update_status: (id: string, status: string) => Promise<boolean>;
  get_user_stats: (user: Principal) => Promise<CandidUserStats>;
  sign_agreement: (id: string) => Promise<boolean>;
}

let agreementManagerActor: ActorSubclass<AgreementManagerActor> | null = null;

/**
 * Get Agreement Manager actor (anonymous)
 */
export async function getAgreementManagerActor(): Promise<
  ActorSubclass<AgreementManagerActor>
> {
  if (agreementManagerActor) {
    return agreementManagerActor;
  }

  const agent = await createAgent();
  const canisterId = process.env.NEXT_PUBLIC_AGREEMENT_MANAGER_CANISTER_ID;

  if (!canisterId) {
    throw new Error(
      "NEXT_PUBLIC_AGREEMENT_MANAGER_CANISTER_ID not set in environment"
    );
  }

  agreementManagerActor = Actor.createActor<AgreementManagerActor>(
    agreementManagerIDL,
    {
      agent,
      canisterId,
    }
  );

  return agreementManagerActor;
}

/**
 * Get Agreement Manager actor (authenticated)
 * For now, same as anonymous - can add auth later
 */
export async function getAuthenticatedAgreementManagerActor(): Promise<
  ActorSubclass<AgreementManagerActor>
> {
  return getAgreementManagerActor();
}
