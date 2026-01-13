"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestSchema = void 0;
exports.parseManifest = parseManifest;
exports.safeParseManifest = safeParseManifest;
const zod_1 = require("zod");
const permissions_types_js_1 = require("../types/permissions.types.js");
/**
 * Zod schema for validating permission scopes.
 * Uses the PERMISSION_SCOPES constant as the source of truth.
 */
const PermissionScopeSchema = zod_1.z.enum(permissions_types_js_1.PERMISSION_SCOPES);
/**
 * Zod schema for validating tile sizes.
 */
const TileSizeSchema = zod_1.z.enum(["1x1", "1x2", "2x1", "2x2"]);
/**
 * Zod schema for validating tile types.
 */
const TileTypeSchema = zod_1.z.enum(["webview"]);
/**
 * Zod schema for validating tile definitions.
 */
const TileDefinitionSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    type: TileTypeSchema,
    size: TileSizeSchema,
    src: zod_1.z.string().min(1),
});
/**
 * Regular expression for validating plugin IDs.
 * Must be in reverse-domain format (e.g., "com.example.plugin").
 */
const PLUGIN_ID_REGEX = /^[a-z]+\.[a-z]+\.[a-z]+$/;
/**
 * Regular expression for validating semantic versions.
 * Must follow the format "MAJOR.MINOR.PATCH" (e.g., "1.0.0").
 */
const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;
/**
 * Internal schema definition for plugin manifests.
 */
const ManifestSchemaInternal = zod_1.z.object({
    id: zod_1.z
        .string()
        .regex(PLUGIN_ID_REGEX, "Plugin ID must be in reverse-domain format (e.g., com.example.plugin)"),
    name: zod_1.z
        .string()
        .min(1, "Plugin name is required")
        .max(50, "Plugin name must not exceed 50 characters"),
    version: zod_1.z
        .string()
        .regex(SEMVER_REGEX, "Version must follow semantic versioning (e.g., 1.0.0)"),
    description: zod_1.z.string().optional(),
    permissions: zod_1.z.array(PermissionScopeSchema),
    entrypoint: zod_1.z.string().default("index.js"),
    tiles: zod_1.z.array(TileDefinitionSchema).optional(),
});
/**
 * Zod schema for validating plugin manifests.
 *
 * @example
 * ```typescript
 * const result = ManifestSchema.safeParse(rawManifest);
 * if (result.success) {
 *   console.log(result.data.id);
 * } else {
 *   console.error(result.error.issues);
 * }
 * ```
 */
exports.ManifestSchema = ManifestSchemaInternal;
/**
 * Parse and validate a manifest object.
 * Throws a ZodError if validation fails.
 *
 * @param raw - The raw manifest object to parse
 * @returns The validated manifest
 * @throws {z.ZodError} If the manifest is invalid
 *
 * @example
 * ```typescript
 * try {
 *   const manifest = parseManifest(rawData);
 *   console.log(manifest.id);
 * } catch (error) {
 *   console.error("Invalid manifest:", error);
 * }
 * ```
 */
function parseManifest(raw) {
    return exports.ManifestSchema.parse(raw);
}
/**
 * Safely parse and validate a manifest object.
 * Returns a result object instead of throwing.
 *
 * @param raw - The raw manifest object to parse
 * @returns A SafeParseReturnType containing either the data or an error
 *
 * @example
 * ```typescript
 * const result = safeParseManifest(rawData);
 * if (result.success) {
 *   console.log(result.data.id);
 * } else {
 *   console.error(result.error.issues);
 * }
 * ```
 */
function safeParseManifest(raw) {
    return exports.ManifestSchema.safeParse(raw);
}
//# sourceMappingURL=manifest.schema.js.map