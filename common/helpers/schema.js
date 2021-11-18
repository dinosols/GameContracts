"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.extendBorsh = exports.decodeBattle = exports.decodeMetadata = exports.BATTLE_SCHEMA = exports.GAME_METADATA_SCHEMA = exports.UpdateStatsArgs = exports.UpdateArgs = exports.SubmitActionArgs = exports.ChooseTeamMemberArgs = exports.JoinBattleArgs = exports.CreateBattleArgs = exports.EnterBattleArgs = exports.CreateGameMetadataArgs = exports.Player = exports.Move = exports.Stats = void 0;
var borsh_1 = require("borsh");
var bs58_1 = __importDefault(require("bs58"));
var web3_js_1 = require("@solana/web3.js");
var borsh_2 = require("@project-serum/borsh");
var buffer_layout_1 = require("buffer-layout");
var Stats = /** @class */ (function () {
    function Stats(args) {
        this.health = args.health;
        this.attack = args.attack;
        this.defense = args.defense;
        this.speed = args.speed;
        this.agility = args.agility;
    }
    return Stats;
}());
exports.Stats = Stats;
var Move = /** @class */ (function () {
    function Move(args) {
        this.move_id = args.move_id;
        this.damage_modifier = args.damage_modifier;
        this.status_effect_chance = args.status_effect_chance;
        this.status_effect = args.status_effect;
    }
    return Move;
}());
exports.Move = Move;
var Player = /** @class */ (function () {
    function Player(args) {
        this.wallet = args.wallet;
        this.team_member0 = args.team_member0;
        this.team_member1 = args.team_member1;
        this.team_member2 = args.team_member2;
        this.current_move = args.current_move;
        this.active_team_member = args.active_team_member;
    }
    return Player;
}());
exports.Player = Player;
var CreateGameMetadataArgs = /** @class */ (function () {
    function CreateGameMetadataArgs(args) {
        this.instruction = 0;
        this.experience = args.experience;
        this.level = args.level;
        this.baseStats = args.baseStats;
        this.levelStats = args.levelStats;
        this.currStats = args.currStats;
        //   //this.moves = [...args.moves];
        this.move0 = args.move0;
        this.move1 = args.move1;
        this.move2 = args.move2;
        this.move3 = args.move3;
    }
    return CreateGameMetadataArgs;
}());
exports.CreateGameMetadataArgs = CreateGameMetadataArgs;
var EnterBattleArgs = /** @class */ (function () {
    function EnterBattleArgs(args) {
        this.instruction = 4;
        this.battle_authority = args.battle_authority;
    }
    return EnterBattleArgs;
}());
exports.EnterBattleArgs = EnterBattleArgs;
var CreateBattleArgs = /** @class */ (function () {
    function CreateBattleArgs(args) {
        this.instruction = 0;
        this.date = args.date;
    }
    return CreateBattleArgs;
}());
exports.CreateBattleArgs = CreateBattleArgs;
var JoinBattleArgs = /** @class */ (function () {
    function JoinBattleArgs(args) {
        this.instruction = 1;
    }
    return JoinBattleArgs;
}());
exports.JoinBattleArgs = JoinBattleArgs;
var ChooseTeamMemberArgs = /** @class */ (function () {
    function ChooseTeamMemberArgs(args) {
        this.instruction = 2;
        this.index = args.index;
    }
    return ChooseTeamMemberArgs;
}());
exports.ChooseTeamMemberArgs = ChooseTeamMemberArgs;
var SubmitActionArgs = /** @class */ (function () {
    function SubmitActionArgs(args) {
        this.instruction = 3;
        this.move = args.move;
    }
    return SubmitActionArgs;
}());
exports.SubmitActionArgs = SubmitActionArgs;
var UpdateArgs = /** @class */ (function () {
    function UpdateArgs(args) {
        this.instruction = 4;
    }
    return UpdateArgs;
}());
exports.UpdateArgs = UpdateArgs;
var UpdateStatsArgs = /** @class */ (function () {
    function UpdateStatsArgs(args) {
        this.instruction = 3;
        this.stats = args.stats;
    }
    return UpdateStatsArgs;
}());
exports.UpdateStatsArgs = UpdateStatsArgs;
exports.GAME_METADATA_SCHEMA = new Map([
    [
        CreateGameMetadataArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['experience', 'u32'],
                ['level', 'u16'],
                ['baseStats', Stats],
                ['levelStats', Stats],
                ['currStats', Stats],
                ['move0', Move],
                ['move1', Move],
                ['move2', Move],
                ['move3', Move],
            ]
        },
    ],
    [
        UpdateStatsArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['stats', Stats],
            ]
        },
    ],
    [
        EnterBattleArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['battle_authority', 'pubkeyAsString']
            ]
        },
    ],
    [
        Stats,
        {
            kind: 'struct',
            fields: [
                ['health', 'u16'],
                ['attack', 'u16'],
                ['defense', 'u16'],
                ['speed', 'u16'],
                ['agility', 'u16']
            ]
        },
    ],
    [
        Move,
        {
            kind: 'struct',
            fields: [
                ['move_id', 'u8'],
                ['damage_modifier', 'u8'],
                ['status_effect_chance', 'u8'],
                ['status_effect', 'u8']
            ]
        },
    ],
]);
exports.BATTLE_SCHEMA = new Map([
    [
        CreateBattleArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['date', 'string'],
            ]
        },
    ],
    [
        JoinBattleArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
            ]
        },
    ],
    [
        ChooseTeamMemberArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['index', 'u8'],
            ]
        },
    ],
    [
        SubmitActionArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['move', Move],
            ]
        }
    ],
    [
        UpdateArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
            ]
        }
    ],
    [
        Move,
        {
            kind: 'struct',
            fields: [
                ['move_id', 'u8'],
                ['damage_modifier', 'u8'],
                ['status_effect_chance', 'u8'],
                ['status_effect', 'u8']
            ]
        },
    ],
]);
var STATS_LAYOUT = (0, borsh_2.struct)([
    (0, buffer_layout_1.u16)('health'),
    (0, buffer_layout_1.u16)('attack'),
    (0, buffer_layout_1.u16)('defense'),
    (0, buffer_layout_1.u16)('speed'),
    (0, buffer_layout_1.u16)('agility'),
]);
var MOVE_LAYOUT = (0, borsh_2.struct)([
    (0, borsh_2.u8)('move_id'),
    (0, borsh_2.u8)('damage_modifier'),
    (0, borsh_2.u8)('status_effect_chance'),
    (0, borsh_2.u8)('status_effect'),
]);
var PLAYER_LAYOUT = (0, borsh_2.struct)([
    (0, borsh_2.publicKey)('wallet'),
    (0, borsh_2.publicKey)('team_member0'),
    (0, borsh_2.publicKey)('team_member1'),
    (0, borsh_2.publicKey)('team_member2'),
    MOVE_LAYOUT.replicate('current_move'),
    (0, borsh_2.u8)('active_team_member'),
]);
var METADATA_LAYOUT = (0, borsh_2.struct)([
    (0, borsh_2.publicKey)('updateAuthority'),
    (0, borsh_2.publicKey)('playerAuthority'),
    (0, borsh_2.publicKey)('battleAuthority'),
    (0, buffer_layout_1.u32)('experience'),
    (0, buffer_layout_1.u16)('level'),
    STATS_LAYOUT.replicate('baseStats'),
    STATS_LAYOUT.replicate('levelStats'),
    STATS_LAYOUT.replicate('currStats'),
    //u16('padding'),
    MOVE_LAYOUT.replicate('move0'),
    MOVE_LAYOUT.replicate('move1'),
    MOVE_LAYOUT.replicate('move2'),
    MOVE_LAYOUT.replicate('move3'),
]);
var BATTLE_LAYOUT = (0, borsh_2.struct)([
    (0, borsh_2.str)('date'),
    (0, borsh_2.publicKey)('updateAuthority'),
    PLAYER_LAYOUT.replicate("player_1"),
    PLAYER_LAYOUT.replicate("player_2"),
    (0, borsh_2.u8)("status"),
    (0, borsh_2.u8)('roundNumber'),
]);
// eslint-disable-next-line no-control-regex
var METADATA_REPLACE = new RegExp('\u0000', '');
function decodeMetadata(buffer) {
    var metadata = METADATA_LAYOUT.decode(buffer);
    metadata.updateAuthority = metadata.updateAuthority.toString();
    metadata.playerAuthority = metadata.playerAuthority.toString();
    metadata.battleAuthority = metadata.battleAuthority.toString();
    return metadata;
}
exports.decodeMetadata = decodeMetadata;
;
// eslint-disable-next-line no-control-regex
var BATTLE_REPLACE = new RegExp('\u0000', 'g');
function decodeBattle(buffer) {
    var battle = BATTLE_LAYOUT.decode(buffer);
    battle.date = battle.date.replace(BATTLE_REPLACE, '');
    // battle.updateAuthority = battle.updateAuthority;
    // battle.player1.wallet = battle.player1.wallet;
    // battle.player1.teamMember0 = battle.player1.teamMember0;
    // battle.player1.teamMember1 = battle.player1.teamMember1;
    // battle.player1.teamMember2 = battle.player1.teamMember2;
    // battle.player2.wallet = battle.player2.wallet;
    // battle.player2.teamMember0 = battle.player2.teamMember0;
    // battle.player2.teamMember1 = battle.player2.teamMember1;
    // battle.player2.teamMember2 = battle.player2.teamMember2;
    battle.date = battle.date.replace(BATTLE_REPLACE, '');
    return battle;
}
exports.decodeBattle = decodeBattle;
;
var extendBorsh = function () {
    borsh_1.BinaryReader.prototype.readPubkey = function () {
        var reader = this;
        var array = reader.readFixedArray(32);
        return new web3_js_1.PublicKey(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkey = function (value) {
        var writer = this;
        writer.writeFixedArray(value.toBuffer());
    };
    borsh_1.BinaryReader.prototype.readPubkeyAsString = function () {
        var reader = this;
        var array = reader.readFixedArray(32);
        return bs58_1["default"].encode(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkeyAsString = function (value) {
        var writer = this;
        writer.writeFixedArray(bs58_1["default"].decode(value));
    };
};
exports.extendBorsh = extendBorsh;
(0, exports.extendBorsh)();
