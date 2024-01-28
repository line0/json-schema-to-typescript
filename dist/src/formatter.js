"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const prettier_1 = require("prettier");
function format(code, options) {
    if (!options.format) {
        return code;
    }
    return (0, prettier_1.format)(code, { parser: 'typescript', ...options.style });
}
exports.format = format;
//# sourceMappingURL=formatter.js.map