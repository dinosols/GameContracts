import { program } from 'commander';
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Wallet } from "@project-serum/anchor";
import log from 'loglevel';
import { mintNFT, updateMetadata, /*updateMetadata*/ } from '../common/metaplex-metadata/commands/mint-nft';
import { loadWalletKey } from '../common/metaplex-metadata/helpers/accounts';
import { web3 } from '@project-serum/anchor';
import { Keypair, PublicKey, TransactionInstruction, } from '@solana/web3.js';
import {
    createGameMetadataArgsFromJSON,
    createRandomGameMetadataArgs,
    getMetadataPDA,
} from '../common/helpers/accounts';
import {
    BATTLE_SCHEMA,
    GAME_METADATA_SCHEMA,
    decodeBattle,
    decodeMetadata,
    EnterBattleArgs,
    UpdateStatsArgs,
    Stats,
    CreateGameMetadataArgs,
} from '../common/helpers/schema';
import { serialize } from 'borsh';
import {
    createGameMetadataInstruction,
    enterBattleInstruction,
    updateStatsInstruction,
} from '../common/helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from '../common/helpers/transactions';
import { sleep } from '../common/metaplex-metadata/helpers/various';
const fs = require('fs');

program.version('0.0.1');
log.setLevel('info');

programCommand('mint')
    .option('-u, --url <string>', 'metadata url')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
        const { keypair, env, url } = cmd.opts();
        await mintToken(keypair, env, url);
    });

programCommand('attach_game_metadata')
    .option('-t, --token <string>', 'Token to attach to')
    .action(async (directory, cmd) => {
        const { keypair, env, token } = cmd.opts();
        await attach_meta(keypair, env, token, null);
    });

programCommand('mint_and_attach')
    .option('-u, --url <string>', 'metadata url')
    .option('-s --stat_file <string>', 'stat file')
    .action(async (directory, cmd) => {
        const { keypair, env, url, stat_file } = cmd.opts();
        //console.log(cmd.opts());
        //console.log(stat_file);
        await attach_meta(keypair, env, await mintToken(keypair, env, url), stat_file);
    });

programCommand('mint_attach_xfer')
    .option('-u, --url <string>', 'Metadata URL')
    .option('-s --stat_file <string>', 'Stats File')
    .option('-r --to_account <string>', 'Recipient Account')
    .action(async (directory, cmd) => {
        const { keypair, env, url, stat_file, to_account } = cmd.opts();
        //console.log(cmd.opts());
        //console.log(stat_file);
        let mint = await mintToken(keypair, env, url);
        await attach_meta(keypair, env, mint, stat_file);
        await transfer(mint.toString(), loadWalletKey(keypair), to_account, new web3.Connection(web3.clusterApiUrl(env)), 1)
    });

programCommand('batch_mint_attach_xfer')
    .option('-u, --url_list <string>', 'Metadata URL')
    .option('-s --stat_file_list <string>', 'Stats File')
    .option('-r --to_account_list <string>', 'Recipient Account')
    .action(async (directory, cmd) => {
        const { keypair, env, url_list, stat_file_list, to_account_list } = cmd.opts();
        //console.log(cmd.opts());
        //console.log(stat_file);
        let urls = JSON.parse(fs.readFileSync(url_list));
        let stats = JSON.parse(fs.readFileSync(stat_file_list));
        let mintList = [];
        let tos = JSON.parse(fs.readFileSync(to_account_list));
        if (urls["url"].length != stats["stat"].length || urls["url"].length != tos["to"].length) {
            console.log("Lengths not equal.");
        }
        else {
            for (let i = 0; i < urls["url"].length; i++) {
                let url = urls["url"][i];
                let stat_file = stats["stat"][i];
                let to_account = tos["to"][i];
                console.log(url);
                console.log(stat_file);
                console.log(to_account);
                let mint = await mintToken(keypair, env, url);
                mintList.push(mint.toString());
                await sleep(5000);
                //await attach_meta(keypair, env, mint, stat_file);
                await transfer(mint.toString(), loadWalletKey(keypair), to_account, new web3.Connection(web3.clusterApiUrl(env)), 1)
                await sleep(5000);
            }
            console.log(mintList);
        }
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

programCommand('heal')
    .option('-t, --token <string>', 'Token to attach to')
    .action(async (directory, cmd) => {
        const GAME_METADATA_PROGRAM = new PublicKey("4iqJsF4JLz8iLuvMxYvHchtG3wqiZdsNEp1EGPphKVXw");
        const { keypair, env, token } = cmd.opts();
        const walletKeyPair = loadWalletKey(keypair);
        const connection = new web3.Connection(web3.clusterApiUrl(env));
        const mint = new PublicKey(token);
        let instructions: TransactionInstruction[] = [];

        let meta = await getMetadataPDA(mint, GAME_METADATA_PROGRAM);

        const metaAccountInfo = await connection.getAccountInfo(meta);
        const metadata = decodeMetadata(metaAccountInfo.data);

        const newStats = new Stats({
            health: metadata.levelStats.health,
            attack: metadata.currStats.attack,
            defense: metadata.currStats.defense,
            speed: metadata.currStats.speed,
            agility: metadata.currStats.agility,
            rage_points: metadata.currStats.rage_points,
        });

        const statsArgs =
            new UpdateStatsArgs({
                stats: newStats,
            });

        let txnData = Buffer.from(
            serialize(
                GAME_METADATA_SCHEMA,
                statsArgs,
            ),
        );

        instructions.push(
            updateStatsInstruction(
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
        console.log("Player healed!");
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


        let battles = [];
        for (let sigInfo of fetched) {
            let tx = (await connection.getConfirmedTransaction(sigInfo.signature)).transaction;
            for (let instruction of tx.instructions) {
                if (instruction.data[0] === 0) {
                    try {
                        const battleAccountInfo = await connection.getAccountInfo(instruction.keys[0].pubkey);
                        const battle = decodeBattle(battleAccountInfo.data);
                        //console.log(battle.player_2.wallet.toString());
                        //console.log(PublicKey.default.toString());
                        if ((battle.player_1.wallet.toString() !== PublicKey.default.toString()) && (battle.player_2.wallet.toString() === PublicKey.default.toString())) {
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
        try {
            const { keypair, env, battleAddress } = cmd.opts();
            const connection = new web3.Connection(web3.clusterApiUrl(env));
            const battlePubKey = new PublicKey(battleAddress);
            const battleAccountInfo = await connection.getAccountInfo(battlePubKey);
            const battle = decodeBattle(battleAccountInfo.data);
            console.log(battle);
        } catch (e) {
            console.log(e);
        }
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

async function attach_meta(keypair: any, env: any, mint: any, stat_file: String) {
    const GAME_METADATA_PROGRAM = new PublicKey("4iqJsF4JLz8iLuvMxYvHchtG3wqiZdsNEp1EGPphKVXw");
    const walletKeyPair = loadWalletKey(keypair);
    const connection = new web3.Connection(web3.clusterApiUrl(env));
    //const mint = new PublicKey(token);
    let instructions: TransactionInstruction[] = [];

    // Create Player 1's Dinos
    //let p1dino0mint = new PublicKey(token);
    let p1dino0meta = await getMetadataPDA(mint, GAME_METADATA_PROGRAM);
    let p1dino0args;
    if (stat_file) {
        let rawdata = fs.readFileSync(stat_file);
        let stats = JSON.parse(rawdata);
        let meta_file = stat_file.replace(".stats", "");
        let metadata = JSON.parse(fs.readFileSync(meta_file));
        let species = metadata["attributes"][8]["value"];
        const valid_dinos = ["Velociraptor", "Tyrannosaurus", "Triceratops", "Pterodactyl"];
        if (!valid_dinos.includes(species)) {
            console.log("Error: invalid species {}", species);
            return;
        }
        //console.log(stats);
        //console.log(species);
        p1dino0args = await createGameMetadataArgsFromJSON(stats, species);
        //console.log(p1dino0args);
    }
    else {
        p1dino0args = await createRandomGameMetadataArgs();
    }
    let p1dino0TxnData = Buffer.from(
        serialize(
            GAME_METADATA_SCHEMA,
            p1dino0args
        )
    );

    instructions.push(
        createGameMetadataInstruction(
            p1dino0meta,
            mint,
            walletKeyPair.publicKey,
            walletKeyPair.publicKey,
            walletKeyPair.publicKey,
            p1dino0TxnData,
            GAME_METADATA_PROGRAM
        )
    );
    const res0 = await sendTransactionWithRetryWithKeypair(
        connection,
        walletKeyPair,
        instructions,
        [walletKeyPair]
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
}

async function mintToken(keypair, env, url) {
    const solConnection = new web3.Connection(web3.clusterApiUrl(env));
    const walletKeyPair = loadWalletKey(keypair);
    try {
        let { metadataAccount, mint } = await mintNFT(solConnection, walletKeyPair, url);
        console.log("Metadata Account: " + metadataAccount.toString());
        console.log("Mint: " + mint.publicKey.toString());
        return mint.publicKey;
    } catch (e) {
        console.log(e);
    }

}

async function transfer(tokenMintAddress: string, keypair: Keypair, to: string, connection: web3.Connection, amount: number) {
    const mintPublicKey = new web3.PublicKey(tokenMintAddress);
    const mintToken = new Token(
        connection,
        mintPublicKey,
        TOKEN_PROGRAM_ID,
        keypair // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
    );

    updateMetadata(mintPublicKey, connection, keypair, null, true);
    const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
        keypair.publicKey
    );

    const destPublicKey = new web3.PublicKey(to);

    // Get the derived address of the destination wallet which will hold the custom token
    const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintPublicKey,
        destPublicKey
    );

    const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);

    const instructions: web3.TransactionInstruction[] = [];

    if (receiverAccount === null) {

        instructions.push(
            Token.createAssociatedTokenAccountInstruction(
                mintToken.associatedProgramId,
                mintToken.programId,
                mintPublicKey,
                associatedDestinationTokenAddr,
                destPublicKey,
                keypair.publicKey
            )
        )

    }

    instructions.push(
        Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            associatedDestinationTokenAddr,
            keypair.publicKey,
            [keypair],
            amount
        )
    );

    const res0 = await sendTransactionWithRetryWithKeypair(
        connection,
        keypair,
        instructions,
        [keypair]
    );

    try {
        await connection.confirmTransaction(res0.txid, 'max');
    } catch {
        // ignore
    }

    // Force wait for max confirmations
    await connection.getParsedConfirmedTransaction(res0.txid, 'confirmed');
}

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