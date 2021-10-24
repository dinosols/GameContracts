//! A Game Metadata program for the Solana blockchain.

pub mod entrypoint;
pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;
pub mod test;
pub mod utils;
// Export current sdk types for downstream users building with a different sdk version
pub use solana_program;

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// #[program]
// pub mod game_metadata {
//     use super::*;
//     pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize {}
