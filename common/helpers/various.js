"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getMetadata = exports.generateRandoms = exports.chunks = exports.getMultipleAccounts = exports.parseDate = exports.parsePrice = exports.fromUTF8Array = exports.sleep = exports.getUnixTs = exports.generateRandomSet = void 0;
var web3_js_1 = require("@solana/web3.js");
var weighted_1 = __importDefault(require("weighted"));
var path_1 = __importDefault(require("path"));
//const { readFile } = fs.promises;
// export async function readJsonFile(fileName: string) {
//   const file = await readFile(fileName, 'utf-8');
//   return JSON.parse(file);
//}
var generateRandomSet = function (breakdown) {
    var tmp = {};
    Object.keys(breakdown).forEach(function (attr) {
        var randomSelection = weighted_1["default"].select(breakdown[attr]);
        tmp[attr] = randomSelection;
    });
    return tmp;
};
exports.generateRandomSet = generateRandomSet;
var getUnixTs = function () {
    return new Date().getTime() / 1000;
};
exports.getUnixTs = getUnixTs;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.sleep = sleep;
function fromUTF8Array(data) {
    // array of bytes
    var str = '', i;
    for (i = 0; i < data.length; i++) {
        var value = data[i];
        if (value < 0x80) {
            str += String.fromCharCode(value);
        }
        else if (value > 0xbf && value < 0xe0) {
            str += String.fromCharCode(((value & 0x1f) << 6) | (data[i + 1] & 0x3f));
            i += 1;
        }
        else if (value > 0xdf && value < 0xf0) {
            str += String.fromCharCode(((value & 0x0f) << 12) |
                ((data[i + 1] & 0x3f) << 6) |
                (data[i + 2] & 0x3f));
            i += 2;
        }
        else {
            // surrogate pair
            var charCode = (((value & 0x07) << 18) |
                ((data[i + 1] & 0x3f) << 12) |
                ((data[i + 2] & 0x3f) << 6) |
                (data[i + 3] & 0x3f)) -
                0x010000;
            str += String.fromCharCode((charCode >> 10) | 0xd800, (charCode & 0x03ff) | 0xdc00);
            i += 3;
        }
    }
    return str;
}
exports.fromUTF8Array = fromUTF8Array;
function parsePrice(price, mantissa) {
    if (mantissa === void 0) { mantissa = web3_js_1.LAMPORTS_PER_SOL; }
    return Math.ceil(parseFloat(price) * mantissa);
}
exports.parsePrice = parsePrice;
function parseDate(date) {
    if (date === 'now') {
        return Date.now() / 1000;
    }
    return Date.parse(date) / 1000;
}
exports.parseDate = parseDate;
var getMultipleAccounts = function (connection, keys, commitment) { return __awaiter(void 0, void 0, void 0, function () {
    var result, array;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(chunks(keys, 99).map(function (chunk) {
                    return getMultipleAccountsCore(connection, chunk, commitment);
                }))];
            case 1:
                result = _a.sent();
                array = result
                    .map(function (a) {
                    //@ts-ignore
                    return a.array.map(function (acc) {
                        if (!acc) {
                            return undefined;
                        }
                        var data = acc.data, rest = __rest(acc, ["data"]);
                        var obj = __assign(__assign({}, rest), { data: Buffer.from(data[0], 'base64') });
                        return obj;
                    });
                })
                    //@ts-ignore
                    .flat();
                return [2 /*return*/, { keys: keys, array: array }];
        }
    });
}); };
exports.getMultipleAccounts = getMultipleAccounts;
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map(function (_, index) { return array.slice(index * size, (index + 1) * size); });
}
exports.chunks = chunks;
function generateRandoms(numberOfAttrs, total) {
    if (numberOfAttrs === void 0) { numberOfAttrs = 1; }
    if (total === void 0) { total = 100; }
    var numbers = [];
    var loose_percentage = total / numberOfAttrs;
    for (var i = 0; i < numberOfAttrs; i++) {
        var random = Math.floor(Math.random() * loose_percentage) + 1;
        numbers.push(random);
    }
    var sum = numbers.reduce(function (prev, cur) {
        return prev + cur;
    }, 0);
    numbers.push(total - sum);
    return numbers;
}
exports.generateRandoms = generateRandoms;
var getMetadata = function (name, symbol, index, creators, description, seller_fee_basis_points, attrs, collection) {
    if (name === void 0) { name = ''; }
    if (symbol === void 0) { symbol = ''; }
    if (index === void 0) { index = 0; }
    if (description === void 0) { description = ''; }
    if (seller_fee_basis_points === void 0) { seller_fee_basis_points = 500; }
    var attributes = [];
    for (var prop in attrs) {
        attributes.push({
            trait_type: prop,
            value: path_1["default"].parse(attrs[prop]).name
        });
    }
    return {
        name: "" + name + (index + 1),
        symbol: symbol,
        image: index + ".png",
        properties: {
            files: [
                {
                    uri: index + ".png",
                    type: 'image/png'
                },
            ],
            category: 'image',
            creators: creators
        },
        description: description,
        seller_fee_basis_points: seller_fee_basis_points,
        attributes: attributes,
        collection: collection
    };
};
exports.getMetadata = getMetadata;
var getMultipleAccountsCore = function (connection, keys, commitment) { return __awaiter(void 0, void 0, void 0, function () {
    var args, unsafeRes, array;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = connection._buildArgs([keys], commitment, 'base64');
                return [4 /*yield*/, connection._rpcRequest('getMultipleAccounts', args)];
            case 1:
                unsafeRes = _a.sent();
                if (unsafeRes.error) {
                    throw new Error('failed to get info about account ' + unsafeRes.error.message);
                }
                if (unsafeRes.result.value) {
                    array = unsafeRes.result.value;
                    return [2 /*return*/, { keys: keys, array: array }];
                }
                // TODO: fix
                throw new Error();
        }
    });
}); };
