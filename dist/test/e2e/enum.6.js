"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.input = void 0;
exports.input = {
    title: 'Enum',
    type: 'object',
    properties: {
        specialStringEnum: {
            type: 'string',
            enum: ['text/plain', 'a', 'b-c', 'd.e'],
        },
    },
    required: ['specialStringEnum'],
    additionalProperties: false,
};
exports.options = {
    inferStringEnumKeysFromValues: true,
};
//# sourceMappingURL=enum.6.js.map