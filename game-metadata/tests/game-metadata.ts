
const anchor = require('@project-serum/anchor');
const assert = require('assert');
import {
    createAssociatedTokenAccountInstruction,
    createGameMetadataInstruction,
} from './helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from './helpers/transactions';
import {
    getTokenWallet,
    getMetadataPDA,
    //getGameMetadata,
} from './helpers/accounts';
import {
    Stats,
    Move,
    CreateGameMetadataArgs,
    //     CreateMasterEditionArgs,
    //GameMetadataInfo,
    GAME_METADATA_SCHEMA,
    decodeMetadata,
} from './helpers/schema';
import { serialize } from 'borsh';
import { TOKEN_PROGRAM_ID } from './helpers/constants';
//import fetch from 'node-fetch';
import { MintLayout, Token } from '@solana/spl-token';
import {
    Keypair,
    Connection,
    SystemProgram,
    TransactionInstruction,
    PublicKey,
} from '@solana/web3.js';
import BN from 'bn.js';
import log from 'loglevel';

describe('game-metadata', () => {

    // Configure the client to use the local cluster.
    const provider = anchor.Provider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.GameMetadata;

    let mint = null;
    let instructions: TransactionInstruction[] = [];

    let userTokenAccountAddress = null;
    let signers: anchor.web3.Keypair[]

    it('Mint Token', async () => {
        // Allocate memory for the account
        const mintRent = await provider.connection.getMinimumBalanceForRentExemption(
            MintLayout.span,
        );

        // Generate a mint
        mint = anchor.web3.Keypair.generate();
        signers = [mint, provider.wallet.payer];

        instructions.push(
            SystemProgram.createAccount({
                fromPubkey: provider.wallet.publicKey,
                newAccountPubkey: mint.publicKey,
                lamports: mintRent,
                space: MintLayout.span,
                programId: TOKEN_PROGRAM_ID,
            }),
        );
        instructions.push(
            Token.createInitMintInstruction(
                TOKEN_PROGRAM_ID,
                mint.publicKey,
                0,
                provider.wallet.publicKey,
                provider.wallet.publicKey,
            ),
        );

        userTokenAccountAddress = await getTokenWallet(
            provider.wallet.publicKey,
            mint.publicKey,
        );
        instructions.push(
            createAssociatedTokenAccountInstruction(
                userTokenAccountAddress,
                provider.wallet.publicKey,
                provider.wallet.publicKey,
                mint.publicKey,
            ),
        );
    });

    it('Create Game Metadata', async () => {
        // Create metadata
        const metadataAccount = await getMetadataPDA(mint.publicKey, program.programId);

        const baseStats = new Stats({
            experience: 0,
            level: 1,

            health: 2,
            attack: 3,
            defense: 4,
            speed: 5,
            agility: 6,
        });

        const currStats = new Stats({
            experience: 0,
            level: 1,

            health: 2,
            attack: 3,
            defense: 4,
            speed: 5,
            agility: 6,
        });

        const move0 = new Move({
            move_id: 0,
            damage_modifier: 1,
            status_effect_chance: 2,
            status_effect: 0,
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
            status_effect: 0,
        });

        const gameMetadataArgs =
            new CreateGameMetadataArgs({
                baseStats: baseStats,
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

        instructions.push(
            Token.createMintToInstruction(
                TOKEN_PROGRAM_ID,
                mint.publicKey,
                userTokenAccountAddress,
                provider.wallet.publicKey,
                [],
                1,
            ),
        );

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
        log.info('NFT created', res.txid);

        //console.log(metadataAccount.toString());
        const metadataAccountInfo = await provider.connection.getAccountInfo(metadataAccount);
        //console.log(metadataAccountInfo.toString());
        const metadata = decodeMetadata(metadataAccountInfo.data);
        assert.ok(metadata.updateAuthority === provider.wallet.publicKey.toString());
        assert.ok(metadata.playerAuthority === provider.wallet.publicKey.toString());
        //console.log(metadata.baseStats);
        //console.log(baseStats);
        assert.ok(Object.entries(metadata.baseStats).toString() === Object.entries(baseStats).toString());
        assert.ok(Object.entries(metadata.currStats).toString() === Object.entries(currStats).toString());
        assert.ok(Object.entries(metadata.move0).toString() === Object.entries(move0).toString());
        assert.ok(Object.entries(metadata.move1).toString() === Object.entries(move1).toString());
        assert.ok(Object.entries(metadata.move2).toString() === Object.entries(move2).toString());
        assert.ok(Object.entries(metadata.move3).toString() === Object.entries(move3).toString());

        console.log(metadata);
    });

    it('Update Game Metadata', async () => {

    })
});
