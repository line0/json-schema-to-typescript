"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dereference = void 0;
const json_schema_ref_parser_1 = __importDefault(require("@apidevtools/json-schema-ref-parser"));
const utils_1 = require("./utils");
async function dereference(schema, { cwd, $refOptions }) {
    (0, utils_1.log)('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema);
    const parser = new json_schema_ref_parser_1.default();
    const dereferencedPaths = new WeakMap();
    const dereferencedSchema = (await parser.dereference(cwd, schema, {
        ...$refOptions,
        dereference: {
            ...$refOptions.dereference,
            onDereference(path, value) {
                dereferencedPaths.set(value, path);
            },
        },
    })); // TODO: fix types
    return { dereferencedPaths, dereferencedSchema };
}
exports.dereference = dereference;
//# sourceMappingURL=resolver.js.map