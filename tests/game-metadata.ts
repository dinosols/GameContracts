
const anchor = require('@project-serum/anchor');
const assert = require('assert');
import {
    // createAssociatedTokenAccountInstruction,
    createGameMetadataInstruction,
} from '../common/helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from '../common/helpers/transactions';
import {
    // getTokenWallet,
    getMetadataPDA,
    mintToken,
    //getGameMetadata,
} from '../common/helpers/accounts';
import {
    Stats,
    Move,
    CreateGameMetadataArgs,
    //     CreateMasterEditionArgs,
    //GameMetadataInfo,
    GAME_METADATA_SCHEMA,
    decodeMetadata,
} from '../common/helpers/schema';
import { serialize } from 'borsh';
// import { TOKEN_PROGRAM_ID } from '../common/helpers/constants';
//import fetch from 'node-fetch';
// import { MintLayout, Token } from '@solana/spl-token';
import {
    // Keypair,
    // Connection,
    // SystemProgram,
    TransactionInstruction,
    //PublicKey,
} from '@solana/web3.js';
// import BN from 'bn.js';
// import log from 'loglevel';

describe('game-metadata', () => {

    // Configure the client to use the local cluster.
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.GameMetadata;

    let mint = null;
    // @ts-ignore

    it('Mint Token', async () => {
        // Allocate memory for the account
        mint = await mintToken(provider, provider.wallet.payer);
    });

    it('Create Game Metadata', async () => {
        let instructions: TransactionInstruction[] = [];

        // Create metadata
        const metadataAccount = await getMetadataPDA(mint.publicKey, program.programId);

        const baseStats = new Stats({
            health: -3.031648825209398712132724540424533188343048095703125E-13,
            attack: -3.031648825209398712132724540424533188343048095703125E-13,
            defense: -3.031648825209398712132724540424533188343048095703125E-13,
            speed: -3.031648825209398712132724540424533188343048095703125E-13,
            agility: -3.031648825209398712132724540424533188343048095703125E-13,
            rage_points: -3.031648825209398712132724540424533188343048095703125E-13,
        });

        const levelStats = new Stats({
            health: -0.0057291663251817226409912109375,
            attack: -0.0057291663251817226409912109375,
            defense: -0.0057291663251817226409912109375,
            speed: -0.0057291663251817226409912109375,
            agility: -0.0057291663251817226409912109375,
            rage_points: -0.0057291663251817226409912109375,
        });

        const currStats = new Stats({
            health: -107374176,
            attack: -107374176,
            defense: -107374176,
            speed: -107374176,
            agility: -107374176,
            rage_points: -107374176,
        });

        const moves = [];
        moves.push(new Move({
            move_name: "Bite",
            stats_modifier: new Stats({ health: 0, attack: 1, defense: 2, speed: 4, agility: 5, rage_points: 6 }),
            move_speed: 2,
            status_effect: 1,
            status_effect_chance: 2,
        }));
        moves.push(new Move({
            move_name: "Stomp",
            stats_modifier: new Stats({ health: 0, attack: 1, defense: 2, speed: 4, agility: 5, rage_points: 6 }),
            move_speed: 2,
            status_effect: 1,
            status_effect_chance: 2,
        }));
        moves.push(new Move({
            move_name: "",
            stats_modifier: new Stats({ health: 0, attack: 1, defense: 2, speed: 4, agility: 5, rage_points: 6 }),
            move_speed: 2,
            status_effect: 1,
            status_effect_chance: 2,
        }));
        moves.push(new Move({
            move_name: "",
            stats_modifier: new Stats({ health: 0, attack: 1, defense: 2, speed: 4, agility: 5, rage_points: 6 }),
            move_speed: 2,
            status_effect: 1,
            status_effect_chance: 2,
        }));

        const gameMetadataArgs =
            new CreateGameMetadataArgs({
                experience: 4294967295,
                level: 65535,
                baseStats: baseStats,
                levelStats: levelStats,
                currStats: currStats,
                status_effect: 0,
                moves: [...moves],
            });

        let txnData = Buffer.from(
            serialize(
                GAME_METADATA_SCHEMA,
                gameMetadataArgs,
            ),
        );

        //console.log(gameMetadataArgs);
        //console.log(JSON.stringify(txnData));

        instructions.push(
            createGameMetadataInstruction(
                metadataAccount,
                mint.publicKey,
                provider.wallet.publicKey,
                provider.wallet.publicKey,
                provider.wallet.publicKey,
                txnData,
                program.programId,
            ),
        );

        const res = await sendTransactionWithRetryWithKeypair(
            provider.connection,
            provider.wallet.payer,
            instructions,
            [provider.wallet.payer],
        );

        try {
            await provider.connection.confirmTransaction(res.txid, 'max');
        } catch {
            // ignore
        }

        // Force wait for max confirmations
        await provider.connection.getParsedConfirmedTransaction(res.txid, 'confirmed');

        const metadataAccountInfo = await provider.connection.getAccountInfo(metadataAccount);
        const metadata = decodeMetadata(metadataAccountInfo.data);
        console.log(metadata);

        assert.ok(metadata.updateAuthority === provider.wallet.publicKey.toString());
        assert.ok(metadata.playerAuthority === provider.wallet.publicKey.toString());
        assert.ok(Object.entries(metadata.baseStats).toString() === Object.entries(baseStats).toString());
        assert.ok(Object.entries(metadata.levelStats).toString() === Object.entries(levelStats).toString());
        assert.ok(Object.entries(metadata.currStats).toString() === Object.entries(currStats).toString());
        for (let i = 0; i < metadata.moves.length; i++) {
            assert.ok(Object.entries(metadata.moves[i]).toString() === Object.entries(moves[i]).toString());
        }
    });

    it('Update Game Metadata', async () => {

    })
});
