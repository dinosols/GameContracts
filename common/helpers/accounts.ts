import { Keypair, PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createGameMetadataInstruction,
} from './instructions';
import { sendTransactionWithRetryWithKeypair } from './transactions';
import {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  //TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './constants';
import {
  Stats,
  Move,
  JoinBattleArgs,
  CreateBattleArgs,
  BATTLE_SCHEMA,
  decodeBattle,
  CreateGameMetadataArgs,
  GAME_METADATA_SCHEMA,
} from './schema';
import { MintLayout, Token } from '@solana/spl-token';
// import { GameMetadataInfo, GameMetadataLayout, } from './schema';
import * as anchor from '@project-serum/anchor';
import fs from 'fs';
import BN from 'bn.js';
//import { createConfigAccount } from './instructions';
import { web3, Provider } from '@project-serum/anchor';
import log from 'loglevel';

export const getTokenWallet = async function (
  wallet: PublicKey,
  mint: PublicKey,
) {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    )
  )[0];
};

export const getMetadataPDA = async (
  mint: anchor.web3.PublicKey,
  token_game_metadata_program_id,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('gamemetav1'),
        token_game_metadata_program_id.toBuffer(),
        mint.toBuffer(),
      ],
      token_game_metadata_program_id,
    )
  )[0];
};

export const getBattlePDA = async (
  player: anchor.web3.PublicKey,
  battle_program_id,
  dateString: String,
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('battlev1'),
        battle_program_id.toBuffer(),
        player.toBuffer(),
        Buffer.from(dateString),
      ],
      battle_program_id,
    )
  )[0];
};

// @ts-ignore
export async function mintToken(provider: anchor.Provider, mintOwner: anchor.web3.Keypair) {
  let instructions: TransactionInstruction[] = [];
  // @ts-ignore
  var signers: anchor.web3.Keypair[];

  const mintRent = await provider.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );

  // Generate a mint
  let mint = anchor.web3.Keypair.generate();

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: mintOwner.publicKey,
      newAccountPubkey: mint.publicKey,
      lamports: mintRent,
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID,
    })
  );
  instructions.push(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      0,
      mintOwner.publicKey,
      mintOwner.publicKey
    )
  );

  let userTokenAccountAddress = await getTokenWallet(
    mintOwner.publicKey,
    mint.publicKey
  );
  instructions.push(
    createAssociatedTokenAccountInstruction(
      userTokenAccountAddress,
      mintOwner.publicKey,
      mintOwner.publicKey,
      mint.publicKey
    )
  );

  instructions.push(
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mint.publicKey,
      userTokenAccountAddress,
      mintOwner.publicKey,
      [],
      1,
    ),
  );

  const res = await sendTransactionWithRetryWithKeypair(
    provider.connection,
    // @ts-ignore
    mintOwner,
    instructions,
    [mint],
  );

  try {
    await provider.connection.confirmTransaction(res.txid, 'max');
  } catch {
    // ignore
  }

  // Force wait for max confirmations
  await provider.connection.getParsedConfirmedTransaction(res.txid, 'confirmed');
  return mint;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function random_choice(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

export const createRandomGameMetadataArgs = async () => {
  const baseStats = new Stats({
    health: getRandomInt(10) + 1,
    attack: getRandomInt(5) + 1,
    defense: getRandomInt(5) + 1,
    speed: getRandomInt(5) + 1,
    agility: getRandomInt(5) + 1,
    rage_points: getRandomInt(5),
  });
  const levelStats = new Stats(JSON.parse(JSON.stringify(baseStats)));
  const currStats = new Stats(JSON.parse(JSON.stringify(baseStats)));

  const moves = ["", "Bite", "Stab", "Charge"];

  const move0 = new Move({
    move_name: "Bite",
    stats_modifier: new Stats({
      health: getRandomInt(10) + 1,
      attack: getRandomInt(5) + 1,
      defense: getRandomInt(5) + 1,
      speed: getRandomInt(5) + 1,
      agility: getRandomInt(5) + 1,
      rage_points: getRandomInt(5),
    }),
    move_speed: getRandomInt(10),
    status_effect: getRandomInt(3),
    status_effect_chance: getRandomInt(10),
  });
  const move1 = new Move({
    move_name: random_choice(moves),
    stats_modifier: new Stats({
      health: getRandomInt(10) + 1,
      attack: getRandomInt(5) + 1,
      defense: getRandomInt(5) + 1,
      speed: getRandomInt(5) + 1,
      agility: getRandomInt(5) + 1,
      rage_points: getRandomInt(5),
    }),
    move_speed: getRandomInt(10),
    status_effect: getRandomInt(3),
    status_effect_chance: getRandomInt(10),
  });
  const move2 = new Move({
    move_name: random_choice(moves),
    stats_modifier: new Stats({
      health: getRandomInt(10) + 1,
      attack: getRandomInt(5) + 1,
      defense: getRandomInt(5) + 1,
      speed: getRandomInt(5) + 1,
      agility: getRandomInt(5) + 1,
      rage_points: getRandomInt(5),
    }),
    move_speed: getRandomInt(10),
    status_effect: getRandomInt(3),
    status_effect_chance: getRandomInt(10),
  });
  const move3 = new Move({
    move_name: random_choice(moves),
    stats_modifier: new Stats({
      health: getRandomInt(10) + 1,
      attack: getRandomInt(5) + 1,
      defense: getRandomInt(5) + 1,
      speed: getRandomInt(5) + 1,
      agility: getRandomInt(5) + 1,
      rage_points: getRandomInt(5),
    }),
    move_speed: getRandomInt(10),
    status_effect: getRandomInt(3),
    status_effect_chance: getRandomInt(10),
  });

  const gameMetadataArgs =
    new CreateGameMetadataArgs({
      experience: 0,
      level: 1,
      baseStats: baseStats,
      levelStats: levelStats,
      currStats: currStats,
      status_effect: 0,
      moves: [move0, move1, move2, move3],
    });

  return gameMetadataArgs;
}

export const createGameMetadataArgsFromJSON = async (json, species) => {
  const baseStats = new Stats({
    health: json["health"],
    attack: json["attack"],
    defense: json["defense"],
    speed: json["speed"],
    agility: json["agility"],
    rage_points: json["rage_points"],
  });
  const levelStats = new Stats(JSON.parse(JSON.stringify(baseStats)));
  const currStats = new Stats(JSON.parse(JSON.stringify(baseStats)));

  let move0, move1;
  if (species === "Pterodactyl") {
    move0 = new Move({
      move_name: "Scratch",
      stats_modifier: new Stats({
        health: 1,
        attack: 0.5,
        defense: 1,
        speed: 1,
        agility: 1,
        rage_points: 0,
      }),
      move_speed: 1,
      status_effect: 0,
      status_effect_chance: 100,
    });
    move1 = new Move({
      move_name: "Dodge",
      stats_modifier: new Stats({
        health: 1,
        attack: 0,
        defense: 1,
        speed: 1,
        agility: 2,
        rage_points: 0,
      }),
      move_speed: 2,
      status_effect: 0,
      status_effect_chance: 100,
    });
  }
  else if (species === "Triceratops") {
    move0 = new Move({
      move_name: "Stab",
      stats_modifier: new Stats({
        health: 1,
        attack: 0.5,
        defense: 1,
        speed: 1,
        agility: 1,
        rage_points: 0,
      }),
      move_speed: 1,
      status_effect: 0,
      status_effect_chance: 100,
    });
    move1 = new Move({
      move_name: "Block",
      stats_modifier: new Stats({
        health: 1,
        attack: 0,
        defense: 2,
        speed: 1,
        agility: 1,
        rage_points: 0,
      }),
      move_speed: 2,
      status_effect: 0,
      status_effect_chance: 100,
    });
  }
  else if (species === "Tyrannosaurus") {
    move0 = new Move({
      move_name: "Bite",
      stats_modifier: new Stats({
        health: 1,
        attack: 0.5,
        defense: 1,
        speed: 1,
        agility: 1,
        rage_points: 0,
      }),
      move_speed: 1,
      status_effect: 0,
      status_effect_chance: 100,
    });
    move1 = new Move({
      move_name: "Roar",
      stats_modifier: new Stats({
        health: 1,
        attack: 0,
        defense: 0.5,
        speed: 1,
        agility: 1,
        rage_points: 0,
      }),
      move_speed: 2,
      status_effect: 0,
      status_effect_chance: 100,
    });
  }
  else if (species === "Velociraptor") {
    move0 = new Move({
      move_name: "Bite",
      stats_modifier: new Stats({
        health: 1,
        attack: 0.5,
        defense: 1,
        speed: 1,
        agility: 1,
        rage_points: 0,
      }),
      move_speed: 1,
      status_effect: 0,
      status_effect_chance: 100,
    });
    move1 = new Move({
      move_name: "Dodge",
      stats_modifier: new Stats({
        health: 1,
        attack: 0,
        defense: 1,
        speed: 1,
        agility: 2,
        rage_points: 0,
      }),
      move_speed: 1,
      status_effect: 0,
      status_effect_chance: 100,
    });
  }
  const move2 = new Move({
    move_name: "",
      stats_modifier: new Stats({
        health: 1,
        attack: 0,
        defense: 1,
        speed: 1,
        agility: 1,
        rage_points: 1,
      }),
      move_speed: 0,
      status_effect: 0,
      status_effect_chance: 100,
  });
  const move3 = new Move({
    move_name: "",
      stats_modifier: new Stats({
        health: 1,
        attack: 0,
        defense: 1,
        speed: 1,
        agility: 1,
        rage_points: 1,
      }),
      move_speed: 0,
      status_effect: 0,
      status_effect_chance: 100,
  });

  const gameMetadataArgs =
    new CreateGameMetadataArgs({
      experience: 0,
      level: 1,
      baseStats: baseStats,
      levelStats: levelStats,
      currStats: currStats,
      status_effect: 0,
      moves: [move0, move1, move2, move3],
    });

  return gameMetadataArgs;
}