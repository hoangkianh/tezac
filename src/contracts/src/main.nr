// docs:start:imports
mod types;
mod test;

use dep::aztec::macros::aztec;

// Minimal NFT implementation with `AuthWit` support that allows minting in public-only and transfers in both public
// and private.
#[aztec]
pub contract NFT {
    use crate::types::{listing_note::ListingNote, nft_note::NFTNote};
    use dep::authwit::auth::{
        assert_current_call_valid_authwit, assert_current_call_valid_authwit_public,
        compute_authwit_nullifier,
    };
    use dep::aztec::{
        encrypted_logs::log_assembly_strategies::default_aes128::note::encode_and_encrypt_note,
        macros::{
            events::event,
            functions::{initializer, internal, private, public, view},
            storage::storage,
        },
        note::{constants::MAX_NOTES_PER_PAGE, note_interface::{NoteProperties, PartialNote}},
        oracle::random::random,
        prelude::{
            AztecAddress, Map, NoteGetterOptions, NoteViewerOptions, PrivateContext, PrivateSet,
            PublicContext, PublicImmutable, PublicMutable,
        },
        protocol_types::{point::Point, traits::Serialize},
        utils::comparison::Comparator,
    };
    use dep::compressed_string::FieldCompressedString;
    use aztec::protocol_types::traits::ToField;
    use std::meta::derive;
    use dep::token_contract::Token;

    // docs:end:imports

    // TODO(#8467): Rename this to Transfer - calling this NFTTransfer to avoid export conflict with the Transfer event
    // in the Token contract.
    #[derive(Serialize)]
    #[event]
    struct NFTTransfer {
        from: AztecAddress,
        to: AztecAddress,
        token_id: Field,
    }

    // docs:start:storage_struct
    #[storage]
    struct Storage<Context> {
        // The symbol of the NFT
        symbol: PublicImmutable<FieldCompressedString, Context>,
        // The name of the NFT
        name: PublicImmutable<FieldCompressedString, Context>,
        // The admin of the contract
        admin: PublicMutable<AztecAddress, Context>,
        // Addresses that can mint
        minters: Map<AztecAddress, PublicMutable<bool, Context>, Context>,
        // Contains the NFTs owned by each address in private.
        private_nfts: Map<AztecAddress, PrivateSet<NFTNote, Context>, Context>,
        // A map from token ID to a boolean indicating if the NFT exists.
        nft_exists: Map<Field, PublicMutable<bool, Context>, Context>,
        // A map from token ID to the public owner of the NFT.
        public_owners: Map<Field, PublicMutable<AztecAddress, Context>, Context>,
        // The payment token address
        token: PublicImmutable<AztecAddress, Context>,
        // Contains the listings owned by each address in private.
        private_listings: Map<AztecAddress, PrivateSet<ListingNote, Context>, Context>,
    }
    // docs:end:storage_struct

    // docs:start:constructor
    #[public]
    #[initializer]
    fn constructor(admin: AztecAddress, name: str<31>, symbol: str<31>, token: AztecAddress) {
        assert(!admin.is_zero(), "invalid admin");
        assert(!token.is_zero(), "invalid token");
        storage.admin.write(admin);
        storage.minters.at(admin).write(true);
        storage.name.initialize(FieldCompressedString::from_string(name));
        storage.symbol.initialize(FieldCompressedString::from_string(symbol));
        storage.token.initialize(token);
    }
    // docs:end:constructor

    // docs:start:set_admin
    #[public]
    fn set_admin(new_admin: AztecAddress) {
        assert(storage.admin.read().eq(context.msg_sender()), "caller is not an admin");
        storage.admin.write(new_admin);
    }
    // docs:end:set_admin

    // docs:start:set_minter
    #[public]
    fn set_minter(minter: AztecAddress, approve: bool) {
        assert(storage.admin.read().eq(context.msg_sender()), "caller is not an admin");
        storage.minters.at(minter).write(approve);
    }
    // docs:end:set_minter

    // docs:start:mint
    #[public]
    fn mint(to: AztecAddress, token_id: Field) {
        assert(token_id != 0, "zero token ID not supported");
        assert(storage.minters.at(context.msg_sender()).read(), "caller is not a minter");
        assert(storage.nft_exists.at(token_id).read() == false, "token already exists");

        storage.nft_exists.at(token_id).write(true);

        storage.public_owners.at(token_id).write(to);
    }
    // docs:end:mint

    #[public]
    #[view]
    fn public_get_name() -> pub FieldCompressedString {
        storage.name.read()
    }

    #[private]
    #[view]
    fn private_get_name() -> pub FieldCompressedString {
        storage.name.read()
    }

    #[public]
    #[view]
    fn public_get_symbol() -> pub FieldCompressedString {
        storage.symbol.read()
    }

    #[private]
    #[view]
    fn private_get_symbol() -> pub FieldCompressedString {
        storage.symbol.read()
    }

    // docs:start:admin
    #[public]
    #[view]
    fn get_admin() -> Field {
        storage.admin.read().to_field()
    }
    // docs:end:admin

    // docs:start:is_minter
    #[public]
    #[view]
    fn is_minter(minter: AztecAddress) -> bool {
        storage.minters.at(minter).read()
    }
    // docs:end:is_minter

    // docs:start:transfer_in_public
    #[public]
    fn transfer_in_public(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit_public(&mut context, from);
        } else {
            assert(nonce == 0, "invalid nonce");
        }

        let public_owners_storage = storage.public_owners.at(token_id);
        assert(public_owners_storage.read().eq(from), "invalid owner");

        public_owners_storage.write(to);
    }
    // docs:end:transfer_in_public

    // Transfers token with `token_id` from public balance of message sender to a private balance of `to`.
    // docs:start:transfer_to_private
    #[private]
    fn transfer_to_private(to: AztecAddress, token_id: Field) {
        let from = context.msg_sender();

        let nft = NFT::at(context.this_address());

        // We prepare the private balance increase.
        let hiding_point_slot = _prepare_private_balance_increase(to, &mut context, storage);

        // At last we finalize the transfer. Usage of the `unsafe` method here is safe because we set the `from`
        // function argument to a message sender, guaranteeing that he can transfer only his own NFTs.
        nft._finalize_transfer_to_private_unsafe(from, token_id, hiding_point_slot).enqueue(
            &mut context,
        );
    }
    // docs:end:transfer_to_private

    /// Prepares an increase of private balance of `to` (partial note). The increase needs to be finalized by calling
    /// `finalize_transfer_to_private. Returns a hiding point slot.
    // docs:start:prepare_private_balance_increase
    #[private]
    fn prepare_private_balance_increase(to: AztecAddress) -> Field {
        _prepare_private_balance_increase(to, &mut context, storage)
    }

    /// This function exists separately from `prepare_private_balance_increase` solely as an optimization as it allows
    /// us to have it inlined in the `transfer_to_private` function which results in one less kernel iteration.
    ///
    /// TODO(#9180): Consider adding macro support for functions callable both as an entrypoint and as an internal
    /// function.
    #[contract_library_method]
    fn _prepare_private_balance_increase(
        to: AztecAddress,
        context: &mut PrivateContext,
        storage: Storage<&mut PrivateContext>,
    ) -> Field {
        let to_note_slot = storage.private_nfts.at(to).storage_slot;

        // We create a setup payload with unpopulated/zero token id for 'to'
        // TODO(#7775): Manually fetching the randomness here is not great. If we decide to include randomness in all
        // notes we could just inject it in macros.

        // Safety: We use the randomness to preserve the privacy of the note recipient by preventing brute-forcing,
        // so a malicious sender could use non-random values to make the note less private. But they already know
        // the full note pre-image anyway, and so the recipient already trusts them to not disclose this
        // information. We can therefore assume that the sender will cooperate in the random value generation.
        let note_randomness = unsafe { random() };
        let note_setup_payload = NFTNote::setup_payload().new(to, note_randomness, to_note_slot);

        let setup_log = note_setup_payload.encrypt_log(context, to, context.msg_sender());

        // Using the x-coordinate as a hiding point slot is safe against someone else interfering with it because
        // we have a guarantee that the public functions of the transaction are executed right after the private ones
        // and for this reason the protocol guarantees that nobody can front-run us in consuming the hiding point.
        // This guarantee would break if `finalize_transfer_to_private` was not called in the same transaction. This
        // however is not the flow we are currently concerned with. To support the multi-transaction flow we could
        // introduce a `from` function argument, hash the x-coordinate with it and then repeat the hashing in
        // `finalize_transfer_to_private`.
        //
        // We can also be sure that the `hiding_point_slot` will not overwrite any other value in the storage because
        // in our state variables we derive slots using a different hash function from multi scalar multiplication
        // (MSM).
        let hiding_point_slot = note_setup_payload.hiding_point.x;

        // We don't need to perform a check that the value overwritten by `_store_point_in_transient_storage_unsafe`
        // is zero because the slot is the x-coordinate of the hiding point and hence we could only overwrite
        // the value in the slot with the same value. This makes usage of the `unsafe` method safe.
        NFT::at(context.this_address())
            ._store_payload_in_transient_storage_unsafe(
                hiding_point_slot,
                note_setup_payload.hiding_point,
                setup_log,
            )
            .enqueue(context);

        hiding_point_slot
    }
    // docs:end:prepare_private_balance_increase

    // TODO(#9375): Having to define the note log length here is very unfortunate as it's basically impossible for
    // users to derive manually. This will however go away once we have a real transient storage since we will not need
    // the public call and instead we would do something like `context.transient_storage_write(slot, payload)` and that
    // will allow us to use generics and hence user will not need to define it explicitly. We cannot use generics here
    // as it is an entrypoint function.
    // docs:start:store_payload_in_transient_storage_unsafe
    #[public]
    #[internal]
    fn _store_payload_in_transient_storage_unsafe(
        slot: Field,
        point: Point,
        setup_log: [Field; 9],
    ) {
        context.storage_write(slot, point);
        context.storage_write(slot + aztec::protocol_types::point::POINT_LENGTH as Field, setup_log);
    }
    // docs:end:store_payload_in_transient_storage_unsafe
    /// Finalizes a transfer of NFT with `token_id` from public balance of `from` to a private balance of `to`.
    /// The transfer must be prepared by calling `prepare_private_balance_increase` first and the resulting
    /// `hiding_point_slot` must be passed as an argument to this function.
    // docs:start:finalize_transfer_to_private
    #[public]
    fn finalize_transfer_to_private(token_id: Field, hiding_point_slot: Field) {
        let from = context.msg_sender();
        _finalize_transfer_to_private(from, token_id, hiding_point_slot, &mut context, storage);
    }
    // docs:end:finalize_transfer_to_private

    // docs:start:finalize_transfer_to_private_unsafe
    #[public]
    #[internal]
    fn _finalize_transfer_to_private_unsafe(
        from: AztecAddress,
        token_id: Field,
        hiding_point_slot: Field,
    ) {
        _finalize_transfer_to_private(from, token_id, hiding_point_slot, &mut context, storage);
    }
    // docs:end:finalize_transfer_to_private_unsafe

    #[contract_library_method]
    fn _finalize_transfer_to_private(
        from: AztecAddress,
        token_id: Field,
        hiding_point_slot: Field,
        context: &mut PublicContext,
        storage: Storage<&mut PublicContext>,
    ) {
        let public_owners_storage = storage.public_owners.at(token_id);
        assert(public_owners_storage.read().eq(from), "invalid NFT owner");

        // Set the public NFT owner to zero
        public_owners_storage.write(AztecAddress::zero());

        // Finalize the partial note with the `token_id`
        let finalization_payload =
            NFTNote::finalization_payload().new(context, hiding_point_slot, token_id);

        // At last we emit the note hash and the final log
        finalization_payload.emit();
    }

    /**
     * Cancel a private authentication witness.
     * @param inner_hash The inner hash of the authwit to cancel.
     */
    // docs:start:cancel_authwit
    #[private]
    fn cancel_authwit(inner_hash: Field) {
        let on_behalf_of = context.msg_sender();
        let nullifier = compute_authwit_nullifier(on_behalf_of, inner_hash);
        context.push_nullifier(nullifier);
    }
    // docs:end:cancel_authwit

    // docs:start:transfer_in_private
    #[private]
    fn transfer_in_private(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit(&mut context, from);
        } else {
            assert(nonce == 0, "invalid nonce");
        }
        _transfer_in_private(from, to, token_id, &mut context, storage);
    }
    // docs:end:transfer_in_private

    #[contract_library_method]
    fn _transfer_in_private(
        from: AztecAddress,
        to: AztecAddress,
        token_id: Field,
        context: &mut PrivateContext,
        storage: Storage<&mut PrivateContext>,
    ) {
        let nfts = storage.private_nfts;

        let notes = nfts.at(from).pop_notes(NoteGetterOptions::new()
            .select(NFTNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(notes.len() == 1, "NFT not found when transferring");

        let new_note = NFTNote::new(token_id, to);

        nfts.at(to).insert(new_note).emit(encode_and_encrypt_note(context, to, from));
    }

    // docs:start:transfer_to_public
    #[private]
    fn transfer_to_public(from: AztecAddress, to: AztecAddress, token_id: Field, nonce: Field) {
        if (!from.eq(context.msg_sender())) {
            assert_current_call_valid_authwit(&mut context, from);
        } else {
            assert(nonce == 0, "invalid nonce");
        }

        let notes = storage.private_nfts.at(from).pop_notes(NoteGetterOptions::new()
            .select(NFTNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(notes.len() == 1, "NFT not found when transferring to public");

        NFT::at(context.this_address())._finish_transfer_to_public(to, token_id).enqueue(
            &mut context,
        );
    }
    // docs:end:transfer_to_public

    // docs:start:finish_transfer_to_public
    #[public]
    #[internal]
    fn _finish_transfer_to_public(to: AztecAddress, token_id: Field) {
        storage.public_owners.at(token_id).write(to);
    }
    // docs:end:finish_transfer_to_public

    // Returns zero address when the token does not have a public owner. Reverts if the token does not exist.
    #[public]
    #[view]
    fn owner_of(token_id: Field) -> AztecAddress {
        assert(storage.nft_exists.at(token_id).read(), "token does not exist");
        storage.public_owners.at(token_id).read()
    }

    /// Returns an array of token IDs owned by `owner` in private and a flag indicating whether a page limit was
    /// reached. Starts getting the notes from page with index `page_index`. Zero values in the array are placeholder
    /// values for non-existing notes.
    // docs:start:get_private_nfts
    unconstrained fn get_private_nfts(
        owner: AztecAddress,
        page_index: u32,
    ) -> pub ([Field; MAX_NOTES_PER_PAGE], bool) {
        let offset = page_index * MAX_NOTES_PER_PAGE;
        let mut options = NoteViewerOptions::new();
        let notes = storage.private_nfts.at(owner).view_notes(options.set_offset(offset));

        let mut owned_nft_ids = [0; MAX_NOTES_PER_PAGE];
        for i in 0..options.limit {
            if i < notes.len() {
                owned_nft_ids[i] = notes.get_unchecked(i).token_id;
            }
        }

        let page_limit_reached = notes.len() == options.limit;
        (owned_nft_ids, page_limit_reached)
    }
    // docs:end:get_private_nfts

    #[private]
    fn list(token_id: Field, price: u128, buyer: AztecAddress) {
        let from = context.msg_sender();

        let nft_notes = storage.private_nfts.at(from).get_notes(NoteGetterOptions::new()
            .select(NFTNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(nft_notes.len() == 1, "NFT not found when listing");
        assert(price > 0, "invalid price");
        assert(!buyer.is_zero(), "invalid buyer");
        assert(!buyer.eq(from), "buyer equals from");

        let seller_note = ListingNote::new(token_id, from, from, buyer, price);
        storage.private_listings.at(from).insert(seller_note)
            .emit(encode_and_encrypt_note(&mut context, from, from));

        let buyer_note = ListingNote::new(token_id, buyer, from, buyer, price);
        storage.private_listings.at(buyer).insert(buyer_note)
            .emit(encode_and_encrypt_note(&mut context, buyer, from));
    }

    #[private]
    fn cancel_listing(token_id: Field) {
        let from = context.msg_sender();

        let seller_listing_notes = storage.private_listings.at(from).pop_notes(NoteGetterOptions::new()
            .select(ListingNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(seller_listing_notes.len() == 1, "Seller listing not found when cancelling listing");

        let seller_listing_note = seller_listing_notes.get_unchecked(0);

        let buyer_listing_notes = storage.private_listings.at(seller_listing_note.buyer).pop_notes(NoteGetterOptions::new()
            .select(ListingNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(buyer_listing_notes.len() == 1, "Buyer listing not found when cancelling listing");
    }

    #[private]
    fn purchase(token_id: Field, nonce: Field) {
        let from = context.msg_sender();

        let buyer_listing_notes = storage.private_listings.at(from).pop_notes(NoteGetterOptions::new()
            .select(ListingNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(buyer_listing_notes.len() == 1, "Buyer listing not found when purchasing");

        let buyer_listing_note = buyer_listing_notes.get_unchecked(0);

        let seller_listing_notes = storage.private_listings.at(buyer_listing_note.seller).pop_notes(NoteGetterOptions::new()
            .select(ListingNote::properties().token_id, Comparator.EQ, token_id)
            .set_limit(1));
        assert(seller_listing_notes.len() == 1, "Seller listing not found when purchasing");

        let token = Token::at(storage.token.read());
        token.transfer_in_private(buyer_listing_note.buyer, buyer_listing_note.seller, buyer_listing_note.price, nonce).call(
            &mut context,
        );

        _transfer_in_private(buyer_listing_note.seller, buyer_listing_note.buyer, token_id, &mut context, storage);
    }

    /// Returns an array of listings owned by `owner` in private and a flag indicating whether a page limit was
    /// reached. Starts getting the notes from page with index `page_index`. Zero values in the array are placeholder
    /// values for non-existing notes.
    unconstrained pub fn get_private_listings(
        owner: AztecAddress,
        page_index: u32,
    ) -> pub ([ListingNote; MAX_NOTES_PER_PAGE], bool) {
        let offset = page_index * MAX_NOTES_PER_PAGE;
        let mut options = NoteViewerOptions::new();
        let notes = storage.private_listings.at(owner).view_notes(options.set_offset(offset));

        let mut owned_listings = [ListingNote::default(); MAX_NOTES_PER_PAGE];
        for i in 0..options.limit {
            if i < notes.len() {
                owned_listings[i] = notes.get_unchecked(i);
            }
        }

        let page_limit_reached = notes.len() == options.limit;
        (owned_listings, page_limit_reached)
    }
}