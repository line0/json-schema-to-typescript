"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dereference = dereference;
const json_schema_ref_parser_1 = require("@apidevtools/json-schema-ref-parser");
const utils_1 = require("./utils");
async function dereference(schema, { cwd, $refOptions }) {
    (0, utils_1.log)('green', 'dereferencer', 'Dereferencing input schema:', cwd, schema);
    const parser = new json_schema_ref_parser_1.$RefParser();
    const dereferencedPaths = new WeakMap();
    const dereferencedSchema = (await parser.dereference(cwd, schema, {
        ...$refOptions,
        dereference: {
            ...$refOptions.dereference,
            onDereference($ref, schema) {
                dereferencedPaths.set(schema, $ref);
            },
        },
    })); // TODO: fix types
    return { dereferencedPaths, dereferencedSchema };
}
//# sourceMappingURL=resolver.js.map