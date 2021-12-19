use {
    borsh::{BorshDeserialize, BorshSerialize},
    //solana_program::{
        //instruction::{AccountMeta, Instruction},
        //pubkey::Pubkey,
        //sysvar,
    //},
    game_metadata::state::{
        Move,
    }
};

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for create call
pub struct CreateBattleAccountArgs {
    pub date: String,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for create call
pub struct JoinBattleAccountArgs {
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for create call
pub struct ChooseTeamMemberArgs {
    pub index: u8,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for create call
pub struct SubmitActionArgs {
    pub cur_move: Move,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for create call
pub struct UpdateArgs {
}

/// Instructions supported by the Metadata program.
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug)]
pub enum BattleInstruction {
    /// Create Battle object.
    ///   0. `[writable]`  Metadata key (pda of ['metadata', program id, mint id])
    ///   1. `[]` Mint of token asset
    ///   2. `[signer]` Player Authority
    ///   3. `[signer]` payer
    ///   4. `[]` update authority info
    ///   5. `[]` System program
    ///   6. `[]` Rent info
    CreateBattle(CreateBattleAccountArgs),
    /// Join the Battle
    ///   0. `[signer]` Player
    ///   1. `[]` Metadata Account
    ///   2. `[signer]` Payer
    JoinBattle(JoinBattleAccountArgs),
    /// Submit Action
    ///   0. `[signer]` Player
    ///   1. `[signer]` Payer
    ChooseTeamMember(ChooseTeamMemberArgs),
    /// Submit Action
    ///   0. `[signer]` Player
    ///   1. `[]` Team Member Metadata
    ///   2. `[signer]` Payer
    SubmitAction(SubmitActionArgs),
    /// Update internal state
    Update(UpdateArgs),
}