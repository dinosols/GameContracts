import { program } from 'commander';
import log from 'loglevel';
import { mintNFT, /*updateMetadata*/ } from '../common/metaplex-metadata/commands/mint-nft';
import { loadWalletKey } from '../common/metaplex-metadata/helpers/accounts';
import { web3 } from '@project-serum/anchor';
import { PublicKey, TransactionInstruction, } from '@solana/web3.js';
import {
    createRandomGameMetadataArgs,
    getMetadataPDA,
} from '../common/helpers/accounts';
import {
    BATTLE_SCHEMA,
    GAME_METADATA_SCHEMA,
    decodeBattle,
    decodeMetadata,
    EnterBattleArgs,
} from '../common/helpers/schema';
import { serialize } from 'borsh';
import {
    createGameMetadataInstruction,
    enterBattleInstruction,
} from '../common/helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from '../common/helpers/transactions';

program.version('0.0.1');
log.setLevel('info');

programCommand('mint')
    .option('-u, --url <string>', 'metadata url')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
        const { keypair, env, url } = cmd.opts();
        const solConnection = new web3.Connection(web3.clusterApiUrl(env));
        const walletKeyPair = loadWalletKey(keypair);
        try {
            let { metadataAccount, mint } = await mintNFT(solConnection, walletKeyPair, url);
            console.log("Metadata Account: " + metadataAccount.toString());
            console.log("Mint: " + mint.publicKey.toString());
        } catch (e) {
            console.log(e);
        }
    });

programCommand('attach_game_metadata')
    .option('-t, --token <string>', 'Token to attach to')
    .action(async (directory, cmd) => {
        const GAME_METADATA_PROGRAM = new PublicKey("4iqJsF4JLz8iLuvMxYvHchtG3wqiZdsNEp1EGPphKVXw");
        const { keypair, env, token } = cmd.opts();
        const walletKeyPair = loadWalletKey(keypair);
        const connection = new web3.Connection(web3.clusterApiUrl(env));
        const mint = new PublicKey(token);
        let instructions: TransactionInstruction[] = [];

        // Create Player 1's Dinos
        let p1dino0mint = new PublicKey(token);
        let p1dino0meta = await getMetadataPDA(mint, GAME_METADATA_PROGRAM);
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
                mint,
                walletKeyPair.publicKey,
                walletKeyPair.publicKey,
                walletKeyPair.publicKey,
                p1dino0TxnData,
                GAME_METADATA_PROGRAM,
            ),
        );
        const res0 = await sendTransactionWithRetryWithKeypair(
            connection,
            walletKeyPair,
            instructions,
            [walletKeyPair],
        );

        try {
            await connection.confirmTransaction(res0.txid, 'max');
        } catch {
            // ignore
        }

        // Force wait for max confirmations
        await connection.getParsedConfirmedTransaction(res0.txid, 'confirmed');

        console.log(res0.txid);
        console.log("Metadata attached!");
    });

programCommand('display_meta')
    .option('-t, --token <string>', 'Token to attach to')
    .action(async (directory, cmd) => {
        const GAME_METADATA_PROGRAM = new PublicKey("4iqJsF4JLz8iLuvMxYvHchtG3wqiZdsNEp1EGPphKVXw");
        const { keypair, env, token } = cmd.opts();
        const walletKeyPair = loadWalletKey(keypair);
        const connection = new web3.Connection(web3.clusterApiUrl(env));
        const mint = new PublicKey(token);

        // Create Player 1's Dinos
        //let p1dino0mint = new PublicKey(token);
        let meta = await getMetadataPDA(mint, GAME_METADATA_PROGRAM);

        const metaInfo = await connection.getAccountInfo(meta);
        const metadata = decodeMetadata(metaInfo.data);
        console.log(metadata);
    });

programCommand('reset_battle')
    .option('-t, --token <string>', 'Token to attach to')
    .action(async (directory, cmd) => {
        const GAME_METADATA_PROGRAM = new PublicKey("4iqJsF4JLz8iLuvMxYvHchtG3wqiZdsNEp1EGPphKVXw");
        const { keypair, env, token } = cmd.opts();
        const walletKeyPair = loadWalletKey(keypair);
        const connection = new web3.Connection(web3.clusterApiUrl(env));
        const mint = new PublicKey(token);
        let instructions: TransactionInstruction[] = [];

        // Create Player 1's Dinos
        //let p1dino0mint = new PublicKey(token);
        let meta = await getMetadataPDA(mint, GAME_METADATA_PROGRAM);

        const enterBattleArgs =
            new EnterBattleArgs({
                battle_authority: PublicKey.default.toString(),
            });

        let txnData = Buffer.from(
            serialize(
                GAME_METADATA_SCHEMA,
                enterBattleArgs,
            ),
        );

        instructions.push(
            enterBattleInstruction(
                walletKeyPair.publicKey,
                meta,
                walletKeyPair.publicKey,
                txnData,
                GAME_METADATA_PROGRAM,
            ),
        );

        try {
            const res0 = await sendTransactionWithRetryWithKeypair(
                connection,
                walletKeyPair,
                instructions,
                [walletKeyPair],
            );

            await connection.confirmTransaction(res0.txid, 'max');

            // Force wait for max confirmations
            await connection.getParsedConfirmedTransaction(res0.txid, 'confirmed');
        } catch (e) {
            console.log(e);
        }
        console.log("Battle Authority reset!");
    });

programCommand('get_open_battles')
    .action(async (directory, cmd) => {
        const BATTLE_PUBKEY = new PublicKey("7c3qcZxkby5jNCUx2ghQraLtrpM1aSR3V3vSWcgmorZS");
        const { keypair, env } = cmd.opts();
        const walletKeyPair = loadWalletKey(keypair);
        const connection = new web3.Connection(web3.clusterApiUrl(env));

        const fetched = await connection.getConfirmedSignaturesForAddress2(BATTLE_PUBKEY);


        //console.log(fetched);

        let battles = [];
        for (let sigInfo of fetched) {
            let tx = (await connection.getConfirmedTransaction(sigInfo.signature)).transaction;
            //transactions.push(tx);
            //console.log(tx.instructions);
            for (let instruction of tx.instructions) {
                //console.log(instruction.data[0]);
                if (instruction.data[0] === 0) {
                    //console.log(instruction.data);
                    //console.log(instruction.data[0]);
                    //console.log(instruction.keys[0].pubkey.toString());
                    //battles.push(instruction.keys[0].pubkey);
                    try {
                        const battleAccountInfo = await connection.getAccountInfo(instruction.keys[0].pubkey);
                        const battle = decodeBattle(battleAccountInfo.data);
                        console.log(battle.player_2.wallet.toString());
                        console.log(PublicKey.default.toString());
                        if (battle.player_2.wallet.toString() === PublicKey.default.toString()) {
                            console.log("Battle:\n" + JSON.stringify(battle, null, 2));
                        }
                    } catch (e) {
                        console.log("Address " + instruction.keys[0].pubkey.toString() + " is not a valid battle.");
                    }
                }
            }
        }
    });

programCommand('display_battle')
    .option('-b, --battleAddress <string>', 'Battle to display')
    .action(async (directory, cmd) => {
        const { keypair, env, battleAddress } = cmd.opts();
        const connection = new web3.Connection(web3.clusterApiUrl(env));
        const battlePubKey = new PublicKey(battleAddress);
        const battleAccountInfo = await connection.getAccountInfo(battlePubKey);
        const battle = decodeBattle(battleAccountInfo.data);
        console.log(battle);
    });

programCommand('display_game_metadata')
    .option('-g, --gameMetadata <string>', 'Game Metadata to display')
    .action(async (directory, cmd) => {
        const GAME_METADATA_PROGRAM = new PublicKey("4iqJsF4JLz8iLuvMxYvHchtG3wqiZdsNEp1EGPphKVXw");
        const { keypair, env, gameMetadata } = cmd.opts();
        const connection = new web3.Connection(web3.clusterApiUrl(env));
        const metaPubKey = await getMetadataPDA(new PublicKey(gameMetadata), GAME_METADATA_PROGRAM);
        const gameMetadataInfo = await connection.getAccountInfo(metaPubKey);
        const gameMeta = decodeMetadata(gameMetadataInfo.data);
        console.log(gameMeta);
    });

function programCommand(name: string) {
    return program
        .command(name)
        .option(
            '-e, --env <string>',
            'Solana cluster env name',
            'devnet', //mainnet-beta, testnet, devnet
        )
        .option(
            '-k, --keypair <path>',
            `Solana wallet location`,
            '--keypair not provided',
        )
        .option('-l, --log-level <string>', 'log level', setLogLevel);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value, prev) {
    if (value === undefined || value === null) {
        return;
    }
    log.info('setting the log value to: ' + value);
    log.setLevel(value);
}

program.parse(process.argv);