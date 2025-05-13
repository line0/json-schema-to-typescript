"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOnly = hasOnly;
exports.run = run;
const ava_1 = __importDefault(require("ava"));
const fs_1 = require("fs");
const lodash_1 = require("lodash");
const path_1 = require("path");
const src_1 = require("../src");
const utils_1 = require("../src/utils");
const http_1 = require("./http");
const dir = __dirname + '/e2e';
function hasOnly() {
    return (0, fs_1.readdirSync)(dir)
        .filter(_ => /^.*\.js$/.test(_))
        .map(_ => require((0, path_1.join)(dir, _)))
        .some(_ => _.only);
}
function run() {
    // [filename, absolute dirname, contents][]
    const modules = (0, fs_1.readdirSync)(dir)
        .filter(_ => !_.includes('.ignore.'))
        .filter(_ => /^.*\.js$/.test(_))
        .map(_ => [_, require((0, path_1.join)(dir, _))]);
    // exporting `const only=true` will only run that test
    // exporting `const exclude=true` will not run that test
    const only = (0, lodash_1.find)(modules, _ => Boolean(_[1].only));
    if (only) {
        runOne(only[1], only[0]);
    }
    else {
        modules.filter(_ => !_[1].exclude).forEach(_ => runOne(_[1], _[0]));
    }
}
const httpWithCacheResolver = {
    order: 1,
    canRead: /^https?:/i,
    async read({ url }) {
        return await (0, http_1.getWithCache)(url);
    },
};
function runOne(exports, name) {
    (0, utils_1.log)('blue', 'Running test', name);
    const options = (0, lodash_1.merge)(exports.options, { $refOptions: { resolve: { http: httpWithCacheResolver } } });
    (0, ava_1.default)(name, async (t) => {
        if (exports.error) {
            try {
                await (0, src_1.compile)(exports.input, (0, utils_1.stripExtension)(name), options);
            }
            catch (e) {
                t.true(e instanceof Error);
            }
        }
        else {
            t.snapshot(await (0, src_1.compile)(exports.input, (0, utils_1.stripExtension)(name), options), `Expected output to match snapshot for e2e test: ${name}`);
        }
    });
}
//# sourceMappingURL=testE2E.js.map