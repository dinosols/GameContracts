use {
    //crate::{
        //state::{/*Creator, EDITION, EDITION_MARKER_BIT_SIZE, PREFIX*/},
    //},
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        //instruction::{AccountMeta, Instruction},
        //pubkey::Pubkey,
        //sysvar,
    },
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
    ///   1. `[signer]` Payer
    ///   2. `[]` System program
    JoinBattle(JoinBattleAccountArgs),
}