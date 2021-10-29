import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction,
} from '@solana/web3.js';
//import {
//     CANDY_MACHINE_PROGRAM_ID,
//     CONFIG_ARRAY_START,
//     CONFIG_LINE_SIZE,
//    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
//    TOKEN_PROGRAM_ID,
//     TOKEN_METADATA_PROGRAM_ID,
//} from './constants';
import * as anchor from '@project-serum/anchor';

export function createBattleInstruction(
    battleAccount: PublicKey,
    game: PublicKey,
    playerAccount: PublicKey,
    payer: PublicKey,
    updateAuthority: PublicKey,
    txnData: Buffer,
    battle_program_id,
) {
    const keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: game,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: updateAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new TransactionInstruction({
        keys,
        programId: battle_program_id,
        data: txnData,
    });
}