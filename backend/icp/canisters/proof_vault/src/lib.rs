mod storage;
mod types;

use candid::Principal;
use ic_cdk::api::time;
use ic_cdk_macros::{query, update};
use sha2::{Digest, Sha256};
use crate::types::{ChainProof, NotarizationProof, ProofMetadata};

#[update]
fn create_notarization(
    agreement_id: String,
    content_hash: String,
    signers: Vec<Principal>,
    creator: Principal,
    template_type: String,
) -> String {
    let _caller = ic_cdk::caller();
    let now = time();

    // Generate unique proof ID
    let mut hasher = Sha256::new();
    hasher.update(agreement_id.as_bytes());
    hasher.update(content_hash.as_bytes());
    hasher.update(now.to_string().as_bytes());
    let proof_id = format!("{:x}", hasher.finalize());

    // Create ICP chain proof (default)
    let icp_proof = ChainProof {
        chain_name: "ICP".to_string(),
        tx_hash: proof_id.clone(),
        block_number: None,
        timestamp: now,
    };

    let metadata = ProofMetadata {
        signers: signers.clone(),
        total_signatures: signers.len() as u64,
        creator,
        template_type,
    };

    let proof = NotarizationProof {
        id: proof_id.clone(),
        agreement_id,
        content_hash,
        notarized_at: now,
        chains: vec![icp_proof],
        metadata,
    };

    storage::insert_proof(proof_id.clone(), proof);

    proof_id
}

#[update]
fn add_chain_proof(proof_id: String, chain_proof: ChainProof) -> bool {
    let caller = ic_cdk::caller();

    if let Some(mut proof) = storage::get_proof(&proof_id) {
        // Verify caller is creator or signer
        if proof.metadata.creator != caller
            && !proof.metadata.signers.contains(&caller)
        {
            return false;
        }

        // Check if chain proof already exists
        if proof
            .chains
            .iter()
            .any(|cp| cp.chain_name == chain_proof.chain_name)
        {
            return false;
        }

        proof.chains.push(chain_proof);
        storage::insert_proof(proof_id.clone(), proof);
        true
    } else {
        false
    }
}

#[query]
fn get_proof(id: String) -> Option<NotarizationProof> {
    storage::get_proof(&id)
}

#[query]
fn get_proof_by_agreement(agreement_id: String) -> Option<NotarizationProof> {
    storage::get_proof_by_agreement(&agreement_id)
}

#[query]
fn verify_proof(agreement_id: String, content_hash: String) -> bool {
    if let Some(proof) = storage::get_proof_by_agreement(&agreement_id) {
        proof.content_hash == content_hash
    } else {
        false
    }
}

#[query]
fn get_all_proofs() -> Vec<NotarizationProof> {
    storage::get_all_proofs()
}

// Export candid interface
ic_cdk::export_candid!();

