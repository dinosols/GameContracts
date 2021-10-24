import { BinaryReader, BinaryWriter } from 'borsh';
import base58 from 'bs58';
import { PublicKey } from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { rustEnum, bool, u8, publicKey, str, vec, option, struct } from '@project-serum/borsh'
import { u16, u32 } from 'buffer-layout';

type StringPublicKey = string;

import BN from 'bn.js';

export class Stats {
  experience: number;
  level: number;

  health: number;
  attack: number;
  defense: number;
  speed: number;
  agility: number;

  constructor(args: {
    experience: number;
    level: number;

    health: number;
    attack: number;
    defense: number;
    speed: number;
    agility: number;
  }) {
    this.experience = args.experience;
    this.level = args.level;

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

export class CreateGameMetadataArgs {
  instruction: number = 0;
  baseStats: Stats;
  currStats: Stats;
  //moves: Array<Move>;
  move0: Move;
  move1: Move;
  move2: Move;
  move3: Move;

  constructor(args: { baseStats: Stats; currStats: Stats; move0: Move; move1: Move; move2: Move; move3: Move; }) {
    this.baseStats = args.baseStats;
    this.currStats = args.currStats;
  //   //this.moves = [...args.moves];
    this.move0 = args.move0;
    this.move1 = args.move1;
    this.move2 = args.move2;
    this.move3 = args.move3;
  }
}

export const GAME_METADATA_SCHEMA = new Map<any, any>([
  [
    CreateGameMetadataArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['baseStats', Stats],
        ['currStats', Stats],
        ['move0', Move],
        ['move1', Move],
        ['move2', Move],
        ['move3', Move],
      ],
    },
  ],
  [
    Stats,
    {
      kind: 'struct',
      fields: [
        ['experience', 'u32'],
        ['level', 'u16'],
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

const STATS_LAYOUT = struct([
  u32('experience'),
  u16('level'),
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

// const MOVES_LAYOUT = struct([
// 	MOVE_LAYOUT.replicate('move0'),
// 	MOVE_LAYOUT.replicate('move1'),
// 	MOVE_LAYOUT.replicate('move2'),
// 	MOVE_LAYOUT.replicate('move3'),
// ])

const METADATA_LAYOUT = struct([
  publicKey('updateAuthority'),
  publicKey('playerAuthority'),
  STATS_LAYOUT.replicate('baseStats'),
  STATS_LAYOUT.replicate('currStats'),
  MOVE_LAYOUT.replicate('move0'),
  MOVE_LAYOUT.replicate('move1'),
  MOVE_LAYOUT.replicate('move2'),
  MOVE_LAYOUT.replicate('move3'),
]);

export interface Metadata {
  updateAuthority: PublicKey;
  playerAuthority: PublicKey;
  baseStats: Stats;
  currStats: Stats;
  move0: Move;
  move1: Move;
  move2: Move;
  move3: Move;
}

// eslint-disable-next-line no-control-regex
const METADATA_REPLACE = new RegExp('\u0000', '');

export function decodeMetadata(buffer: Buffer): Metadata {
  const metadata: any = METADATA_LAYOUT.decode(buffer);
  metadata.updateAuthority = metadata.updateAuthority.toString();
  metadata.playerAuthority = metadata.playerAuthority.toString();
  return metadata;
};