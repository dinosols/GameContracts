import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction,
    VOTE_PROGRAM_ID,
} from '@solana/web3.js';
import {
//     CANDY_MACHINE_PROGRAM_ID,
//     CONFIG_ARRAY_START,
//     CONFIG_LINE_SIZE,
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
//     TOKEN_METADATA_PROGRAM_ID,
} from './constants';
import * as anchor from '@project-serum/anchor';

export function createAssociatedTokenAccountInstruction(
    associatedTokenAddress: PublicKey,
    payer: PublicKey,
    walletAddress: PublicKey,
    splTokenMintAddress: PublicKey,
  ) {
    const keys = [
      {
        pubkey: payer,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: associatedTokenAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: walletAddress,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: splTokenMintAddress,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID,
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
      programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      data: Buffer.from([]),
    });
  }

export function createGameMetadataInstruction(
    metadataAccount: PublicKey,
    mint: PublicKey,
    playerAuthority: PublicKey,
    payer: PublicKey,
    updateAuthority: PublicKey,
    txnData: Buffer,
    game_metadata_program_id: PublicKey,
) {
    const keys = [
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: mint,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: playerAuthority,
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
        programId: game_metadata_program_id,
        data: txnData,
    });
}

export function updateStatsInstruction(
    metadataAccount: PublicKey,
    //mint: PublicKey,
    //playerAuthority: PublicKey,
    payer: PublicKey,
    //updateAuthority: PublicKey,
    txnData: Buffer,
    game_metadata_program_id: PublicKey,
) {
    const keys = [
        {
            pubkey: game_metadata_program_id,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true,
        },
        /*{
            pubkey: mint,
            isSigner: false,
            isWritable: false,
        },*/
        /*{
            pubkey: playerAuthority,
            isSigner: true,
            isWritable: false,
        },*/
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        /*{
            pubkey: updateAuthority,
            isSigner: false,
            isWritable: false,
        },*/
        /*
        {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },*/
    ];
    return new TransactionInstruction({
        keys,
        programId: game_metadata_program_id,
        data: txnData,
    });
}

export function enterBattleInstruction(
    playerAccount: PublicKey,
    metadataAccount: PublicKey,
    payer: PublicKey,
    txnData: Buffer,
    game_metadata_program_id: PublicKey,
) {
    const keys = [
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
    ];
    return new TransactionInstruction({
        keys,
        programId: game_metadata_program_id,
        data: txnData,
    });
}

export function createBattleInstruction(
    battleAccount: PublicKey,
    game: PublicKey,
    playerAccount: PublicKey,
    payer: PublicKey,
    updateAuthority: PublicKey,
    txnData: Buffer,
    battle_program_id: PublicKey,
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

export function joinBattleInstruction(
    battleAccount: PublicKey,
    playerAccount: PublicKey,
    teamMember0: PublicKey,
    teamMember1: PublicKey,
    teamMember2: PublicKey,
    payer: PublicKey,
    txnData: Buffer,
    battle_program_id: PublicKey,
) {
    const keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: teamMember0,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: teamMember1,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: teamMember2,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: SystemProgram.programId,
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

export function chooseTeamMemberInstruction(
    battleAccount: PublicKey,
    playerAccount: PublicKey,
    payer: PublicKey,
    txnData: Buffer,
    battle_program_id: PublicKey,
) {
    const keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true,
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
    ];
    return new TransactionInstruction({
        keys,
        programId: battle_program_id,
        data: txnData,
    });
}

export function submitActionInstruction(
    battleAccount: PublicKey,
    playerAccount: PublicKey,
    playerTeamMember: PublicKey,
    opponentTeamMember: PublicKey,
    metadataProgramID: PublicKey,
    payer: PublicKey,
    txnData: Buffer,
    battle_program_id: PublicKey,
) {
    const keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: playerTeamMember,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: opponentTeamMember,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: metadataProgramID,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: payer,
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

export function updateInstruction(
    battleAccount: PublicKey,
    playerTeamMember: PublicKey,
    opponentTeamMember: PublicKey,
    //metadataProgramID: PublicKey,
    player: PublicKey,
    txnData: Buffer,
    battle_program_id: PublicKey,
) {
    const keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: playerTeamMember,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: opponentTeamMember,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: player,
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