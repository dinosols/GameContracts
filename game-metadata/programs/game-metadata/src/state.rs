use {
    //crate::{error::GameMetadataError/*, utils::try_from_slice_checked*/},
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        account_info::AccountInfo, /*entrypoint::ProgramResult, */program_error::ProgramError,
        pubkey::Pubkey,
        borsh::try_from_slice_unchecked,
    },
};

/// Prefix used in PDA derivations to avoid collisions with other programs.
pub const PREFIX: &str = "gamemeta";

pub const MAX_STATS_SIZE: usize = 
    4 + //pub experience: u32,
    2 + //pub level: u16,

    2 + //pub health: u16,
    2 + //pub attack: u16,
    2 + //pub defense: u16,
    2 + //pub speed: u16,
    2;  //pub agility: u16,

//pub const MAX_MOVES: usize = 4;
pub const MAX_MOVE_SIZE: usize =
    4 + //pub move_id: MoveID,
    1 + //pub damageMod: u8,
    1 + //pub statusEffChance: u8,
    4 + //pub statusEff: StatusEffect,
    2;  //padding


pub const MAX_GAME_METADATA_LEN: usize = 
    32 +                        //pub update_authority: Pubkey,
    32 +                        //pub player_authority: Pubkey,
    MAX_STATS_SIZE +            //pub baseStats: Stats,
    MAX_STATS_SIZE +            //pub currStats: Stats,
    MAX_MOVE_SIZE + // * MAX_MOVES + //pub moves: Array<Move>,
    MAX_MOVE_SIZE +
    MAX_MOVE_SIZE + 
    MAX_MOVE_SIZE +
    0; //padding


#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone, Copy)]
pub enum StatusEffect {
    None,
    Irradiated,
    Poisoned,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone, Copy)]
pub enum MoveID {
    None,
    // Raptor
    Slash,
    BiteRaptor,
    PackHunt,
    // T. rex
    BiteTrex,
    Crush,
    GroupTear, 
    // Pterodactyl
    Claw,
    Drop,
    Swarm ,
    // Triceratops
    Stab,
    Charge,
    HerdDefense,
    // All
    Laser,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Stats {
    pub experience: u32,
    pub level: u16,

    pub health: u16,
    pub attack: u16,
    pub defense: u16,
    pub speed: u16,
    pub agility: u16,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Copy, Clone)]
pub struct Move {
    pub move_id: MoveID,
    pub damage_modifier: u8,
    pub status_effect_chance: u8,
    pub status_effect: StatusEffect,
}

impl Default for Move {
    fn default() -> Self {Move{move_id: MoveID::None, damage_modifier: 1, status_effect_chance: 0, status_effect: StatusEffect::None}}
}

#[repr(C)]
#[derive(Clone, BorshSerialize, BorshDeserialize, Debug)]
pub struct GameMetadata {
    pub update_authority: Pubkey,
    pub player_authority: Pubkey,
    pub base_stats: Stats,
    pub curr_stats: Stats,
    pub move0: Move,
    pub move1: Move,
    pub move2: Move,
    pub move3: Move,
}

impl GameMetadata {
    pub fn from_account_info(a: &AccountInfo) -> Result<GameMetadata, ProgramError> {
        let md: GameMetadata =
            try_from_slice_unchecked(&a.data.borrow_mut())?;

        Ok(md)
    }
}
