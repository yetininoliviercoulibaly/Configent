"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSION_SCOPES = void 0;
exports.isValidPermission = isValidPermission;
/**
 * All available permission scopes as a constant array.
 * Useful for validation and iteration.
 */
exports.PERMISSION_SCOPES = [
    "vault:read",
    "network:public",
    "storage:read",
    "storage:write",
    "ui:notify",
    "schedule:register",
    "mcp:call",
];
/**
 * Checks if a string is a valid permission scope.
 */
function isValidPermission(value) {
    return exports.PERMISSION_SCOPES.includes(value);
}
//# sourceMappingURL=permissions.types.js.map