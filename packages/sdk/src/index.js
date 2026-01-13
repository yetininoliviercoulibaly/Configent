"use strict";
/**
 * @configent/sdk
 *
 * Shared types, interfaces, and utilities for Configent Host and Plugins.
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDK_VERSION = void 0;
// Types exports
__exportStar(require("./types/manifest.types.js"), exports);
__exportStar(require("./types/permissions.types.js"), exports);
__exportStar(require("./types/rpc.types.js"), exports);
__exportStar(require("./types/tile.types.js"), exports);
// Validation exports
__exportStar(require("./validation/manifest.schema.js"), exports);
// Version constant
exports.SDK_VERSION = "0.1.0";
//# sourceMappingURL=index.js.map