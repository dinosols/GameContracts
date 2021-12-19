use {
    crate::{
        state::{
            Stats,
            Move,
            StatusEffect,
        },
    },
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
        msg,
        //sysvar,
    },
};

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for create call
pub struct CreateMetadataAccountArgs {
    /// Note that unique metadatas are disabled for now.
    pub experience: u32,
    pub level: u16,
    pub base_stats: Stats,
    pub level_stats: Stats,
    pub curr_stats: Stats,
    pub status_effect: StatusEffect,
    pub moves: Vec<Move>,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for update call
pub struct UpdateMetadataAccountArgs {
    /// Note that unique metadatas are disabled for now.
    pub update_authority: Pubkey,
    pub base_stats: Stats,
    pub level_stats: Stats,
    pub curr_stats: Stats,
    pub status_effect: StatusEffect,
    pub moves: Vec<Move>,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for awarding experience
pub struct AwardExperienceArgs {
    pub amount: u32,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for updating stats
pub struct UpdateStatsArgs {
    pub new_stats: Stats,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for entering a battle
pub struct EnterBattleArgs {
    pub battle_authority: Pubkey,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for adding a move
pub struct AddMoveArgs {
    pub new_move: Move,
    pub index: Option<u8>,
}

/// Instructions supported by the Metadata program.
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug)]
pub enum GameMetadataInstruction {
    /// Create Metadata object.
    ///   0. `[writable]`  Metadata key (pda of ['metadata', program id, mint id])
    ///   1. `[]` Mint of token asset
    ///   2. `[signer]` Player Authority
    ///   3. `[signer]` payer
    ///   4. `[]` update authority info
    ///   5. `[]` System program
    ///   6. `[]` Rent info
    CreateMetadataAccount(CreateMetadataAccountArgs),
    /// Update a Metadata
    ///   0. `[writable]` Metadata account
    ///   1. `[signer]` Update authority key
    UpdateMetadataAccount(UpdateMetadataAccountArgs),
    /// Award Experience
    ///   0. `[writable]` Metadata account
    ///   1. `[signer]` Battle Authority
    AwardExperience(AwardExperienceArgs),
    ///   0. `[writable]` Metadata account
    ///   1. `[signer]` Battle Authority
    UpdateStats(UpdateStatsArgs),
    ///   0. `[writable]` Metadata account
    ///   1. `[signer]` Battle Authority
    EnterBattle(EnterBattleArgs),
    ///   0. `[writable]` Metadata account
    ///   1. `[signer]` Player Authority
    AddMove(AddMoveArgs),
}

pub fn update_stats_instruction(
    program_id: Pubkey,
    metadata_account: Pubkey,
    payer_account: Pubkey,
    new_stats: Stats,
) -> Instruction {
    msg!("Entering update_stats_instruction");
    let program_account_meta = AccountMeta::new_readonly(program_id, false);
    let metadata_account_meta = AccountMeta::new(metadata_account, false);
    let payer_account_meta = AccountMeta::new_readonly(payer_account, false);
    msg!(&new_stats.health.to_string());

    msg!("Creating Instruction with program_id: {}", &program_id.to_string());
    Instruction {
        program_id,
        accounts: vec![program_account_meta, metadata_account_meta, payer_account_meta],
        data: GameMetadataInstruction::UpdateStats(UpdateStatsArgs{new_stats}).try_to_vec().unwrap(),
    }
}