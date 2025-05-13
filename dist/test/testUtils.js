"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const ava_1 = __importDefault(require("ava"));
const linker_1 = require("../src/linker");
const utils_1 = require("../src/utils");
function run() {
    const schema = (0, linker_1.link)({
        title: 'Example Schema',
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
            },
            lastName: {
                id: 'lastName',
                type: 'string',
            },
        },
        required: ['firstName', 'lastName'],
    });
    (0, ava_1.default)('pathTransform', t => {
        t.is((0, utils_1.pathTransform)('types', 'schemas', 'schemas/foo/a.json'), 'types/foo');
        t.is((0, utils_1.pathTransform)('./schemas/types', './schemas', 'schemas/foo/bar/a.json'), 'schemas/types/foo/bar');
        t.is((0, utils_1.pathTransform)('types', './src/../types/../schemas', 'schemas/foo/a.json'), 'types/foo');
    });
    (0, ava_1.default)('generateName', t => {
        const usedNames = new Map();
        t.is((0, utils_1.generateName)('a', usedNames, schema), 'A');
        t.is((0, utils_1.generateName)('abc', usedNames, schema), 'Abc');
        t.is((0, utils_1.generateName)('ABcd', usedNames, schema), 'ABcd');
        t.is((0, utils_1.generateName)('$Abc_123', usedNames, schema), '$Abc_123');
        t.is((0, utils_1.generateName)('Abc-de-f', usedNames, schema), 'AbcDeF');
        // Index should increment:
        t.is((0, utils_1.generateName)('a', usedNames, schema), 'A1');
        t.is((0, utils_1.generateName)('a', usedNames, schema), 'A2');
        t.is((0, utils_1.generateName)('a', usedNames, schema), 'A3');
    });
    (0, ava_1.default)('isSchemaLike', t => {
        t.is((0, utils_1.isSchemaLike)(schema), true);
        t.is((0, utils_1.isSchemaLike)([]), false);
        t.is((0, utils_1.isSchemaLike)(schema.properties), false);
        t.is((0, utils_1.isSchemaLike)(schema.required), false);
        t.is((0, utils_1.isSchemaLike)(schema.title), false);
        t.is((0, utils_1.isSchemaLike)(schema.properties.firstName), true);
        t.is((0, utils_1.isSchemaLike)(schema.properties.lastName), true);
    });
}
//# sourceMappingURL=testUtils.js.map