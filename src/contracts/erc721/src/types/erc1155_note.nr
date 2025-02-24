use dep::aztec::{
    context::{PrivateContext, UnconstrainedContext},
    note::note_emission::OuterNoteEmission,
    protocol_types::{address::AztecAddress, constants::MAX_NOTE_HASH_READ_REQUESTS_PER_CALL},
    prelude::{NoteGetterOptions, NoteViewerOptions, PrivateSet}
};

#[partial_note(quote_{token_id})]
pub struct ERC1155Note {
    token_id: Field,
    amount: U128,
    owner: AztecAddress,
    randomness: Field,
}

pub struct BalanceSet<Context> {
    pub set: PrivateSet<ERC1155Note, Context>,
}

impl<Context> BalanceSet<Context> {
    pub fn new(context: Context, storage_slot: Field) -> Self {
        assert(storage_slot != 0, "Storage slot 0 not allowed. Storage slots must start from 1.");
        Self { set: PrivateSet::new(context, storage_slot) }
    }
}

impl BalanceSet<UnconstrainedContext> {
    pub unconstrained fn balance_of(self: Self, token_id: Field) -> U128 {
        self.balance_of_with_offset(0, token_id)
    }

    pub unconstrained fn balance_of_with_offset(self: Self, offset: u32, token_id: Filed) -> U128 {
        let mut balance = U128::from_integer(0);
        
        let mut options = NoteViewerOptions::new();
        let notes = self.set.view_notes(options.set_offset(offset));
        
        for i in 0..options.limit {
            if i < notes.len() {
                balance = balance + notes.get_unchecked(i).get_value();
            }
        }
        if (notes.len() == options.limit) {
            balance = balance + self.balance_of_with_offset(offset + options.limit);
        }

        balance
    }
}