import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { web3, Provider } from '@project-serum/anchor';
import log from 'loglevel';

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
