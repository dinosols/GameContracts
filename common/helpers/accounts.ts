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
        Buffer.from('gamemeta'),
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
        Buffer.from('battle'),
        battle_program_id.toBuffer(),
        player.toBuffer(),
        Buffer.from(dateString),
      ],
      battle_program_id,
    )
  )[0];
};

// @ts-ignore
export async function mintToken(provider: anchor.Provider, mintOwner: PublicKey) {
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
          fromPubkey: mintOwner,
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
          mintOwner,
          mintOwner
      )
  );

  let userTokenAccountAddress = await getTokenWallet(
      mintOwner,
      mint.publicKey
  );
  instructions.push(
      createAssociatedTokenAccountInstruction(
          userTokenAccountAddress,
          mintOwner,
          mintOwner,
          mint.publicKey
      )
  );

  instructions.push(
      Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          userTokenAccountAddress,
          mintOwner,
          [],
          1,
      ),
  );

  const res = await sendTransactionWithRetryWithKeypair(
      provider.connection,
      // @ts-ignore
      provider.wallet.payer,
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

export const createRandomGameMetadataArgs = async () => {
  const baseStats = new Stats({
    health: getRandomInt(10) + 1,
    attack: getRandomInt(5) + 1,
    defense: getRandomInt(5) + 1,
    speed: getRandomInt(5) + 1,
    agility: getRandomInt(5) + 1,
  });
  const levelStats = new Stats(JSON.parse(JSON.stringify(baseStats)));
  const currStats = new Stats(JSON.parse(JSON.stringify(baseStats)));

  const move0 = new Move({
    move_id: getRandomInt(13) + 1,
    damage_modifier: getRandomInt(5),
    status_effect_chance: getRandomInt(10),
    status_effect: getRandomInt(3),
  });
  const move1 = new Move({
    move_id: getRandomInt(14),
    damage_modifier: getRandomInt(5),
    status_effect_chance: getRandomInt(10),
    status_effect: getRandomInt(3),
  });
  const move2 = new Move({
    move_id: getRandomInt(14),
    damage_modifier: getRandomInt(5),
    status_effect_chance: getRandomInt(10),
    status_effect: getRandomInt(3),
  });
  const move3 = new Move({
    move_id: getRandomInt(14),
    damage_modifier: getRandomInt(5),
    status_effect_chance: getRandomInt(10),
    status_effect: getRandomInt(3),
  });

  const gameMetadataArgs =
    new CreateGameMetadataArgs({
      experience: 0,
      level: 1,
      baseStats: baseStats,
      levelStats: levelStats,
      currStats: currStats,
      move0: move0,
      move1: move1,
      move2: move2,
      move3: move3
    });

    return gameMetadataArgs;
}