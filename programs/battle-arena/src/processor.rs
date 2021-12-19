use {
    crate::{
        //error::GameMetadataError,
        instruction::BattleInstruction,
        state::{Battle, Status},
        utils::{
            //    assert_data_valid, assert_derivation, assert_initialized,
            //    assert_mint_authority_matches_mint, assert_owned_by, assert_signer,
            //    assert_token_program_matches_package, assert_update_authority_is_correct,
            //    create_or_allocate_account_raw, get_owner_from_token_account,
            process_create_battle_accounts_logic,
            CreateBattleAccountsLogicArgs,
            //    process_mint_new_edition_from_master_edition_via_token_logic, puff_out_data_fields,
            //    transfer_mint_authority,
            //    MintNewEditionFromMasterEditionViaTokenLogicArgs,
        },
    },
    //arrayref::array_ref,
    borsh::{BorshDeserialize, BorshSerialize},
    game_metadata::state::{GameMetadata, Move}, //spl_token::state::{Account, /*Mint*/},
                                                //solana_sdk::account::Account,
                                                //std::str::FromStr
    solana_program::{
        account_info::{next_account_info, AccountInfo},
        entrypoint::ProgramResult,
        msg,
        program::{invoke, invoke_signed},
        //program_error::ProgramError,
        pubkey::Pubkey,
    },
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

            process_create_battle_accounts(program_id, accounts, args.date)
        }
        BattleInstruction::JoinBattle(_args) => {
            msg!("Instruction: Join the Battle");

            process_join_battle(program_id, accounts)
        }
        BattleInstruction::ChooseTeamMember(args) => {
            msg!("Instruction: Choose Team Member");

            process_choose_team_member(program_id, accounts, args.index)
        }
        BattleInstruction::SubmitAction(args) => {
            msg!("Instruction: Submit Action");

            process_submit_action(program_id, accounts, args.cur_move)
        }
        BattleInstruction::Update(_args) => {
            msg!("Instruction: Update");

            process_update(program_id, accounts)
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
    let _game_info = next_account_info(account_info_iter)?;
    let player_account_info = next_account_info(account_info_iter)?;
    let payer_account_info = next_account_info(account_info_iter)?;
    let update_authority_info = next_account_info(account_info_iter)?;
    let system_account_info = next_account_info(account_info_iter)?;
    let rent_info = next_account_info(account_info_iter)?;
    process_create_battle_accounts_logic(
        &program_id,
        CreateBattleAccountsLogicArgs {
            battle_account_info,
            _game_info,
            player_account_info,
            payer_account_info,
            update_authority_info,
            system_account_info,
            rent_info,
        },
        date,
    )
}

pub fn process_join_battle<'a>(
    _program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let battle_account_info = next_account_info(account_info_iter)?;
    let player_account_info = next_account_info(account_info_iter)?;
    let team_member_0_account_info = next_account_info(account_info_iter)?;
    let team_member_1_account_info = next_account_info(account_info_iter)?;
    let team_member_2_account_info = next_account_info(account_info_iter)?;
    let _payer_account_info = next_account_info(account_info_iter)?;
    let system_account_info = next_account_info(account_info_iter)?;

    let mut battle = Battle::from_account_info(battle_account_info)?;

    if battle.player_1.wallet == *system_account_info.key {
        battle.player_1.wallet = *player_account_info.key;
        battle.player_1.team_member0 = *team_member_0_account_info.key;
        battle.player_1.team_member1 = *team_member_1_account_info.key;
        battle.player_1.team_member2 = *team_member_2_account_info.key;

        msg!("Player 1 has joined the battle!");
    } else if battle.player_2.wallet == *system_account_info.key {
        battle.player_2.wallet = *player_account_info.key;
        battle.player_2.team_member0 = *team_member_0_account_info.key;
        battle.player_2.team_member1 = *team_member_1_account_info.key;
        battle.player_2.team_member2 = *team_member_2_account_info.key;

        msg!("Player 2 has joined the battle!");
        battle.status = Status::Initialized;
    } else {
        msg!("Battle is full!");
    }

    battle.serialize(&mut *battle_account_info.data.borrow_mut())?;

    Ok(())
}

pub fn process_choose_team_member<'a>(
    _program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
    index: u8,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let battle_account_info = next_account_info(account_info_iter)?;
    let player_account_info = next_account_info(account_info_iter)?;
    let _payer_account_info = next_account_info(account_info_iter)?;

    let mut battle = Battle::from_account_info(battle_account_info)?;

    if *player_account_info.key == battle.player_1.wallet {
        msg!("Player 1 chose team member {}", index.to_string());
        battle.player_1.active_team_member = index;
    } else if *player_account_info.key == battle.player_2.wallet {
        msg!("Player 2 chose team member {}", index.to_string());
        battle.player_2.active_team_member = index;
    } else {
        msg!("Invalid player");
    }

    battle.serialize(&mut *battle_account_info.data.borrow_mut())?;

    Ok(())
}

// TODO: This doesn't work for now, CPI privileges need to be fixed.
pub fn process_submit_action<'a>(
    _program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
    cur_move: Move,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let battle_account_info = next_account_info(account_info_iter)?;
    let player_account_info = next_account_info(account_info_iter)?;
    let player_member_account_info = next_account_info(account_info_iter)?;
    let opponent_member_account_info = next_account_info(account_info_iter)?;
    let game_metadata_program_id = next_account_info(account_info_iter)?;
    let payer_account_info = next_account_info(account_info_iter)?;

    let mut battle = Battle::from_account_info(battle_account_info)?;

    msg!("Player Pubkey {}", player_account_info.key.to_string());

    if battle.player_1.wallet == *player_account_info.key {
        msg!(&cur_move.move_name);
        msg!("Player 1's wallet.");
        if battle.player_1.current_move.move_name.replace("\x00", "").is_empty() {
            msg!("Player 1 making a move.");
            battle.player_1.current_move = cur_move.clone();
            battle.status = Status::WaitingForPlayer2;
        } else {
            msg!("Player 1 has already moved.");
            return Ok(());
        }
    } else if battle.player_2.wallet == *player_account_info.key {
        msg!(&cur_move.move_name);
        msg!("Player 2's wallet.");
        if battle.player_2.current_move.move_name.replace("\x00", "").is_empty() {
            msg!("Player 2 making a move.");
            battle.player_2.current_move = cur_move.clone();
            battle.status = Status::WaitingForPlayer1;
        } else {
            msg!("Player 2 has already moved.");
            return Ok(());
        }
    } else {
        msg!("Invalid Player making a move.");
        return Ok(());
    }

    // TODO: Back and forth logic
    // Process the actions if both are complete
    let player_metadata = GameMetadata::from_account_info(&player_member_account_info).unwrap();
    let opponent_metadata = GameMetadata::from_account_info(&opponent_member_account_info).unwrap();

    let mut new_stats = opponent_metadata.curr_stats.clone();

    msg!("Opponent's health went from");
    msg!(&new_stats.health.to_string());
    let attack_damage = player_metadata.curr_stats.attack * cur_move.stats_modifier.attack;
    // Because rounding isn't supported.
    let attack_damage_rounded = (attack_damage as i32) as f32;
    if attack_damage_rounded <= opponent_metadata.curr_stats.health {
        new_stats.health -= attack_damage_rounded;
    } else {
        new_stats.health = 0.0;
    }

    if opponent_metadata.curr_stats.health == 0.0 {
        battle.status = Status::Complete;
    }
    msg!("to");
    msg!(&new_stats.health.to_string());

    msg!("Damage = ");
    msg!(&player_metadata.curr_stats.attack.to_string());
    msg!("x");
    msg!(&cur_move.stats_modifier.attack.to_string());

    msg!(
        "Invoking update_stats_instruction with program_id: {}.",
        &game_metadata_program_id.key.to_string()
    );

    invoke(
        &game_metadata::instruction::update_stats_instruction(
            *game_metadata_program_id.key,
            *opponent_member_account_info.key,
            *payer_account_info.key,
            new_stats,
        ),
        &[
            game_metadata_program_id.clone(),
            opponent_member_account_info.clone(),
            payer_account_info.clone(),
        ],
    )?;

    //player_metadata.serialize(&mut *player_member_account_info.data.borrow_mut())?;
    //opponent_metadata.serialize(&mut *opponent_member_account_info.data.borrow_mut())?;

    if !battle.player_1.current_move.move_name.replace("\x00", "").is_empty() 
        && !battle.player_2.current_move.move_name.replace("\x00", "").is_empty()
    {
        msg!("Both players have moved.");
        battle.player_1.current_move = Move::default();
        battle.player_2.current_move = Move::default();
    }

    let player_metadata_after = GameMetadata::from_account_info(&player_member_account_info).unwrap();
    let opponent_metadata_after = GameMetadata::from_account_info(&opponent_member_account_info).unwrap();

    if player_metadata_after.curr_stats.health == 0.0 || opponent_metadata_after.curr_stats.health == 0.0 {
        battle.status = Status::Complete;
    }

    battle.serialize(&mut *battle_account_info.data.borrow_mut())?;

    Ok(())
}

pub fn process_update<'a>(
    _program_id: &'a Pubkey,
    accounts: &'a [AccountInfo<'a>],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let battle_account_info = next_account_info(account_info_iter)?;
    let player_member_account_info = next_account_info(account_info_iter)?;
    let opponent_member_account_info = next_account_info(account_info_iter)?;
    let player_account_info = next_account_info(account_info_iter)?;

    let mut battle = Battle::from_account_info(battle_account_info)?;
    let player_metadata = GameMetadata::from_account_info(&player_member_account_info).unwrap();
    let opponent_metadata = GameMetadata::from_account_info(&opponent_member_account_info).unwrap();

    if player_metadata.curr_stats.health == 0.0 || opponent_metadata.curr_stats.health == 0.0 {
        battle.status = Status::Complete;
    }

    if battle.player_1.wallet == *player_account_info.key {
        msg!("Player 1 accepting a move.");
        battle.player_2.current_move = Move::default();
    } else if battle.player_2.wallet == *player_account_info.key {
        msg!("Player 2 accepting a move.");
        battle.player_1.current_move = Move::default();
    } else {
        msg!("Invalid Player making a move.");
    }

    battle.status = Status::ExecutingRound;

    battle.round_number += 1;

    battle.serialize(&mut *battle_account_info.data.borrow_mut())?;

    Ok(())
}
