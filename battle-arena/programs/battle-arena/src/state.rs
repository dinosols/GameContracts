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
pub const PREFIX: &str = "battle";

pub const MAX_DATE_LENGTH: usize = 24;

//pub const MAX_MOVES: usize = 4;
pub const MAX_MOVE_SIZE: usize =
    4 + //pub move_id: MoveID,
    1 + //pub damageMod: u8,
    1 + //pub statusEffChance: u8,
    4 + //pub statusEff: StatusEffect,
    2;  //padding

pub const MAX_PLAYER_SIZE: usize =
    32 +                        //pub wallet: Pubkey,
    32 +                        //pub team_member0: Pubkey,
    32 +                        //pub team_member1: Pubkey,
    32 +                        //pub team_member2: Pubkey,
    MAX_MOVE_SIZE +             //pub current_move: Move,
    1 +                         //pub active_team_member: u8,
    3;                          //padding


pub const MAX_BATTLE_LEN: usize = 
    MAX_DATE_LENGTH +           //pub date: String::with_capacity(24),
    32 +                        //pub update_authority: Pubkey,
    MAX_PLAYER_SIZE +           //pub player1: Player
    MAX_PLAYER_SIZE +           //pub player2: Player
    4 +                         //pub status: Status,
    1 +                         //pub round_number: u8,
    3;                          //padding

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone, Copy)]
pub enum Status {
    None,
    Initialized,
    WaitingForFunds,
    WaitingForPlayer1,
    WaitingForPlayer2,
    ExecutingRound,
    StoringBattle,
    Complete,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct Player {
    pub wallet: Pubkey,
    pub team_member0: Pubkey,
    pub team_member1: Pubkey,
    pub team_member2: Pubkey,
    pub current_move: Move,
    pub active_team_member: u8,

}

impl Default for Player {
    fn default() -> Self {Player{
        wallet: Pubkey::default(),
        team_member0: Pubkey::default(),
        team_member1: Pubkey::default(),
        team_member2: Pubkey::default(),
        current_move: Move::default(),
        active_team_member: 0}}
}

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
pub struct Battle {
    pub date: String,
    pub update_authority: Pubkey,
    pub player_1: Player,
    pub player_2: Player,
    pub status: Status,
    pub round_number: u8
}

impl Battle {
    pub fn from_account_info(a: &AccountInfo) -> Result<Battle, ProgramError> {
        let md: Battle =
            try_from_slice_unchecked(&a.data.borrow_mut())?;

        Ok(md)
    }
}
