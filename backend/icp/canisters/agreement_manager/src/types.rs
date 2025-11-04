use candid::{CandidType, Decode, Encode, Principal};
use ic_stable_structures::storable::Bound;
use ic_stable_structures::Storable;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct Agreement {
    pub id: String,
    pub template_type: String,
    pub title: String,
    pub content_hash: String,
    pub creator: Principal,
    pub parties: Vec<Principal>,
    pub status: AgreementStatus,
    pub signatures: Vec<Signature>,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Clone, Debug, Deserialize, Serialize, PartialEq)]
pub enum AgreementStatus {
    Draft,
    Pending,
    Signed,
    Cancelled,
}

impl ToString for AgreementStatus {
    fn to_string(&self) -> String {
        match self {
            AgreementStatus::Draft => "Draft".to_string(),
            AgreementStatus::Pending => "Pending".to_string(),
            AgreementStatus::Signed => "Signed".to_string(),
            AgreementStatus::Cancelled => "Cancelled".to_string(),
        }
    }
}

impl AgreementStatus {
    pub fn from_string(s: &str) -> Self {
        match s {
            "Draft" => AgreementStatus::Draft,
            "Pending" => AgreementStatus::Pending,
            "Signed" => AgreementStatus::Signed,
            "Cancelled" => AgreementStatus::Cancelled,
            _ => AgreementStatus::Draft,
        }
    }
}

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct Signature {
    pub signer: Principal,
    pub signed_at: u64,
    pub signature_hash: String,
}

#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct UserStats {
    pub total_agreements: u64,
    pub pending_signatures: u64,
    pub signed_agreements: u64,
}

// Implement Storable for Agreement to work with stable structures
impl Storable for Agreement {
    const BOUND: Bound = Bound::Bounded {
        max_size: 10240, // 10KB max per agreement
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

// Helper struct for storing user agreement indices
#[derive(CandidType, Clone, Debug, Deserialize, Serialize)]
pub struct UserAgreementIndex {
    pub agreement_ids: Vec<String>,
}

impl Storable for UserAgreementIndex {
    const BOUND: Bound = Bound::Bounded {
        max_size: 4096, // 4KB for index
        is_fixed_size: false,
    };

    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}
