use {
    crate::utils::puffed_out_string,
    //crate::{error::GameMetadataError/*, utils::try_from_slice_checked*/},
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        account_info::AccountInfo, borsh::try_from_slice_unchecked,
        /*entrypoint::ProgramResult, */ program_error::ProgramError, pubkey::Pubkey,
    },
};

/// Prefix used in PDA derivations to avoid collisions with other programs.
pub const PREFIX: &str = "gamemetav1";

pub const MAX_STATS_SIZE: usize =
    4 + //pub health: f32,
    4 + //pub attack: f32,
    4 + //pub defense: f32,
    4 + //pub speed: f32,
    4 + //pub agility: f32,
    4;  //pub rage_points: f32,

pub const MAX_NAME_LENGTH: usize = 24;
pub const MAX_MOVES: usize = 4;
pub const MAX_MOVE_SIZE: usize = 4 +               //string info
    MAX_NAME_LENGTH + //pub move_name: String,
    MAX_STATS_SIZE +  // pub stats_modifier: Stats,
    4 +               // pub move_speed: f32,
    4 +               //pub statusEff: StatusEffect,
    1 +               //pub statusEffChance: u8,
    1 +               //pub damageMod: u8,
    0; //padding

pub const MAX_GAME_METADATA_LEN: usize = 4 +                         //pub schema_version: u32
    32 +                        //pub update_authority: Pubkey,
    32 +                        //pub player_authority: Pubkey,
    32 +                        //pub battle_authority: Pubkey,
    4 +                         //pub experience: u32,
    2 +                         //pub level: u16,
    MAX_STATS_SIZE +            //pub baseStats: Stats,
    MAX_STATS_SIZE +            //pub levelStats: Stats,
    MAX_STATS_SIZE +            //pub currStats: Stats,
    4 +                         //pub status_effect: StatusEffect,
    MAX_MOVE_SIZE * MAX_MOVES + //pub moves: Array<Move>,
    128;

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone, Copy)]
pub enum StatusEffect {
    None,
    // Debuffs
    Irradiated,
    Poisoned,
    Vulnerable,
    // Buffs
    Regenerating,
    Enraged,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone, Copy)]
pub struct Stats {
    pub health: f32,
    pub attack: f32,
    pub defense: f32,
    pub speed: f32,
    pub agility: f32,
    pub rage_points: f32,
}

impl Default for Stats {
    fn default() -> Self {
        Stats {
            health: 0.0,
            attack: 0.0,
            defense: 0.0,
            speed: 0.0,
            agility: 0.0,
            rage_points: 0.0,
        }
    }
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Move {
    pub move_name: String,
    pub stats_modifier: Stats,
    pub move_speed: f32,
    pub status_effect: StatusEffect,
    pub status_effect_chance: u8,
}

impl Default for Move {
    fn default() -> Self {
        Move {
            move_name: puffed_out_string(&String::default(), MAX_NAME_LENGTH),
            stats_modifier: Stats::default(),
            move_speed: 0.0,
            status_effect: StatusEffect::None,
            status_effect_chance: 0,
        }
    }
}

#[repr(C)]
#[derive(Clone, BorshSerialize, BorshDeserialize, Debug)]
pub struct GameMetadata {
    pub schema_version: u32,
    pub update_authority: Pubkey,
    pub player_authority: Pubkey,
    pub battle_authority: Pubkey,
    pub experience: u32,
    pub level: u16,
    pub base_stats: Stats,
    pub level_stats: Stats,
    pub curr_stats: Stats,
    pub status_effect: StatusEffect,
    pub moves: Vec<Move>,
    pub padding: [u8; 128],
}

impl GameMetadata {
    pub fn from_account_info(a: &AccountInfo) -> Result<GameMetadata, ProgramError> {
        let md: GameMetadata = try_from_slice_unchecked(&a.data.borrow_mut())?;

        Ok(md)
    }
}
