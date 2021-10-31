//! A Game Battle Contract.

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

declare_id!("4RKZfwgWxUz1XEmgPnYkZTSQpzaKGPS9pnGbPTghbZyQ");

