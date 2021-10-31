import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  //TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from './constants';
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
  console.log('battle');
  console.log(battle_program_id.toString());
  console.log(player);
  console.log(dateString);
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
