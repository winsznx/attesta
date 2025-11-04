use crate::types::{Agreement, UserAgreementIndex};
use candid::Principal;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

const AGREEMENTS_MEM_ID: MemoryId = MemoryId::new(0);
const USER_INDEX_MEM_ID: MemoryId = MemoryId::new(1);

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static AGREEMENTS: RefCell<StableBTreeMap<String, Agreement, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(AGREEMENTS_MEM_ID))
        )
    );

    static USER_INDEX: RefCell<StableBTreeMap<Principal, UserAgreementIndex, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(USER_INDEX_MEM_ID))
        )
    );
}

pub fn insert_agreement(id: String, agreement: Agreement) {
    AGREEMENTS.with(|a| a.borrow_mut().insert(id, agreement));
}

pub fn get_agreement(id: &str) -> Option<Agreement> {
    AGREEMENTS.with(|a| a.borrow().get(&id.to_string()))
}

pub fn update_agreement(id: String, agreement: Agreement) {
    AGREEMENTS.with(|a| a.borrow_mut().insert(id, agreement));
}

pub fn add_user_agreement_index(user: Principal, agreement_id: String) {
    USER_INDEX.with(|index| {
        let mut borrowed_index = index.borrow_mut();
        let mut user_agreements = borrowed_index
            .get(&user)
            .unwrap_or(UserAgreementIndex {
                agreement_ids: Vec::new(),
            });

        if !user_agreements.agreement_ids.contains(&agreement_id) {
            user_agreements.agreement_ids.push(agreement_id);
            borrowed_index.insert(user, user_agreements);
        }
    });
}

pub fn get_user_agreement_ids(user: &Principal) -> Vec<String> {
    USER_INDEX.with(|index| {
        index
            .borrow()
            .get(user)
            .map(|idx| idx.agreement_ids.clone())
            .unwrap_or_default()
    })
}

pub fn get_all_agreements() -> Vec<Agreement> {
    AGREEMENTS.with(|a| {
        a.borrow()
            .iter()
            .map(|(_, agreement)| agreement)
            .collect()
    })
}
