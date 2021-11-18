"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createRandomGameMetadataArgs = exports.mintToken = exports.getBattlePDA = exports.getMetadataPDA = exports.getTokenWallet = void 0;
var web3_js_1 = require("@solana/web3.js");
var instructions_1 = require("./instructions");
var transactions_1 = require("./transactions");
var constants_1 = require("./constants");
var schema_1 = require("./schema");
var spl_token_1 = require("@solana/spl-token");
// import { GameMetadataInfo, GameMetadataLayout, } from './schema';
var anchor = __importStar(require("@project-serum/anchor"));
var getTokenWallet = function (wallet, mint) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3_js_1.PublicKey.findProgramAddress([wallet.toBuffer(), constants_1.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], constants_1.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID)];
                case 1: return [2 /*return*/, (_a.sent())[0]];
            }
        });
    });
};
exports.getTokenWallet = getTokenWallet;
var getMetadataPDA = function (mint, token_game_metadata_program_id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([
                    Buffer.from('gamemeta'),
                    token_game_metadata_program_id.toBuffer(),
                    mint.toBuffer(),
                ], token_game_metadata_program_id)];
            case 1: return [2 /*return*/, (_a.sent())[0]];
        }
    });
}); };
exports.getMetadataPDA = getMetadataPDA;
var getBattlePDA = function (player, battle_program_id, dateString) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, anchor.web3.PublicKey.findProgramAddress([
                    Buffer.from('battle'),
                    battle_program_id.toBuffer(),
                    player.toBuffer(),
                    Buffer.from(dateString),
                ], battle_program_id)];
            case 1: return [2 /*return*/, (_a.sent())[0]];
        }
    });
}); };
exports.getBattlePDA = getBattlePDA;
// @ts-ignore
function mintToken(provider, mintOwner) {
    return __awaiter(this, void 0, void 0, function () {
        var instructions, signers, mintRent, mint, userTokenAccountAddress, res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    instructions = [];
                    return [4 /*yield*/, provider.connection.getMinimumBalanceForRentExemption(spl_token_1.MintLayout.span)];
                case 1:
                    mintRent = _b.sent();
                    mint = anchor.web3.Keypair.generate();
                    instructions.push(web3_js_1.SystemProgram.createAccount({
                        fromPubkey: mintOwner,
                        newAccountPubkey: mint.publicKey,
                        lamports: mintRent,
                        space: spl_token_1.MintLayout.span,
                        programId: constants_1.TOKEN_PROGRAM_ID
                    }));
                    instructions.push(spl_token_1.Token.createInitMintInstruction(constants_1.TOKEN_PROGRAM_ID, mint.publicKey, 0, mintOwner, mintOwner));
                    return [4 /*yield*/, (0, exports.getTokenWallet)(mintOwner, mint.publicKey)];
                case 2:
                    userTokenAccountAddress = _b.sent();
                    instructions.push((0, instructions_1.createAssociatedTokenAccountInstruction)(userTokenAccountAddress, mintOwner, mintOwner, mint.publicKey));
                    instructions.push(spl_token_1.Token.createMintToInstruction(constants_1.TOKEN_PROGRAM_ID, mint.publicKey, userTokenAccountAddress, mintOwner, [], 1));
                    return [4 /*yield*/, (0, transactions_1.sendTransactionWithRetryWithKeypair)(provider.connection, 
                        // @ts-ignore
                        provider.wallet.payer, instructions, [mint])];
                case 3:
                    res = _b.sent();
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, provider.connection.confirmTransaction(res.txid, 'max')];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _a = _b.sent();
                    return [3 /*break*/, 7];
                case 7: 
                // Force wait for max confirmations
                return [4 /*yield*/, provider.connection.getParsedConfirmedTransaction(res.txid, 'confirmed')];
                case 8:
                    // Force wait for max confirmations
                    _b.sent();
                    return [2 /*return*/, mint];
            }
        });
    });
}
exports.mintToken = mintToken;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var createRandomGameMetadataArgs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var baseStats, levelStats, currStats, move0, move1, move2, move3, gameMetadataArgs;
    return __generator(this, function (_a) {
        baseStats = new schema_1.Stats({
            health: getRandomInt(10) + 1,
            attack: getRandomInt(5) + 1,
            defense: getRandomInt(5) + 1,
            speed: getRandomInt(5) + 1,
            agility: getRandomInt(5) + 1
        });
        levelStats = new schema_1.Stats(JSON.parse(JSON.stringify(baseStats)));
        currStats = new schema_1.Stats(JSON.parse(JSON.stringify(baseStats)));
        move0 = new schema_1.Move({
            move_id: getRandomInt(13) + 1,
            damage_modifier: getRandomInt(5),
            status_effect_chance: getRandomInt(10),
            status_effect: getRandomInt(3)
        });
        move1 = new schema_1.Move({
            move_id: getRandomInt(14),
            damage_modifier: getRandomInt(5),
            status_effect_chance: getRandomInt(10),
            status_effect: getRandomInt(3)
        });
        move2 = new schema_1.Move({
            move_id: getRandomInt(14),
            damage_modifier: getRandomInt(5),
            status_effect_chance: getRandomInt(10),
            status_effect: getRandomInt(3)
        });
        move3 = new schema_1.Move({
            move_id: getRandomInt(14),
            damage_modifier: getRandomInt(5),
            status_effect_chance: getRandomInt(10),
            status_effect: getRandomInt(3)
        });
        gameMetadataArgs = new schema_1.CreateGameMetadataArgs({
            experience: 0,
            level: 1,
            baseStats: baseStats,
            levelStats: levelStats,
            currStats: currStats,
            move0: move0,
            move1: move1,
            move2: move2,
            move3: move3
        });
        return [2 /*return*/, gameMetadataArgs];
    });
}); };
exports.createRandomGameMetadataArgs = createRandomGameMetadataArgs;
