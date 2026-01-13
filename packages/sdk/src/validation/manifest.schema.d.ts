import { z } from "zod";
import type { IPluginManifest } from "../types/manifest.types.js";
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
export declare const ManifestSchema: z.ZodType<IPluginManifest>;
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
export declare function parseManifest(raw: unknown): IPluginManifest;
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
export declare function safeParseManifest(raw: unknown): z.SafeParseReturnType<unknown, IPluginManifest>;
//# sourceMappingURL=manifest.schema.d.ts.map