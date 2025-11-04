use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    DefaultMemoryImpl, StableBTreeMap,
};
use std::cell::RefCell;
use crate::types::{AgreementProofIndex, NotarizationProof};

const PROOF_MEMORY_ID: MemoryId = MemoryId::new(0);
const INDEX_MEMORY_ID: MemoryId = MemoryId::new(1);

type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static PROOF_STORAGE: RefCell<StableBTreeMap<String, NotarizationProof, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(PROOF_MEMORY_ID)),
        )
    );

    static AGREEMENT_INDEX: RefCell<StableBTreeMap<String, AgreementProofIndex, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(INDEX_MEMORY_ID)),
        )
    );
}

pub fn insert_proof(id: String, proof: NotarizationProof) {
    // Save agreement ID before moving proof
    let agreement_id = proof.agreement_id.clone();

    PROOF_STORAGE.with(|storage| {
        storage.borrow_mut().insert(id.clone(), proof);
    });

    // Index by agreement ID
    let index = AgreementProofIndex { proof_id: id };
    AGREEMENT_INDEX.with(|index_storage| {
        index_storage
            .borrow_mut()
            .insert(agreement_id, index);
    });
}

pub fn get_proof(id: &str) -> Option<NotarizationProof> {
    PROOF_STORAGE.with(|storage| storage.borrow().get(&id.to_string()))
}

pub fn get_proof_by_agreement(agreement_id: &str) -> Option<NotarizationProof> {
    let proof_id = AGREEMENT_INDEX.with(|index_storage| {
        index_storage
            .borrow()
            .get(&agreement_id.to_string())
            .map(|index| index.proof_id)
    })?;

    get_proof(&proof_id)
}

pub fn get_all_proofs() -> Vec<NotarizationProof> {
    PROOF_STORAGE.with(|storage| {
        storage
            .borrow()
            .iter()
            .map(|(_, proof)| proof)
            .collect()
    })
}

