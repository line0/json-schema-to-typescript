"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const ava_1 = __importDefault(require("ava"));
const src_1 = require("../src");
function run() {
    (0, ava_1.default)('compileFromFile should resolve refs from cwd option', async (t) => t.snapshot(await (0, src_1.compileFromFile)('./test/resources/other/ReferencingType.json', { cwd: './test/resources' })));
    (0, ava_1.default)('compileFromFile should resolve refs from cwd option as yml', async (t) => t.snapshot(await (0, src_1.compileFromFile)('./test/resources/other/ReferencingType.yml', { cwd: './test/resources' })));
}
//# sourceMappingURL=testCompileFromFile.js.map