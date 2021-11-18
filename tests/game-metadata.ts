
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
        mint = await mintToken(provider, provider.wallet.publicKey);
    });

    it('Create Game Metadata', async () => {
        let instructions: TransactionInstruction[] = [];

        // Create metadata
        const metadataAccount = await getMetadataPDA(mint.publicKey, program.programId);

        const baseStats = new Stats({
            health: 2,
            attack: 3,
            defense: 4,
            speed: 5,
            agility: 6,
        });

        const levelStats = new Stats({
            health: 2,
            attack: 3,
            defense: 4,
            speed: 5,
            agility: 6,
        });

        const currStats = new Stats({
            health: 2,
            attack: 3,
            defense: 4,
            speed: 5,
            agility: 6,
        });

        const move0 = new Move({
            move_id: 2,
            damage_modifier: 1,
            status_effect_chance: 2,
            status_effect: 2,
        });
        const move1 = new Move({
            move_id: 1,
            damage_modifier: 2,
            status_effect_chance: 3,
            status_effect: 1,
        });
        const move2 = new Move({
            move_id: 2,
            damage_modifier: 3,
            status_effect_chance: 4,
            status_effect: 2,
        });
        const move3 = new Move({
            move_id: 3,
            damage_modifier: 4,
            status_effect_chance: 5,
            status_effect: 1,
        });

        const gameMetadataArgs =
            new CreateGameMetadataArgs({
                experience: 4294967295,
                level: 65535,
                baseStats: baseStats,
                levelStats: levelStats,
                currStats: currStats,
                move0: move0,
                move1: move1,
                move2: move2,
                move3: move3
            });

        let txnData = Buffer.from(
            serialize(
                GAME_METADATA_SCHEMA,
                gameMetadataArgs,
            ),
        );

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
        assert.ok(Object.entries(metadata.move0).toString() === Object.entries(move0).toString());
        assert.ok(Object.entries(metadata.move1).toString() === Object.entries(move1).toString());
        assert.ok(Object.entries(metadata.move2).toString() === Object.entries(move2).toString());
        assert.ok(Object.entries(metadata.move3).toString() === Object.entries(move3).toString());
    });

    it('Update Game Metadata', async () => {

    })
});
