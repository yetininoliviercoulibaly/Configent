import { z } from "zod";
import { PERMISSION_SCOPES, type PermissionScope } from "../types/permissions.types.js";
import type { IPluginManifest } from "../types/manifest.types.js";
import type { TileDefinition, TileSize, TileType } from "../types/tile.types.js";

/**
 * Zod schema for validating permission scopes.
 * Uses the PERMISSION_SCOPES constant as the source of truth.
 */
const PermissionScopeSchema = z.enum(
  PERMISSION_SCOPES as readonly [PermissionScope, ...PermissionScope[]]
);

/**
 * Zod schema for validating tile sizes.
 */
const TileSizeSchema = z.enum(["1x1", "1x2", "2x1", "2x2"] satisfies [TileSize, ...TileSize[]]);

/**
 * Zod schema for validating tile types.
 */
const TileTypeSchema = z.enum(["webview"] satisfies [TileType, ...TileType[]]);

/**
 * Zod schema for validating tile definitions.
 */
const TileDefinitionSchema: z.ZodType<TileDefinition> = z.object({
  id: z.string().min(1),
  type: TileTypeSchema,
  size: TileSizeSchema,
  src: z.string().min(1),
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
const ManifestSchemaInternal = z.object({
  id: z
    .string()
    .regex(PLUGIN_ID_REGEX, "Plugin ID must be in reverse-domain format (e.g., com.example.plugin)"),
  name: z
    .string()
    .min(1, "Plugin name is required")
    .max(50, "Plugin name must not exceed 50 characters"),
  version: z
    .string()
    .regex(SEMVER_REGEX, "Version must follow semantic versioning (e.g., 1.0.0)"),
  description: z.string().optional(),
  permissions: z.array(PermissionScopeSchema),
  entrypoint: z.string().default("index.js"),
  tiles: z.array(TileDefinitionSchema).optional(),
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
export const ManifestSchema = ManifestSchemaInternal as z.ZodType<IPluginManifest>;

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
export function parseManifest(raw: unknown): IPluginManifest {
  return ManifestSchema.parse(raw);
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
export function safeParseManifest(raw: unknown): z.SafeParseReturnType<unknown, IPluginManifest> {
  return ManifestSchema.safeParse(raw);
}
