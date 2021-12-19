"use strict";
exports.__esModule = true;
exports.DEFAULT_TIMEOUT = exports.TOKEN_PROGRAM_ID = exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = exports.ARWEAVE_PAYMENT_WALLET = void 0;
var web3_js_1 = require("@solana/web3.js");
exports.ARWEAVE_PAYMENT_WALLET = new web3_js_1.PublicKey('HvwC9QSAzvGXhhVrgPmauVwFWcYZhne3hVot9EbHuFTm');
// export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
//   'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
// );
exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
exports.TOKEN_PROGRAM_ID = new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
exports.DEFAULT_TIMEOUT = 30000;
