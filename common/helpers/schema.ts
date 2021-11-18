import { BinaryReader, BinaryWriter } from 'borsh';
import base58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { rustEnum, bool, u8, publicKey, str, vec, option, struct } from '@project-serum/borsh'
import { u16, u32 } from 'buffer-layout';

type StringPublicKey = string;

import BN from 'bn.js';

export class Stats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
  agility: number;

  constructor(args: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    agility: number;
  }) {
    this.health = args.health;
    this.attack = args.attack;
    this.defense = args.defense;
    this.speed = args.speed;
    this.agility = args.agility;
  }
}

export class Move {
  move_id: number;
  damage_modifier: number;
  status_effect_chance: number;
  status_effect: number;

  constructor(args: {
    move_id: number;
    damage_modifier: number;
    status_effect_chance: number;
    status_effect: number;
  }) {
    this.move_id = args.move_id;
    this.damage_modifier = args.damage_modifier;
    this.status_effect_chance = args.status_effect_chance;
    this.status_effect = args.status_effect;
  }
}

export class Player {
  wallet: PublicKey;
  team_member0: PublicKey;
  team_member1: PublicKey;
  team_member2: PublicKey;
  current_move: Move;
  active_team_member: u8;

  constructor(args: {
    wallet: PublicKey;
    team_member0: PublicKey;
    team_member1: PublicKey;
    team_member2: PublicKey;
    current_move: Move;
    active_team_member: u8;
  }) {
    this.wallet = args.wallet;
    this.team_member0 = args.team_member0;
    this.team_member1 = args.team_member1;
    this.team_member2 = args.team_member2;
    this.current_move = args.current_move;
    this.active_team_member = args.active_team_member;
  }
}

export class CreateGameMetadataArgs {
  instruction: number = 0;
  experience: number;
  level: number;
  baseStats: Stats;
  levelStats: Stats;
  currStats: Stats;
  //moves: Array<Move>;
  move0: Move;
  move1: Move;
  move2: Move;
  move3: Move;

  constructor(args: { experience: number; level: number; baseStats: Stats; levelStats: Stats; currStats: Stats; move0: Move; move1: Move; move2: Move; move3: Move; }) {
    this.experience = args.experience;
    this.level = args.level;
    this.baseStats = args.baseStats;
    this.levelStats = args.levelStats;
    this.currStats = args.currStats;
  //   //this.moves = [...args.moves];
    this.move0 = args.move0;
    this.move1 = args.move1;
    this.move2 = args.move2;
    this.move3 = args.move3;
  }
}

export class EnterBattleArgs {
  instruction: number = 4;
  battle_authority: StringPublicKey;

  constructor(args: {battle_authority: string}) {
    this.battle_authority = args.battle_authority;
  }
}

export class CreateBattleArgs {
  instruction: number = 0;
  date: String;

  constructor(args: { date: String; }) {
    this.date = args.date;
  }
}

export class JoinBattleArgs {
  instruction: number = 1;

  constructor(args: {}) {
  }
}

export class ChooseTeamMemberArgs {
  instruction: number = 2;
  index: u8;

  constructor(args: {index: u8}){
    this.index = args.index;
  }
}

export class SubmitActionArgs {
  instruction: number = 3;
  move: Move;

  constructor(args: {move: Move}){
    this.move = args.move;
  }
}

export class UpdateArgs {
  instruction: number = 4;

  constructor(args: {}){
    
  }
}

export class UpdateStatsArgs {
  instruction: number = 3;
  stats: Stats;

  constructor(args: {stats: Stats}){
    this.stats = args.stats;
  }
}

export const GAME_METADATA_SCHEMA = new Map<any, any>([
  [
    CreateGameMetadataArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['experience', 'u32'],
        ['level', 'u16'],
        ['baseStats', Stats],
        ['levelStats', Stats],
        ['currStats', Stats],
        ['move0', Move],
        ['move1', Move],
        ['move2', Move],
        ['move3', Move],
      ],
    },
  ],
  [
    UpdateStatsArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['stats', Stats],
      ],
    },
  ],
  [
    EnterBattleArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['battle_authority', 'pubkeyAsString']
      ],
    },
  ],
  [
    Stats,
    {
      kind: 'struct',
      fields: [
        ['health', 'u16'],
        ['attack', 'u16'],
        ['defense', 'u16'],
        ['speed', 'u16'],
        ['agility', 'u16']
      ],
    },
  ],
  [
    Move,
    {
      kind: 'struct',
      fields: [
        ['move_id', 'u8'],
        ['damage_modifier', 'u8'],
        ['status_effect_chance', 'u8'],
        ['status_effect', 'u8']
      ],
    },
  ],
]);

export const BATTLE_SCHEMA = new Map<any, any>([
  [
    CreateBattleArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['date', 'string'],
      ],
    },
  ],
  [
    JoinBattleArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
      ],
    },
  ],
  [
    ChooseTeamMemberArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['index', 'u8'],
      ]
    },
  ],
  [
    SubmitActionArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['move', Move],
      ],
    }
  ],
  [
    UpdateArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
      ],
    }
  ],
  [
    Move,
    {
      kind: 'struct',
      fields: [
        ['move_id', 'u8'],
        ['damage_modifier', 'u8'],
        ['status_effect_chance', 'u8'],
        ['status_effect', 'u8']
      ],
    },
  ],
]);

const STATS_LAYOUT = struct([
  u16('health'),
  u16('attack'),
  u16('defense'),
  u16('speed'),
  u16('agility'),
])

const MOVE_LAYOUT = struct([
  u8('move_id'),
  u8('damage_modifier'),
  u8('status_effect_chance'),
  u8('status_effect'),
])

const PLAYER_LAYOUT = struct([
  publicKey('wallet'),
  publicKey('team_member0'),
  publicKey('team_member1'),
  publicKey('team_member2'),
  MOVE_LAYOUT.replicate('current_move'),
  u8('active_team_member'),
])

const METADATA_LAYOUT = struct([
  publicKey('updateAuthority'),
  publicKey('playerAuthority'),
  publicKey('battleAuthority'),
  u32('experience'),
  u16('level'),
  STATS_LAYOUT.replicate('baseStats'),
  STATS_LAYOUT.replicate('levelStats'),
  STATS_LAYOUT.replicate('currStats'),
  //u16('padding'),
  MOVE_LAYOUT.replicate('move0'),
  MOVE_LAYOUT.replicate('move1'),
  MOVE_LAYOUT.replicate('move2'),
  MOVE_LAYOUT.replicate('move3'),
]);

export interface Metadata {
  updateAuthority: PublicKey;
  playerAuthority: PublicKey;
  battleAuthority: PublicKey;
  experience: number;
  level: number;
  baseStats: Stats;
  levelStats: Stats;
  currStats: Stats;
  move0: Move;
  move1: Move;
  move2: Move;
  move3: Move;
}

const BATTLE_LAYOUT = struct([
  str('date'),
  publicKey('updateAuthority'),
  PLAYER_LAYOUT.replicate("player_1"),
  PLAYER_LAYOUT.replicate("player_2"),
  u8("status"),
  u8('roundNumber'),
]);

export interface Battle {
  date: String;
  updateAuthority: PublicKey;
  player_1: Player;
  player_2: Player;
  status: u8;
  round_number: u8;
}

// eslint-disable-next-line no-control-regex
const METADATA_REPLACE = new RegExp('\u0000', '');

export function decodeMetadata(buffer: Buffer): Metadata {
  const metadata: any = METADATA_LAYOUT.decode(buffer);
  metadata.updateAuthority = metadata.updateAuthority.toString();
  metadata.playerAuthority = metadata.playerAuthority.toString();
  metadata.battleAuthority = metadata.battleAuthority.toString();
  return metadata;
};

// eslint-disable-next-line no-control-regex
const BATTLE_REPLACE = new RegExp('\u0000', 'g');

export function decodeBattle(buffer: Buffer): Battle {
  const battle: Battle = BATTLE_LAYOUT.decode(buffer);
  battle.date = battle.date.replace(BATTLE_REPLACE, '');
  // battle.updateAuthority = battle.updateAuthority;
  // battle.player1.wallet = battle.player1.wallet;
  // battle.player1.teamMember0 = battle.player1.teamMember0;
  // battle.player1.teamMember1 = battle.player1.teamMember1;
  // battle.player1.teamMember2 = battle.player1.teamMember2;
  // battle.player2.wallet = battle.player2.wallet;
  // battle.player2.teamMember0 = battle.player2.teamMember0;
  // battle.player2.teamMember1 = battle.player2.teamMember1;
  // battle.player2.teamMember2 = battle.player2.teamMember2;
  battle.date = battle.date.replace(BATTLE_REPLACE, '');
  return battle;
};

export const extendBorsh = () => {
  (BinaryReader.prototype as any).readPubkey = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  (BinaryWriter.prototype as any).writePubkey = function (value: PublicKey) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(value.toBuffer());
  };

  (BinaryReader.prototype as any).readPubkeyAsString = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return base58.encode(array) as StringPublicKey;
  };

  (BinaryWriter.prototype as any).writePubkeyAsString = function (
    value: StringPublicKey,
  ) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(base58.decode(value));
  };
};

extendBorsh();