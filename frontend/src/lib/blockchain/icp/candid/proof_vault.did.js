export const idlFactory = ({ IDL }) => {
  const ChainProof = IDL.Record({
    'block_number' : IDL.Opt(IDL.Nat64),
    'timestamp' : IDL.Nat64,
    'chain_name' : IDL.Text,
    'tx_hash' : IDL.Text,
  });
  const ProofMetadata = IDL.Record({
    'creator' : IDL.Principal,
    'signers' : IDL.Vec(IDL.Principal),
    'template_type' : IDL.Text,
    'total_signatures' : IDL.Nat64,
  });
  const NotarizationProof = IDL.Record({
    'id' : IDL.Text,
    'metadata' : ProofMetadata,
    'content_hash' : IDL.Text,
    'chains' : IDL.Vec(ChainProof),
    'agreement_id' : IDL.Text,
    'notarized_at' : IDL.Nat64,
  });
  return IDL.Service({
    'add_chain_proof' : IDL.Func([IDL.Text, ChainProof], [IDL.Bool], []),
    'create_notarization' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Principal), IDL.Principal, IDL.Text],
        [IDL.Text],
        [],
      ),
    'get_all_proofs' : IDL.Func([], [IDL.Vec(NotarizationProof)], ['query']),
    'get_proof' : IDL.Func([IDL.Text], [IDL.Opt(NotarizationProof)], ['query']),
    'get_proof_by_agreement' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(NotarizationProof)],
        ['query'],
      ),
    'verify_proof' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
