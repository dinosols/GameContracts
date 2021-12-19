use {
    crate::{
        //error::GameMetadataError,
        instruction::GameMetadataInstruction,
        instruction::CreateMetadataAccountArgs,
        state::{
            Stats, Move, GameMetadata, StatusEffect,
        },
        utils::{
        //    assert_data_valid, assert_derivation, assert_initialized,
        //    assert_mint_authority_matches_mint, assert_owned_by, assert_signer,
        //    assert_token_program_matches_package, assert_update_authority_is_correct,
        //    create_or_allocate_account_raw, get_owner_from_token_account,
            process_create_game_metadata_accounts_logic, CreateGameMetadataAccountsLogicArgs,
        //    process_mint_new_edition_from_master_edition_via_token_logic, puff_out_data_fields,
        //    transfer_mint_authority,
        //    MintNewEditionFromMasterEditionViaTokenLogicArgs,
        },
    },
    //arrayref::array_ref,
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint::ProgramResult,
        msg,
        //program_error::ProgramError,
        pubkey::Pubkey,
    },
    //spl_token::state::{Account, Mint},
};

pub fn process_instruction<'a>(
    program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
    input: &[u8],
) -> ProgramResult {
    msg!("process_instruction");
    msg!("{:x?}", input);
    let instruction = GameMetadataInstruction::try_from_slice(input)?;
    match instruction {
        GameMetadataInstruction::CreateMetadataAccount(args) => {
            msg!("Instruction: Create Game Metadata Account");
            
            process_create_metadata_accounts(
                program_id,
                accounts,
                args.base_stats,
                args.level_stats,
                args.curr_stats,
                args.moves,
            )
        }

        GameMetadataInstruction::UpdateMetadataAccount(_args) =>
        {
            Ok(())
        }

        GameMetadataInstruction::AwardExperience(_args) =>
        {
            Ok(())
        }

        GameMetadataInstruction::UpdateStats(args) =>
        {
            msg!("Instruction: Update Stats");

            process_update_stats(
                program_id,
                accounts,
                args.new_stats,
            )
        }

        GameMetadataInstruction::EnterBattle(args) =>
        {
            msg!("Instruction: Enter Battle");
            process_enter_battle(
                program_id,
                accounts,
                args.battle_authority,
            )
        }

        GameMetadataInstruction::AddMove(_args) =>
        {
            Ok(())
        }
    }
}

pub fn process_create_metadata_accounts<'a>(
    program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
    base_stats: Stats,
    level_stats: Stats,
    curr_stats: Stats,
    moves: Vec<Move>,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let metadata_account_info = next_account_info(account_info_iter)?;
    let game_info = next_account_info(account_info_iter)?;
    let player_authority_info = next_account_info(account_info_iter)?;
    let payer_account_info = next_account_info(account_info_iter)?;
    let update_authority_info = next_account_info(account_info_iter)?;
    let _battle_authority_info = None;
    let system_account_info = next_account_info(account_info_iter)?;
    let rent_info = next_account_info(account_info_iter)?;
    
    process_create_game_metadata_accounts_logic(
        &program_id,
        CreateGameMetadataAccountsLogicArgs {
            metadata_account_info,
            game_info,
            player_authority_info,
            payer_account_info,
            update_authority_info,
            _battle_authority_info,
            system_account_info,
            rent_info,
        },
        base_stats,
        level_stats,
        curr_stats,
        moves,
    )
}

pub fn process_update_stats<'a>(
    program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
    new_stats: Stats,
) -> ProgramResult {
    msg!("Entering process_update_stats");
    let account_info_iter = &mut accounts.iter();
    let _program_account_info = next_account_info(account_info_iter)?;
    let metadata_account_info = next_account_info(account_info_iter)?;
    let _payer_account_info = next_account_info(account_info_iter)?;

    msg!("Program ID is {} and owner of {} is {}.",
        &program_id.to_string(),
        &metadata_account_info.key.to_string(),
        &metadata_account_info.owner.to_string()
    );

    let mut metadata = GameMetadata::from_account_info(&metadata_account_info).unwrap();
    msg!("Curr Stats: {}", &metadata.curr_stats.health.to_string());
    msg!("New Stats: {}", &new_stats.health.to_string());

    metadata.curr_stats = new_stats.clone();

    metadata.serialize(&mut *metadata_account_info.data.borrow_mut())?;

    Ok(())
}

pub fn process_enter_battle<'a>(
    _program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
    battle_authority: Pubkey,
) -> ProgramResult {
    msg!("New Battle Authority is {}.",
        &battle_authority.to_string(),
    );

    let account_info_iter = &mut accounts.iter();
    let _program_account_info = next_account_info(account_info_iter)?;
    let metadata_account_info = next_account_info(account_info_iter)?;
    let _payer_account_info = next_account_info(account_info_iter)?;

    let mut metadata = GameMetadata::from_account_info(&metadata_account_info).unwrap();
    metadata.battle_authority = battle_authority;
    metadata.serialize(&mut *metadata_account_info.data.borrow_mut())?;

    Ok(())
}