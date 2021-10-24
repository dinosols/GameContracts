
use {
    crate::{
        error::GameMetadataError,
        state::{
            Stats, Move, PREFIX, GameMetadata, MAX_GAME_METADATA_LEN,
            //get_reservation_list, Data, EditionMarker, Key, MasterEditionV1, Metadata, EDITION,
            //EDITION_MARKER_BIT_SIZE, MAX_CREATOR_LIMIT, MAX_EDITION_LEN, MAX_EDITION_MARKER_SIZE,
            //MAX_MASTER_EDITION_LEN, MAX_NAME_LENGTH, MAX_SYMBOL_LENGTH,
            //MAX_URI_LENGTH, PREFIX,
        },
    },
    arrayref::{/*array_mut_ref, */array_ref, array_refs/*, mut_array_refs*/},
    borsh::{/*BorshDeserialize, */BorshSerialize},
    solana_program::{
        account_info::AccountInfo,
        //borsh::try_from_slice_unchecked,
        entrypoint::ProgramResult,
        msg,
        program::{invoke, invoke_signed},
        program_error::ProgramError,
        program_option::COption,
        //program_pack::{IsInitialized, Pack},
        pubkey::Pubkey,
        system_instruction,
        sysvar::{rent::Rent, Sysvar},
    },
    //spl_token::{
        //instruction::{set_authority, AuthorityType},
        //state::{Account, Mint},
    //},
    std::convert::TryInto,
};

pub fn assert_data_valid(
    //data: &Data,
    _update_authority: &Pubkey,
    _existing_metadata: &GameMetadata,
    _update_authority_is_signer: bool,
) -> ProgramResult {


    Ok(())
}


pub struct CreateGameMetadataAccountsLogicArgs<'a> {
    pub metadata_account_info: &'a AccountInfo<'a>,
    pub game_info: &'a AccountInfo<'a>,
    pub player_authority_info: &'a AccountInfo<'a>,
    pub payer_account_info: &'a AccountInfo<'a>,
    pub update_authority_info: &'a AccountInfo<'a>,
    pub system_account_info: &'a AccountInfo<'a>,
    pub rent_info: &'a AccountInfo<'a>,
}

pub fn assert_owned_by(account: &AccountInfo, owner: &Pubkey) -> ProgramResult {
    if account.owner != owner {
        Err(GameMetadataError::IncorrectOwner.into())
    } else {
        Ok(())
    }
}

/// Create a new account instruction
pub fn process_create_game_metadata_accounts_logic(
    program_id: &Pubkey,
    accounts: CreateGameMetadataAccountsLogicArgs,
    base_stats: Stats,
    curr_stats: Stats,
    move0: Move,
    move1: Move,
    move2: Move,
    move3: Move,
) -> ProgramResult {
    let CreateGameMetadataAccountsLogicArgs {
        metadata_account_info,
        game_info,
        player_authority_info,
        payer_account_info,
        update_authority_info,
        system_account_info,
        rent_info,
    } = accounts;

    //let player_authority = get_player_authority(game_info)?;
    //assert_player_authority_matches_game(&player_authority, player_authority_info)?;
    //assert_owned_by(game_info, &spl_token::id())?;

    let metadata_seeds = &[
        PREFIX.as_bytes(),
        program_id.as_ref(),
        game_info.key.as_ref(),
    ];
    let (metadata_key, metadata_bump_seed) =
        Pubkey::find_program_address(metadata_seeds, program_id);
    let metadata_authority_signer_seeds = &[
        PREFIX.as_bytes(),
        program_id.as_ref(),
        game_info.key.as_ref(),
        &[metadata_bump_seed],
    ];

    if metadata_account_info.key != &metadata_key {
        return Err(GameMetadataError::InvalidMetadataKey.into());
    }

    create_or_allocate_account_raw(
        *program_id,
        metadata_account_info,
        rent_info,
        system_account_info,
        payer_account_info,
        MAX_GAME_METADATA_LEN,
        metadata_authority_signer_seeds,
    )?;

    let mut metadata = GameMetadata::from_account_info(metadata_account_info)?;
    assert_data_valid(
       //&data,
       update_authority_info.key,
       &metadata,
       update_authority_info.is_signer,
    )?;

    metadata.player_authority = *player_authority_info.key;
    metadata.base_stats = base_stats;
    metadata.curr_stats = curr_stats;
    metadata.move0 = move0;
    metadata.move1 = move1;
    metadata.move2 = move2;
    metadata.move3 = move3;
    metadata.update_authority = *update_authority_info.key;

    //puff_out_data_fields(&mut metadata);

    metadata.serialize(&mut *metadata_account_info.data.borrow_mut())?;

    Ok(())
}

// pub fn try_from_slice_checked<T: BorshDeserialize>(
//     data: &[u8],
//     data_size: usize,
// ) -> Result<T, ProgramError> {
//     if (data[0] != data_type as u8)
//         || data.len() != data_size
//     {
//         return Err(GameMetadataError::DataTypeMismatch.into());
//     }

//     let result: T = try_from_slice_unchecked(data)?;

//     Ok(result)
// }

/// Create account almost from scratch, lifted from
/// https://github.com/solana-labs/solana-program-library/tree/master/associated-token-account/program/src/processor.rs#L51-L98
#[inline(always)]
pub fn create_or_allocate_account_raw<'a>(
    program_id: Pubkey,
    new_account_info: &AccountInfo<'a>,
    rent_sysvar_info: &AccountInfo<'a>,
    system_program_info: &AccountInfo<'a>,
    payer_info: &AccountInfo<'a>,
    size: usize,
    signer_seeds: &[&[u8]],
) -> ProgramResult {
    let rent = &Rent::from_account_info(rent_sysvar_info)?;
    let required_lamports = rent
        .minimum_balance(size)
        .max(1)
        .saturating_sub(new_account_info.lamports());

    if required_lamports > 0 {
        msg!("Transfer {} lamports to the new account", required_lamports);
        invoke(
            &system_instruction::transfer(&payer_info.key, new_account_info.key, required_lamports),
            &[
                payer_info.clone(),
                new_account_info.clone(),
                system_program_info.clone(),
            ],
        )?;
    }

    let accounts = &[new_account_info.clone(), system_program_info.clone()];

    msg!("Allocate space for the account");
    invoke_signed(
        &system_instruction::allocate(new_account_info.key, size.try_into().unwrap()),
        accounts,
        &[&signer_seeds],
    )?;

    msg!("Assign the account to the owning program");
    invoke_signed(
        &system_instruction::assign(new_account_info.key, &program_id),
        accounts,
        &[&signer_seeds],
    )?;

    Ok(())
}

/// Unpacks COption from a slice, taken from token program
fn unpack_coption_key(src: &[u8; 36]) -> Result<COption<Pubkey>, ProgramError> {
    let (tag, body) = array_refs![src, 4, 32];
    match *tag {
        [0, 0, 0, 0] => Ok(COption::None),
        [1, 0, 0, 0] => Ok(COption::Some(Pubkey::new_from_array(*body))),
        _ => Err(ProgramError::InvalidAccountData),
    }
}

pub fn get_player_authority(account_info: &AccountInfo) -> Result<COption<Pubkey>, ProgramError> {
    // In token program, 36, 8, 1, 1 is the layout, where the first 36 is mint_authority
    // so we start at 0.
    let data = account_info.try_borrow_data().unwrap();
    let authority_bytes = array_ref![data, 0, 36];

    Ok(unpack_coption_key(&authority_bytes)?)
}

pub fn assert_player_authority_matches_game(
    player_authority: &COption<Pubkey>,
    player_authority_info: &AccountInfo,
) -> ProgramResult {
    match player_authority {
        COption::None => {
            return Err(GameMetadataError::InvalidPlayerAuthority.into());
        }
        COption::Some(key) => {
            if player_authority_info.key != key {
                return Err(GameMetadataError::InvalidPlayerAuthority.into());
            }
        }
    }

    if !player_authority_info.is_signer {
        return Err(GameMetadataError::NotPlayerAuthority.into());
    }

    Ok(())
}