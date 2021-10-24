use {
    crate::{
        state::{/*Creator, */Stats, Move,/*, EDITION, EDITION_MARKER_BIT_SIZE, PREFIX*/},
    },
    borsh::{BorshDeserialize, BorshSerialize},
    //solana_program::{
        //instruction::{AccountMeta, Instruction},
        //pubkey::Pubkey,
        //sysvar,
    //},
};

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
/// Args for create call
pub struct CreateMetadataAccountArgs {
    /// Note that unique metadatas are disabled for now.
    pub base_stats: Stats,
    pub curr_stats: Stats,
    pub move0: Move,
    pub move1: Move,
    pub move2: Move,
    pub move3: Move,
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
}