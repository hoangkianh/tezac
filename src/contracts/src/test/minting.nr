use crate::NFT;
use crate::test::utils;

#[test]
unconstrained fn public_mint_success() {
    let (env, nft_contract_address, owner, _) = utils::setup(false);

    let token_id = 10000;
    NFT::at(nft_contract_address).mint(owner, token_id).call(&mut env.public());

    env.advance_block_by(1);

    utils::assert_owns_public_nft(env, nft_contract_address, owner, token_id);
}

#[test]
unconstrained fn public_mint_failures() {
    let (env, nft_contract_address, owner, recipient) = utils::setup(false);

    let token_id = 10000;
    env.impersonate(recipient);
    let mint_call_interface = NFT::at(nft_contract_address).mint(owner, token_id);

    // MINTING THE SAME NFT TWICE
    env.impersonate(owner);
    mint_call_interface.call(&mut env.public());
    assert(utils::get_nft_exists(nft_contract_address, token_id), "NFT not minted");

    // Second call should fail
    env.assert_public_call_fails(mint_call_interface);

    // MINTING NFT WITH TOKEN ID 0
    let mint_call_interface = NFT::at(nft_contract_address).mint(owner, 0);
    env.assert_public_call_fails(mint_call_interface);
}

#[test]
unconstrained fn private_mint_success() {
    let (env, nft_contract_address, owner, recipient) = utils::setup(false);

    let token_id = 10000;
    NFT::at(nft_contract_address).private_mint(owner, token_id).call(&mut env.private());

    env.advance_block_by(1);

    utils::assert_owns_private_nft(nft_contract_address, owner, token_id);
}

#[test]
unconstrained fn private_mint_failures() {
    let (env, nft_contract_address, owner, recipient) = utils::setup(false);
    
    let token_id = 10000;
    let mint_call_interface = NFT::at(nft_contract_address).private_mint(owner, token_id);

    // MINTING THE SAME NFT TWICE
    mint_call_interface.call(&mut env.private());
    utils::assert_owns_private_nft(nft_contract_address, owner, token_id);

    // Second call should fail
    env.assert_private_call_fails(mint_call_interface);

    // MINTING NFT WITH TOKEN ID 0
    let mint_call_interface = NFT::at(nft_contract_address).private_mint(owner, 0);
    env.assert_private_call_fails(mint_call_interface);
}