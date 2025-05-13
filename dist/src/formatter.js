"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = format;
const prettier_1 = require("prettier");
async function format(code, options) {
    if (!options.format) {
        return code;
    }
    return (0, prettier_1.format)(code, { parser: 'typescript', ...options.style });
}
//# sourceMappingURL=formatter.js.map