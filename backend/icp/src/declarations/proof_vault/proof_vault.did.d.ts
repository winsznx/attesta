import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ChainProof {
  'block_number' : [] | [bigint],
  'timestamp' : bigint,
  'chain_name' : string,
  'tx_hash' : string,
}
export interface NotarizationProof {
  'id' : string,
  'metadata' : ProofMetadata,
  'content_hash' : string,
  'chains' : Array<ChainProof>,
  'agreement_id' : string,
  'notarized_at' : bigint,
}
export interface ProofMetadata {
  'creator' : Principal,
  'signers' : Array<Principal>,
  'template_type' : string,
  'total_signatures' : bigint,
}
export interface _SERVICE {
  'add_chain_proof' : ActorMethod<[string, ChainProof], boolean>,
  'create_notarization' : ActorMethod<
    [string, string, Array<Principal>, Principal, string],
    string
  >,
  'get_all_proofs' : ActorMethod<[], Array<NotarizationProof>>,
  'get_proof' : ActorMethod<[string], [] | [NotarizationProof]>,
  'get_proof_by_agreement' : ActorMethod<[string], [] | [NotarizationProof]>,
  'verify_proof' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
