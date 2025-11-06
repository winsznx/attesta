import { IDL } from "@dfinity/candid";

export const idlFactory = ({ IDL }: any) => {
  // AgreementStatus variant - matches Rust enum
  const AgreementStatus = IDL.Variant({
    Draft: IDL.Null,
    Pending: IDL.Null,
    Signed: IDL.Null,
    Cancelled: IDL.Null,
  });

  // Signature record
  const Signature = IDL.Record({
    signer: IDL.Principal,
    signed_at: IDL.Nat64,
    signature_hash: IDL.Text,
  });

  // Agreement record - matches Rust struct exactly
  const Agreement = IDL.Record({
    id: IDL.Text,
    template_type: IDL.Text,
    title: IDL.Text,
    content_hash: IDL.Text,
    creator: IDL.Principal,
    parties: IDL.Vec(IDL.Principal),
    status: AgreementStatus, // Enum variant
    signatures: IDL.Vec(Signature), // Include signatures array
    created_at: IDL.Nat64,
    updated_at: IDL.Nat64,
  });

  // UserStats record
  const UserStats = IDL.Record({
    total_agreements: IDL.Nat64,
    pending_signatures: IDL.Nat64,
    signed_agreements: IDL.Nat64,
  });

  return IDL.Service({
    create_agreement: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Principal)],
      [IDL.Text],
      []
    ),
    get_agreement: IDL.Func([IDL.Text], [IDL.Opt(Agreement)], ["query"]),
    get_user_agreements: IDL.Func(
      [IDL.Principal],
      [IDL.Vec(Agreement)],
      ["query"]
    ),
    update_status: IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    get_user_stats: IDL.Func([IDL.Principal], [UserStats], ["query"]),
    sign_agreement: IDL.Func([IDL.Text], [IDL.Bool], []),
  });
};

// TypeScript type definitions matching the Candid interface
export type AgreementStatusVariant = {
  Draft?: null;
  Pending?: null;
  Signed?: null;
  Cancelled?: null;
};

// Helper type for easier use
export type AgreementStatus = "Draft" | "Pending" | "Signed" | "Cancelled";

export interface Signature {
  signer: string; // Principal as string
  signed_at: bigint; // Nat64 as bigint
  signature_hash: string;
}

export interface Agreement {
  id: string;
  template_type: string;
  title: string;
  content_hash: string;
  creator: string; // Principal as string
  parties: string[]; // Vec Principal as string array
  status: AgreementStatusVariant; // From canister, needs conversion
  signatures: Signature[]; // Array of signatures
  created_at: bigint; // Nat64 as bigint
  updated_at: bigint; // Nat64 as bigint
}

export interface UserStats {
  total_agreements: bigint; // Nat64 as bigint
  pending_signatures: bigint; // Nat64 as bigint
  signed_agreements: bigint; // Nat64 as bigint
}

/**
 * Convert AgreementStatusVariant to string
 */
export function statusVariantToString(
  variant: AgreementStatusVariant
): AgreementStatus {
  if ("Draft" in variant && variant.Draft === null) return "Draft";
  if ("Pending" in variant && variant.Pending === null) return "Pending";
  if ("Signed" in variant && variant.Signed === null) return "Signed";
  if ("Cancelled" in variant && variant.Cancelled === null) return "Cancelled";
  return "Draft"; // Default
}

/**
 * Convert Agreement from canister format to frontend-friendly format
 */
export interface AgreementUI {
  id: string;
  template_type: string;
  title: string;
  content_hash: string;
  creator: string;
  parties: string[];
  status: AgreementStatus; // String status
  signatures: Signature[];
  created_at: bigint;
  updated_at: bigint;
}

export function convertAgreement(agreement: any): AgreementUI {
  return {
    ...agreement,
    creator: typeof agreement.creator === 'string' ? agreement.creator : agreement.creator.toText(),
    parties: agreement.parties.map((p: any) =>
      typeof p === 'string' ? p : p.toText()
    ),
    signatures: agreement.signatures.map((sig: any) => ({
      ...sig,
      signer: typeof sig.signer === 'string' ? sig.signer : sig.signer.toText(),
    })),
    status: statusVariantToString(agreement.status),
  };
}
