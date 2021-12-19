import { BinaryReader, BinaryWriter } from 'borsh';
import base58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { rustEnum, bool, u8, publicKey, str, vec, option, struct, array } from '@project-serum/borsh'
import { u16, u32, f32 } from 'buffer-layout';

type StringPublicKey = string;
type Float32 = number;

import BN from 'bn.js';

// Converts number into a 64-bit binary using its IEEE764 Representation, little endian
function convertFloat32ToBinary(num: Float32): Uint8Array {
  const c = new Uint8Array(new Float32Array([num]).buffer, 0, 4);
  return c;
}

// Converts number into a 64-bit binary using its IEEE764 Representation, little endian
function convertBinaryToFloat32(num: Uint8Array): Float32 {
  const c = Float32Array.from(num)[0];
  return c;
}

export class Stats {
  health: Float32;
  attack: Float32;
  defense: Float32;
  speed: Float32;
  agility: Float32;
  rage_points: Float32;

  constructor(args: {
    health: number;
    attack: number;
    defense: number;
    speed: number;
    agility: number;
    rage_points: number;
  }) {
    this.health = args.health;
    this.attack = args.attack;
    this.defense = args.defense;
    this.speed = args.speed;
    this.agility = args.agility;
    this.rage_points = args.rage_points;
  }
}

export class Move {
  move_name: string;
  stats_modifier: Stats;
  move_speed: Float32;
  status_effect: number;
  status_effect_chance: number;

  constructor(args: {
    move_name: string;
    stats_modifier: Stats,
    move_speed: number,
    status_effect: number;
    status_effect_chance: number;
  }) {
    this.move_name = args.move_name;
    this.stats_modifier = new Stats(args.stats_modifier);
    this.move_speed = args.move_speed;
    this.status_effect = args.status_effect;
    this.status_effect_chance = args.status_effect_chance;
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
  status_effect: number;
  moves: Array<Move>;

  constructor(args: { experience: number; level: number; baseStats: Stats; levelStats: Stats; currStats: Stats; status_effect: number, moves: Array<Move>;}) {
    this.experience = args.experience;
    this.level = args.level;
    this.baseStats = args.baseStats;
    this.levelStats = args.levelStats;
    this.currStats = args.currStats;
    this.status_effect = args.status_effect;
    this.moves = [...args.moves];
  }
}

export class EnterBattleArgs {
  instruction: number = 4;
  battle_authority: StringPublicKey;

  constructor(args: { battle_authority: string }) {
    this.battle_authority = args.battle_authority;
  }
}

export class CreateBattleArgs {
  instruction: number = 0;
  date: string;

  constructor(args: { date: string; }) {
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

  constructor(args: { index: u8 }) {
    this.index = args.index;
  }
}

export class SubmitActionArgs {
  instruction: number = 3;
  move: Move;

  constructor(args: { move: Move }) {
    this.move = args.move;
  }
}

export class UpdateArgs {
  instruction: number = 4;

  constructor(args: {}) {

  }
}

export class UpdateStatsArgs {
  instruction: number = 3;
  stats: Stats;

  constructor(args: { stats: Stats }) {
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
        ['status_effect', 'u8'],
        ['moves', [Move]],
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
        ['health', 'Float32'],
        ['attack', 'Float32'],
        ['defense', 'Float32'],
        ['speed', 'Float32'],
        ['agility', 'Float32'],
        ['rage_points', 'Float32']
      ],
    },
  ],
  [
    Move,
    {
      kind: 'struct',
      fields: [
        ['move_name', 'string'],
        ['stats_modifier', Stats],
        ['move_speed', 'Float32'],
        ['status_effect', 'u8'],
        ['status_effect_chance', 'u8'],
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
    Stats,
    {
      kind: 'struct',
      fields: [
        ['health', 'Float32'],
        ['attack', 'Float32'],
        ['defense', 'Float32'],
        ['speed', 'Float32'],
        ['agility', 'Float32'],
        ['rage_points', 'Float32']
      ],
    },
  ],
  [
    Move,
    {
      kind: 'struct',
      fields: [
        ['move_name', 'string'],
        ['stats_modifier', Stats],
        ['move_speed', 'Float32'],
        ['status_effect', 'u8'],
        ['status_effect_chance', 'u8'],
      ],
    },
  ],
]);

const STATS_LAYOUT = struct([
  f32('health'),
  f32('attack'),
  f32('defense'),
  f32('speed'),
  f32('agility'),
  f32('rage_points'),
])

const MOVE_LAYOUT = struct([
  str('move_name'),
  STATS_LAYOUT.replicate('stats_modifier'),
  f32('move_speed'),
  u8('status_effect'),
  u8('status_effect_chance'),
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
  u32('schemaVersion'),
  publicKey('updateAuthority'),
  publicKey('playerAuthority'),
  publicKey('battleAuthority'),
  u32('experience'),
  u16('level'),
  STATS_LAYOUT.replicate('baseStats'),
  STATS_LAYOUT.replicate('levelStats'),
  STATS_LAYOUT.replicate('currStats'),
  u8('status_effect'),
  vec(MOVE_LAYOUT.replicate('moves'), 'moves'),
  array(u8(), 128, 'padding'),
]);

export interface Metadata {
  schema_version: number;
  updateAuthority: PublicKey;
  playerAuthority: PublicKey;
  battleAuthority: PublicKey;
  experience: number;
  level: number;
  baseStats: Stats;
  levelStats: Stats;
  currStats: Stats;
  status_effect: number;
  moves: Array<Move>;
  padding: Array<number>;
}

const BATTLE_LAYOUT = struct([
  u32('schemaVersion'),
  str('date'),
  publicKey('updateAuthority'),
  PLAYER_LAYOUT.replicate("player_1"),
  PLAYER_LAYOUT.replicate("player_2"),
  u8("status"),
  u8('roundNumber'),
  array(u8(), 128, 'padding'),
]);

export interface Battle {
  schema_version: number,
  date: string;
  updateAuthority: PublicKey;
  player_1: Player;
  player_2: Player;
  status: u8;
  round_number: u8;
}

// eslint-disable-next-line no-control-regex
const METADATA_REPLACE = new RegExp('\u0000', 'g');

export function decodeMetadata(buffer: Buffer): Metadata {
  const metadata: any = METADATA_LAYOUT.decode(buffer);
  metadata.updateAuthority = metadata.updateAuthority.toString();
  metadata.playerAuthority = metadata.playerAuthority.toString();
  metadata.battleAuthority = metadata.battleAuthority.toString();
  for (let i = 0; i < metadata.moves.length; i++) {
    metadata.moves[i].move_name = metadata.moves[i].move_name.replace(METADATA_REPLACE, '');
  }
  metadata.padding = [];
  return metadata;
};

// eslint-disable-next-line no-control-regex
const BATTLE_REPLACE = new RegExp('\u0000', 'g');

export function decodeBattle(buffer: Buffer): Battle {
  const battle: Battle = BATTLE_LAYOUT.decode(buffer);
  battle.date = battle.date.replace(BATTLE_REPLACE, '');
  battle.date = battle.date.replace(BATTLE_REPLACE, '');
  battle.player_1.current_move.move_name = battle.player_1.current_move.move_name.replace(BATTLE_REPLACE, '');
  battle.player_2.current_move.move_name = battle.player_2.current_move.move_name.replace(BATTLE_REPLACE, '');
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

  (BinaryReader.prototype as any).readFloat32 = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(4);
    return convertBinaryToFloat32(array) as Float32;
  };

  (BinaryWriter.prototype as any).writeFloat32 = function (
    value: Float32,
  ) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(convertFloat32ToBinary(value));
  };
};

extendBorsh();