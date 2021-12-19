
const anchor = require('@project-serum/anchor');
const assert = require('assert');
import {
  createBattleInstruction,
  createGameMetadataInstruction,
  joinBattleInstruction,
  enterBattleInstruction,
  chooseTeamMemberInstruction,
  submitActionInstruction,
  updateStatsInstruction,
  updateInstruction,
} from '../common/helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from '../common/helpers/transactions';
import {
  createRandomGameMetadataArgs,
  getBattlePDA, getMetadataPDA, mintToken,
} from '../common/helpers/accounts';
import {
  Stats,
  Move,
  JoinBattleArgs,
  CreateBattleArgs,
  ChooseTeamMemberArgs,
  SubmitActionArgs,
  BATTLE_SCHEMA,
  GAME_METADATA_SCHEMA,
  decodeBattle,
  CreateGameMetadataArgs,
  decodeMetadata,
  UpdateStatsArgs,
  UpdateArgs,
  EnterBattleArgs,
} from '../common/helpers/schema';
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
  const gameMetadataProgram = anchor.workspace.GameMetadata;

  // @ts-ignore
  let signers: anchor.web3.Keypair[]

  const provider2 = new anchor.Provider(
    provider.connection,
    new anchor.Wallet(anchor.web3.Keypair.generate()),
    { commitment: provider.connection.commitment }
  );
  const player2KeyPair = provider2.wallet.payer;

  let player1 = null;
  let player1Team: PublicKey[] = [];
  let player1TeamArgs: CreateGameMetadataArgs[] = [];
  let player2 = null;
  let player2Team: PublicKey[] = [];
  let player2TeamArgs: CreateGameMetadataArgs[] = [];

  let battleAccount: PublicKey;

  it('Create Players', async () => {
    let instructions: TransactionInstruction[] = [];

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(player2KeyPair.publicKey, 10000000000),
      "confirmed"
    );

    player1 = provider.wallet.publicKey;
    player2 = player2KeyPair.publicKey;

    // Create Player 1's Dinos
    let p1dino0mint = await mintToken(provider, provider.wallet.payer);
    let p1dino0meta = await getMetadataPDA(p1dino0mint.publicKey, gameMetadataProgram.programId);
    let p1dino0args = await createRandomGameMetadataArgs();
    let p1dino0TxnData = Buffer.from(
      serialize(
        GAME_METADATA_SCHEMA,
        p1dino0args,
      ),
    );

    instructions.push(
      createGameMetadataInstruction(
        p1dino0meta,
        p1dino0mint.publicKey,
        player1,
        player1,
        player1,
        p1dino0TxnData,
        gameMetadataProgram.programId,
      ),
    );


    let p1dino1mint = await mintToken(provider, provider.wallet.payer);
    let p1dino1meta = await getMetadataPDA(p1dino1mint.publicKey, gameMetadataProgram.programId);
    let p1dino1args = await createRandomGameMetadataArgs();
    let p1dino1TxnData = Buffer.from(
      serialize(
        GAME_METADATA_SCHEMA,
        p1dino1args,
      ),
    );

    instructions.push(
      createGameMetadataInstruction(
        p1dino1meta,
        p1dino1mint.publicKey,
        player1,
        player1,
        player1,
        p1dino1TxnData,
        gameMetadataProgram.programId,
      ),
    );


    let p1dino2mint = await mintToken(provider, provider.wallet.payer);
    let p1dino2meta = await getMetadataPDA(p1dino2mint.publicKey, gameMetadataProgram.programId);
    let p1dino2args = await createRandomGameMetadataArgs();
    let p1dino2TxnData = Buffer.from(
      serialize(
        GAME_METADATA_SCHEMA,
        p1dino2args,
      ),
    );

    instructions.push(
      createGameMetadataInstruction(
        p1dino2meta,
        p1dino2mint.publicKey,
        player1,
        player1,
        player1,
        p1dino2TxnData,
        gameMetadataProgram.programId,
      ),
    );

    const res0 = await sendTransactionWithRetryWithKeypair(
      provider.connection,
      provider.wallet.payer,
      instructions,
      [provider.wallet.payer],
    );

    try {
      await provider.connection.confirmTransaction(res0.txid, 'max');
    } catch {
      // ignore
    }

    // Force wait for max confirmations
    await provider.connection.getParsedConfirmedTransaction(res0.txid, 'confirmed');

    console.log("Player 1 Team created!");

    instructions = [];

    // TODO: Hande this with an actual second wallet
    //player2 = anchor.web3.Keypair.generate();
    //player2 = provider.wallet.publicKey;

    // Create Player 2's Dinos
    let p2dino0mint = await mintToken(provider, player2KeyPair);
    let p2dino0meta = await getMetadataPDA(p2dino0mint.publicKey, gameMetadataProgram.programId);
    let p2dino0args = await createRandomGameMetadataArgs();
    let p2dino0TxnData = Buffer.from(
      serialize(
        GAME_METADATA_SCHEMA,
        p2dino0args,
      ),
    );

    instructions.push(
      createGameMetadataInstruction(
        p2dino0meta,
        p2dino0mint.publicKey,
        player2,
        player2,
        player2,
        p2dino0TxnData,
        gameMetadataProgram.programId,
      ),
    );


    let p2dino1mint = await mintToken(provider, player2KeyPair);
    let p2dino1meta = await getMetadataPDA(p2dino1mint.publicKey, gameMetadataProgram.programId);
    let p2dino1args = await createRandomGameMetadataArgs();
    let p2dino1TxnData = Buffer.from(
      serialize(
        GAME_METADATA_SCHEMA,
        p2dino1args,
      ),
    );

    instructions.push(
      createGameMetadataInstruction(
        p2dino1meta,
        p2dino1mint.publicKey,
        player2,
        player2,
        player2,
        p2dino1TxnData,
        gameMetadataProgram.programId,
      ),
    );


    let p2dino2mint = await mintToken(provider, player2KeyPair);
    let p2dino2meta = await getMetadataPDA(p2dino2mint.publicKey, gameMetadataProgram.programId);
    let p2dino2args = await createRandomGameMetadataArgs();
    let p2dino2TxnData = Buffer.from(
      serialize(
        GAME_METADATA_SCHEMA,
        p2dino2args,
      ),
    );

    instructions.push(
      createGameMetadataInstruction(
        p2dino2meta,
        p2dino2mint.publicKey,
        player2,
        player2,
        player2,
        p2dino2TxnData,
        gameMetadataProgram.programId,
      ),
    );

    const res1 = await sendTransactionWithRetryWithKeypair(
      provider.connection,
      player2KeyPair,
      instructions,
      [player2KeyPair],
    );

    try {
      await provider.connection.confirmTransaction(res1.txid, 'max');
    } catch {
      // ignore
    }

    // Force wait for max confirmations
    await provider.connection.getParsedConfirmedTransaction(res1.txid, 'confirmed');

    console.log("Player 2 Team created!");

    player1Team.push(p1dino0meta);
    player1TeamArgs.push(p1dino0args);
    player1Team.push(p1dino1meta);
    player1TeamArgs.push(p1dino1args);
    player1Team.push(p1dino2meta);
    player1TeamArgs.push(p1dino2args);
    player2Team.push(p2dino0meta);
    player2TeamArgs.push(p2dino0args);
    player2Team.push(p2dino1meta);
    player2TeamArgs.push(p2dino1args);
    player2Team.push(p2dino2meta);
    player2TeamArgs.push(p2dino2args);

    // We're going to assume that any failures would throw so no asserts here.
  });

  it('Create Battle', async () => {
    let instructions: TransactionInstruction[] = [];
    // Create Battle

    // Generate Date String
    var today = new Date();
    var ss = String(today.getMinutes()).padStart(2, '0');
    var mm = String(today.getSeconds()).padStart(2, '0');
    var hh = String(today.getHours()).padStart(2, '0');
    var DD = String(today.getDate()).padStart(2, '0');
    var MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var YYYY = today.getFullYear();

    const dateString: string = YYYY + "-" + MM + "-" + DD + " " +
      hh + ":" + mm + ":" + ss;

    battleAccount = await getBattlePDA(player1, program.programId, dateString);

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
    //console.log("Battle:\n" + JSON.stringify(battle, null, 2));

    assert.ok(battle.date === dateString);
    assert.ok(battle.updateAuthority.toString() === provider.wallet.publicKey.toString());
    assert.ok(battle.player_1.wallet.toString() === PublicKey.default.toString());
    assert.ok(battle.player_1.team_member0.toString() === PublicKey.default.toString());
    assert.ok(battle.player_1.team_member1.toString() === PublicKey.default.toString());
    assert.ok(battle.player_1.team_member2.toString() === PublicKey.default.toString());
    assert.ok(battle.player_2.wallet.toString() === PublicKey.default.toString());
    assert.ok(battle.player_2.team_member0.toString() === PublicKey.default.toString());
    assert.ok(battle.player_2.team_member1.toString() === PublicKey.default.toString());
    assert.ok(battle.player_2.team_member2.toString() === PublicKey.default.toString());
  });

  it('Join Battle', async () => {
    let instructions: TransactionInstruction[] = [];
    // Join Battle

    const battleArgs =
      new JoinBattleArgs({
      });

    let txnData = Buffer.from(
      serialize(
        BATTLE_SCHEMA,
        battleArgs,
      ),
    );

    instructions.push(
      joinBattleInstruction(
        battleAccount,
        provider.wallet.publicKey,
        player1Team[0],
        player1Team[1],
        player1Team[2],
        provider.wallet.publicKey,
        txnData,
        program.programId,
      ),
    );

    for (let i = 0; i < 3; i++) {
      const enterBattleArgs =
        new EnterBattleArgs({
          battle_authority: battleAccount.toString(),
        });

      let txnData = Buffer.from(
        serialize(
          GAME_METADATA_SCHEMA,
          enterBattleArgs,
        ),
      );
      instructions.push(
        enterBattleInstruction(
          provider.wallet.publicKey,
          player1Team[i],
          provider.wallet.publicKey,
          txnData,
          gameMetadataProgram.programId,
        ),
      );
    }

    instructions.push(
      joinBattleInstruction(
        battleAccount,
        player2,
        player2Team[0],
        player2Team[1],
        player2Team[2],
        player2,
        txnData,
        program.programId,
      ),
    );

    for (let i = 0; i < 3; i++) {
      const enterBattleArgs =
        new EnterBattleArgs({
          battle_authority: battleAccount.toString(),
        });

      let txnData = Buffer.from(
        serialize(
          GAME_METADATA_SCHEMA,
          enterBattleArgs,
        ),
      );
      instructions.push(
        enterBattleInstruction(
          player2,
          player2Team[i],
          player2,
          txnData,
          gameMetadataProgram.programId,
        ),
      );
    }

    signers = [provider.wallet.payer, player2KeyPair];

    //console.log(JSON.stringify(instructions, null, 2));

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

    for (let i = 0; i < 3; i++) {
      const gameMetadataInfo0 = await provider.connection.getAccountInfo(player1Team[i]);
      const gameMeta0 = decodeMetadata(gameMetadataInfo0.data);
      //console.log(gameMeta0);
      assert.ok(gameMeta0.battleAuthority.toString() === battleAccount.toString());

      const gameMetadataInfo1 = await provider.connection.getAccountInfo(player2Team[i]);
      const gameMeta1 = decodeMetadata(gameMetadataInfo1.data);
      //console.log(gameMeta1);
      assert.ok(gameMeta1.battleAuthority.toString() === battleAccount.toString());
    }

    const battleAccountInfo = await provider.connection.getAccountInfo(battleAccount);
    const battle = decodeBattle(battleAccountInfo.data);
    //console.log("Battle:\n" + JSON.stringify(battle, null, 2));

    assert.ok(battle.updateAuthority.toString() === provider.wallet.publicKey.toString());
    assert.ok(battle.player_1.wallet.toString() === provider.wallet.publicKey.toString());
    assert.ok(battle.player_1.team_member0.toString() === player1Team[0].toString());
    assert.ok(battle.player_1.team_member1.toString() === player1Team[1].toString());
    assert.ok(battle.player_1.team_member2.toString() === player1Team[2].toString());
    //console.log(battle.player_2.wallet.toString());
    //console.log(provider.wallet.publicKey.toString());
    assert.ok(battle.player_2.wallet.toString() === player2.toString());
    assert.ok(battle.player_2.team_member0.toString() === player2Team[0].toString());
    assert.ok(battle.player_2.team_member1.toString() === player2Team[1].toString());
    assert.ok(battle.player_2.team_member2.toString() === player2Team[2].toString());
  });

  it('Choose Team Member', async () => {
    let instructions: TransactionInstruction[] = [];
    // Choose Team Members

    const p1TeamMemberArgs =
      new ChooseTeamMemberArgs({
        index: 1,
      });

    let p1TxnData = Buffer.from(
      serialize(
        BATTLE_SCHEMA,
        p1TeamMemberArgs,
      ),
    );

    instructions.push(
      chooseTeamMemberInstruction(
        battleAccount,
        provider.wallet.publicKey,
        provider.wallet.publicKey,
        p1TxnData,
        program.programId,
      ),
    );

    // TODO: We're only using one wallet so there's no way to check which player
    // is sending this instruction. Don't overwrite.
    const p2TeamMemberArgs =
      new ChooseTeamMemberArgs({
        index: 0,
      });

    let p2TxnData = Buffer.from(
      serialize(
        BATTLE_SCHEMA,
        p2TeamMemberArgs,
      ),
    );

    instructions.push(
      chooseTeamMemberInstruction(
        battleAccount,
        player2,
        player2,
        p2TxnData,
        program.programId,
      ),
    );

    signers = [provider.wallet.payer, player2KeyPair];

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
    //console.log("Battle:\n" + JSON.stringify(battle, null, 2));

    //const p1TeamMemberAccountInfo = await provider.connection.getAccountInfo(player1Team[1]);
    //const p1TeamMember = decodeMetadata(p1TeamMemberAccountInfo.data);
    //console.log("Player 1:\n" + JSON.stringify(p1TeamMember, null, 2));

    //const p2TeamMemberAccountInfo = await provider.connection.getAccountInfo(player2Team[0]);
    //const p2TeamMember = decodeMetadata(p2TeamMemberAccountInfo.data);
    //console.log("Player 2:\n" + JSON.stringify(p2TeamMember, null, 2));

    assert.ok(battle.player_1.active_team_member === 1);
  });

  it('Submit Actions & Update Stats', async () => {
    let battleAccountInfo = await provider.connection.getAccountInfo(battleAccount);
    let battle = decodeBattle(battleAccountInfo.data);
    let p1TeamMemberAccountInfo;
    let p1TeamMember, p1TeamMember_prev;
    let p2TeamMemberAccountInfo;
    let p2TeamMember, p2TeamMember_prev;
    do {
      let instructions: TransactionInstruction[] = [];
      // Submit actions

      // TODO: This doesn't work for now, CPI needs to be fixed.
      const p1MoveArgs =
        new SubmitActionArgs({
          move: player1TeamArgs[0].moves[0],
        });

      let p1MoveTxnData = Buffer.from(
        serialize(
          BATTLE_SCHEMA,
          p1MoveArgs,
        ),
      );

      instructions.push(
        submitActionInstruction(
          battleAccount,
          provider.wallet.publicKey,
          player1Team[1],
          player2Team[0],
          gameMetadataProgram.programId,
          provider.wallet.publicKey,
          p1MoveTxnData,
          program.programId,
        ),
      );

      console.log("p1MoveArgs: " + JSON.stringify(p1MoveArgs));
      //console.log("p1MoveTxnData: " + JSON.stringify(p1MoveTxnData));
      //console.log("Instructions: " + JSON.stringify(instructions));

      const p2MoveArgs =
        new SubmitActionArgs({
          move: player2TeamArgs[0].moves[0],
        });

      let p2TxnData = Buffer.from(
        serialize(
          BATTLE_SCHEMA,
          p2MoveArgs,
        ),
      );

      instructions.push(
        submitActionInstruction(
          battleAccount,
          player2,
          player2Team[0],
          player1Team[1],
          gameMetadataProgram.programId,
          player2,
          p2TxnData,
          program.programId,
        ),
      );


      console.log("p2MoveArgs: " + JSON.stringify(p2MoveArgs));

      p1TeamMemberAccountInfo = await provider.connection.getAccountInfo(player1Team[1]);
      p1TeamMember = decodeMetadata(p1TeamMemberAccountInfo.data);
      p2TeamMemberAccountInfo = await provider.connection.getAccountInfo(player2Team[0]);
      p2TeamMember = decodeMetadata(p2TeamMemberAccountInfo.data);

      // const p1_new_stats = new Stats({
      //   health: Math.max(0, p1TeamMember.currStats.health - p2TeamMember.currStats.attack),
      //   attack: p1TeamMember.currStats.attack,
      //   defense: p1TeamMember.currStats.defense,
      //   speed: p1TeamMember.currStats.speed,
      //   agility: p1TeamMember.currStats.agility,
      // });

      // const p1StatsArgs =
      //   new UpdateStatsArgs({
      //     stats: p1_new_stats,
      //   });

      // let p1TxnData = Buffer.from(
      //   serialize(
      //     GAME_METADATA_SCHEMA,
      //     p1StatsArgs,
      //   ),
      // );

      // instructions.push(
      //   updateStatsInstruction(
      //     player1Team[1],
      //     provider.wallet.publicKey,
      //     p1TxnData,
      //     gameMetadataProgram.programId,
      //   ),
      // );

      // const p2_new_stats = new Stats({
      //   health: Math.max(0, p2TeamMember.currStats.health - p1TeamMember.currStats.attack),
      //   attack: p2TeamMember.currStats.attack,
      //   defense: p2TeamMember.currStats.defense,
      //   speed: p2TeamMember.currStats.speed,
      //   agility: p2TeamMember.currStats.agility,
      // });

      // const p2StatsArgs =
      //   new UpdateStatsArgs({
      //     stats: p2_new_stats,
      //   });

      // let p2TxnData = Buffer.from(
      //   serialize(
      //     GAME_METADATA_SCHEMA,
      //     p2StatsArgs,
      //   ),
      // );

      // instructions.push(
      //   updateStatsInstruction(
      //     player2Team[0],
      //     provider.wallet.publicKey,
      //     p2TxnData,
      //     gameMetadataProgram.programId,
      //   ),
      // );

      // let updateArgs =
      //   new UpdateArgs({});
      // let updateTxnData = Buffer.from(
      //   serialize(
      //     BATTLE_SCHEMA,
      //     updateArgs,
      //   )
      // );

      // //console.log("Got here")
      // instructions.push(
      //   updateInstruction(
      //     battleAccount,
      //     player1Team[1],
      //     player2Team[0],
      //     provider.wallet.publicKey,
      //     updateTxnData,
      //     program.programId,
      //   ),
      // );
      //console.log("Also got here");
      //console.log(instructions);
      //console.log(provider.wallet.publicKey);

      signers = [provider.wallet.payer, player2KeyPair];

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

      battleAccountInfo = await provider.connection.getAccountInfo(battleAccount);
      battle = decodeBattle(battleAccountInfo.data);
      console.log(battle);

      p1TeamMember_prev = p1TeamMember;
      p1TeamMemberAccountInfo = await provider.connection.getAccountInfo(player1Team[1]);
      p1TeamMember = decodeMetadata(p1TeamMemberAccountInfo.data);
      console.log(p1TeamMember);

      p2TeamMember_prev = p2TeamMember;
      p2TeamMemberAccountInfo = await provider.connection.getAccountInfo(player2Team[0]);
      p2TeamMember = decodeMetadata(p2TeamMemberAccountInfo.data);
      console.log(p2TeamMember);

      let p1Health = p1TeamMember.currStats.health;
      let p1Health_prev = p1TeamMember_prev.currStats.health;
      let p2Damage = p2TeamMember.currStats.attack;
      assert.ok(p1Health === Math.max(0, p1Health_prev - p2Damage));

      let p2Health = p2TeamMember.currStats.health;
      let p2Health_prev = p2TeamMember_prev.currStats.health;
      let p1Damage = p1TeamMember.currStats.attack;
      assert.ok(p2Health === Math.max(0, p2Health_prev - p1Damage));
    }
    while (battle.status != 7);
    console.log("Battle:\n" + JSON.stringify(battle, null, 2));

    p1TeamMemberAccountInfo = await provider.connection.getAccountInfo(player1Team[1]);
    p1TeamMember = decodeMetadata(p1TeamMemberAccountInfo.data);
    console.log("Player 1:\n" + JSON.stringify(p1TeamMember, null, 2));

    p2TeamMemberAccountInfo = await provider.connection.getAccountInfo(player2Team[0]);
    p2TeamMember = decodeMetadata(p2TeamMemberAccountInfo.data);
    console.log("Player 2:\n" + JSON.stringify(p2TeamMember, null, 2));

    if (p1TeamMember.currStats.health == 0) {
      console.log("Player 2 (" + player2 + ") won the battle!");
      assert.ok(p1TeamMember.currStats.health === 0);
    }
    else {
      console.log("Player 1 (" + player1 + ") won the battle!");
      assert.ok(p2TeamMember.currStats.health === 0);
    }
  });
});
