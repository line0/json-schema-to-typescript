"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const ava_1 = __importDefault(require("ava"));
const lodash_1 = require("lodash");
const src_1 = require("../src");
function run() {
    const SCHEMA = {
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
            },
        },
        required: ['firstName'],
    };
    (0, ava_1.default)('compile() should not mutate its input', async (t) => {
        const before = (0, lodash_1.cloneDeep)(SCHEMA);
        await (0, src_1.compile)(SCHEMA, 'A');
        t.deepEqual(before, SCHEMA);
    });
    (0, ava_1.default)('compile() should be idempotent', async (t) => {
        const a = await (0, src_1.compile)(SCHEMA, 'A');
        const b = await (0, src_1.compile)(SCHEMA, 'A');
        t.deepEqual(a, b);
    });
}
//# sourceMappingURL=testIdempotence.js.map