"use strict";
exports.__esModule = true;
exports.updateInstruction = exports.submitActionInstruction = exports.chooseTeamMemberInstruction = exports.joinBattleInstruction = exports.createBattleInstruction = exports.enterBattleInstruction = exports.updateStatsInstruction = exports.createGameMetadataInstruction = exports.createAssociatedTokenAccountInstruction = void 0;
var web3_js_1 = require("@solana/web3.js");
var constants_1 = require("./constants");
function createAssociatedTokenAccountInstruction(associatedTokenAddress, payer, walletAddress, splTokenMintAddress) {
    var keys = [
        {
            pubkey: payer,
            isSigner: true,
            isWritable: true
        },
        {
            pubkey: associatedTokenAddress,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: walletAddress,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: splTokenMintAddress,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: constants_1.TOKEN_PROGRAM_ID,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: constants_1.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([])
    });
}
exports.createAssociatedTokenAccountInstruction = createAssociatedTokenAccountInstruction;
function createGameMetadataInstruction(metadataAccount, mint, playerAuthority, payer, updateAuthority, txnData, game_metadata_program_id) {
    var keys = [
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: mint,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: playerAuthority,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: updateAuthority,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: game_metadata_program_id,
        data: txnData
    });
}
exports.createGameMetadataInstruction = createGameMetadataInstruction;
function updateStatsInstruction(metadataAccount, 
//mint: PublicKey,
//playerAuthority: PublicKey,
payer, 
//updateAuthority: PublicKey,
txnData, game_metadata_program_id) {
    var keys = [
        {
            pubkey: game_metadata_program_id,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true
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
            isWritable: false
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
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: game_metadata_program_id,
        data: txnData
    });
}
exports.updateStatsInstruction = updateStatsInstruction;
function enterBattleInstruction(playerAccount, metadataAccount, payer, txnData, game_metadata_program_id) {
    var keys = [
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: game_metadata_program_id,
        data: txnData
    });
}
exports.enterBattleInstruction = enterBattleInstruction;
function createBattleInstruction(battleAccount, game, playerAccount, payer, updateAuthority, txnData, battle_program_id) {
    var keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: game,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: updateAuthority,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: battle_program_id,
        data: txnData
    });
}
exports.createBattleInstruction = createBattleInstruction;
function joinBattleInstruction(battleAccount, playerAccount, teamMember0, teamMember1, teamMember2, payer, txnData, battle_program_id) {
    var keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: teamMember0,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: teamMember1,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: teamMember2,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: battle_program_id,
        data: txnData
    });
}
exports.joinBattleInstruction = joinBattleInstruction;
function chooseTeamMemberInstruction(battleAccount, playerAccount, payer, txnData, battle_program_id) {
    var keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: battle_program_id,
        data: txnData
    });
}
exports.chooseTeamMemberInstruction = chooseTeamMemberInstruction;
function submitActionInstruction(battleAccount, playerAccount, playerTeamMember, opponentTeamMember, metadataProgramID, payer, txnData, battle_program_id) {
    var keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: playerAccount,
            isSigner: true,
            isWritable: false
        },
        {
            pubkey: playerTeamMember,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: opponentTeamMember,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: metadataProgramID,
            isSigner: false,
            isWritable: false
        },
        {
            pubkey: payer,
            isSigner: false,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: battle_program_id,
        data: txnData
    });
}
exports.submitActionInstruction = submitActionInstruction;
function updateInstruction(battleAccount, playerTeamMember, opponentTeamMember, 
//metadataProgramID: PublicKey,
player, txnData, battle_program_id) {
    var keys = [
        {
            pubkey: battleAccount,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: playerTeamMember,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: opponentTeamMember,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: player,
            isSigner: false,
            isWritable: false
        },
    ];
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: battle_program_id,
        data: txnData
    });
}
exports.updateInstruction = updateInstruction;
