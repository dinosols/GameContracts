use {
    crate::{
        state::{/*Creator, */Stats, Move,/*, EDITION, EDITION_MARKER_BIT_SIZE, PREFIX*/},
    },
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        //instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
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
    pub move0: Move,
    pub move1: Move,
    pub move2: Move,
    pub move3: Move,
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
    pub move0: Move,
    pub move1: Move,
    pub move2: Move,
    pub move3: Move,
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