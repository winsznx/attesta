mod storage;
mod types;

use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use sha2::{Digest, Sha256};
use types::{Agreement, AgreementStatus, Signature, UserStats};

#[update]
fn create_agreement(
    template_type: String,
    title: String,
    content_hash: String,
    parties: Vec<Principal>,
) -> String {
    let caller = ic_cdk::caller();
    let now = time();

    // Generate unique ID using hash
    let mut hasher = Sha256::new();
    hasher.update(caller.as_slice());
    hasher.update(title.as_bytes());
    hasher.update(now.to_string().as_bytes());
    let id = format!("{:x}", hasher.finalize());

    let agreement = Agreement {
        id: id.clone(),
        template_type,
        title,
        content_hash,
        creator: caller,
        parties: parties.clone(),
        status: AgreementStatus::Draft,
        signatures: Vec::new(),
        created_at: now,
        updated_at: now,
    };

    storage::insert_agreement(id.clone(), agreement);

    // Add to creator's index
    storage::add_user_agreement_index(caller, id.clone());

    // Add to all parties' indices
    for party in parties {
        storage::add_user_agreement_index(party, id.clone());
    }

    id
}

#[query]
fn get_agreement(id: String) -> Option<Agreement> {
    storage::get_agreement(&id)
}

#[query]
fn get_user_agreements(user: Principal) -> Vec<Agreement> {
    let agreement_ids = storage::get_user_agreement_ids(&user);
    agreement_ids
        .iter()
        .filter_map(|id| storage::get_agreement(id))
        .collect()
}

#[update]
fn update_status(id: String, status: String) -> bool {
    let caller = ic_cdk::caller();

    if let Some(mut agreement) = storage::get_agreement(&id) {
        // Only creator can update status
        if agreement.creator != caller {
            return false;
        }

        agreement.status = AgreementStatus::from_string(&status);
        agreement.updated_at = time();

        storage::update_agreement(id, agreement);
        true
    } else {
        false
    }
}

#[update]
fn sign_agreement(id: String) -> bool {
    let caller = ic_cdk::caller();

    if let Some(mut agreement) = storage::get_agreement(&id) {
        // Check if caller is a party
        if !agreement.parties.contains(&caller) {
            return false;
        }

        // Check if already signed
        if agreement.signatures.iter().any(|s| s.signer == caller) {
            return false;
        }

        // Add signature
        let signature = Signature {
            signer: caller,
            signed_at: time(),
            signature_hash: format!("{:x}", Sha256::digest(caller.as_slice())),
        };

        agreement.signatures.push(signature);
        agreement.updated_at = time();

        // Update status if all parties signed
        if agreement.signatures.len() == agreement.parties.len() {
            agreement.status = AgreementStatus::Signed;
        } else {
            agreement.status = AgreementStatus::Pending;
        }

        storage::update_agreement(id, agreement);
        true
    } else {
        false
    }
}

#[query]
fn get_user_stats(user: Principal) -> UserStats {
    let agreements = get_user_agreements(user);

    let total_agreements = agreements.len() as u64;
    let pending_signatures = agreements
        .iter()
        .filter(|a| a.status == AgreementStatus::Pending)
        .count() as u64;
    let signed_agreements = agreements
        .iter()
        .filter(|a| a.status == AgreementStatus::Signed)
        .count() as u64;

    UserStats {
        total_agreements,
        pending_signatures,
        signed_agreements,
    }
}

// Export candid interface
ic_cdk::export_candid!();
