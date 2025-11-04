use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct NotarizationProof {
    pub id: String,
    pub agreement_id: String,
    pub content_hash: String,
    pub notarized_at: u64,
    pub chains: Vec<ChainProof>,
    pub metadata: ProofMetadata,
}

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct ChainProof {
    pub chain_name: String, // "ICP", "Ethereum", "Constellation"
    pub tx_hash: String,
    pub block_number: Option<u64>,
    pub timestamp: u64,
}

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct ProofMetadata {
    pub signers: Vec<Principal>,
    pub total_signatures: u64,
    pub creator: Principal,
    pub template_type: String,
}

impl Storable for NotarizationProof {
    const BOUND: Bound = Bound::Bounded {
        max_size: 8192, // 8KB max per proof
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

// Index for looking up proofs by agreement ID
#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct AgreementProofIndex {
    pub proof_id: String,
}

impl Storable for AgreementProofIndex {
    const BOUND: Bound = Bound::Bounded {
        max_size: 256, // 256 bytes for index
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

