use {
    crate::{
        //error::GameMetadataError,
        instruction::BattleInstruction,
        state::{
            Battle
        },
        utils::{
        //    assert_data_valid, assert_derivation, assert_initialized,
        //    assert_mint_authority_matches_mint, assert_owned_by, assert_signer,
        //    assert_token_program_matches_package, assert_update_authority_is_correct,
        //    create_or_allocate_account_raw, get_owner_from_token_account,
            process_create_battle_accounts_logic, CreateBattleAccountsLogicArgs,
        //    process_mint_new_edition_from_master_edition_via_token_logic, puff_out_data_fields,
        //    transfer_mint_authority,
        //    MintNewEditionFromMasterEditionViaTokenLogicArgs,
        },
    },
    //arrayref::array_ref,
    borsh::{BorshDeserialize/*, BorshSerialize*/},
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
    let instruction = BattleInstruction::try_from_slice(input)?;
    match instruction {
        BattleInstruction::CreateBattle(args) => {
            msg!("Instruction: Create Battle Account");
            
            process_create_battle_accounts(
                program_id,
                accounts,
                args.date,
            )
        }
    }
}

pub fn process_create_battle_accounts<'a>(
    program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
    date: String,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let battle_account_info = next_account_info(account_info_iter)?;
    let game_info = next_account_info(account_info_iter)?;
    let player_account_info = next_account_info(account_info_iter)?;
    let payer_account_info = next_account_info(account_info_iter)?;
    let update_authority_info = next_account_info(account_info_iter)?;
    let system_account_info = next_account_info(account_info_iter)?;
    let rent_info = next_account_info(account_info_iter)?;
    
    process_create_battle_accounts_logic(
        &program_id,
        CreateBattleAccountsLogicArgs {
            battle_account_info,
            game_info,
            player_account_info,
            payer_account_info,
            update_authority_info,
            system_account_info,
            rent_info,
        },
        date,
    )
}