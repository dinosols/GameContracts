
const anchor = require('@project-serum/anchor');
const assert = require('assert');
import {
  createBattleInstruction,
} from './helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from './helpers/transactions';
import {
  getBattlePDA,
} from './helpers/accounts';
import {
  Stats,
  Move,
  CreateBattleArgs,
  //     CreateMasterEditionArgs,
  //GameMetadataInfo,
  BATTLE_SCHEMA,
  decodeBattle,
} from './helpers/schema';
import { serialize } from 'borsh';
import {
  Keypair,
  Connection,
  SystemProgram,
  TransactionInstruction,
  PublicKey,
} from '@solana/web3.js';
import log from 'loglevel';

describe('battle-arena', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.BattleArena;

  let instructions: TransactionInstruction[] = [];
  let signers: anchor.web3.Keypair[]

  let player1 = null;
  let player2 = null;

  it('Create Players', async () => {
    player1 = provider.wallet.publicKey;
    console.log(provider.wallet.publicKey.toString());
    player2 = anchor.web3.Keypair.generate();
  });

  it('Create Battle', async () => {
    // Create Battle

    // Generate Date String
    var today = new Date();
    var ss = String(today.getMinutes()).padStart(2, '0');
    var mm = String(today.getSeconds()).padStart(2, '0');
    var hh = String(today.getHours()).padStart(2, '0');
    var DD = String(today.getDate()).padStart(2, '0');
    var MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var YYYY = today.getFullYear();

    const dateString: String = YYYY + "-" + MM + "-" + DD + " " +
      hh + ":" + mm + ":" + ss;

    const battleAccount = await getBattlePDA(player1, program.programId, dateString);
    console.log(program.programId.toString());
    console.log(battleAccount.toString());

    const battleArgs =
      new CreateBattleArgs({
        date: dateString,
      });

    let txnData = Buffer.from(
      serialize(
        BATTLE_SCHEMA,
        battleArgs,
      ),
    );

    instructions.push(
      createBattleInstruction(
        battleAccount,
        PublicKey.default,
        provider.wallet.publicKey,
        provider.wallet.publicKey,
        provider.wallet.publicKey,
        txnData,
        program.programId,
      ),
    );

    signers = [provider.wallet.payer];

    const res = await sendTransactionWithRetryWithKeypair(
      provider.connection,
      provider.wallet.payer,
      instructions,
      signers,
    );

    try {
      await provider.connection.confirmTransaction(res.txid, 'max');
    } catch {
      // ignore
    }

    // Force wait for max confirmations
    await provider.connection.getParsedConfirmedTransaction(res.txid, 'confirmed');

    const battleAccountInfo = await provider.connection.getAccountInfo(battleAccount);
    const battle = decodeBattle(battleAccountInfo.data);
    console.log(battle);
  });
});
