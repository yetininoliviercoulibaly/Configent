import type { PermissionScope } from "./permissions.types.js";
import type { TileDefinition } from "./tile.types.js";
/**
 * Plugin manifest structure.
 * Each plugin must include a manifest.json file following this schema.
 */
export interface IPluginManifest {
    /**
     * Unique plugin identifier in reverse-domain format.
     * @example "com.configent.moderator"
     */
    id: string;
    /**
     * Human-readable plugin name.
     * @minLength 1
     * @maxLength 50
     */
    name: string;
    /**
     * Semantic version of the plugin.
     * @example "1.0.0"
     */
    version: string;
    /**
     * Optional plugin description.
     */
    description?: string;
    /**
     * List of permissions the plugin requires.
     */
    permissions: PermissionScope[];
    /**
     * Entry point file for the plugin's backend code.
     * @default "index.js"
     */
    entrypoint?: string;
    /**
     * UI tiles (widgets) exposed by the plugin.
     */
    tiles?: TileDefinition[];
}
/**
 * Plugin installation status.
 */
export type PluginStatus = "ENABLED" | "DISABLED" | "CRASHED" | "INSTALLING";
/**
 * Regex pattern for validating plugin IDs (reverse-domain format).
 */
export declare const PLUGIN_ID_PATTERN: RegExp;
/**
 * Regex pattern for validating semantic versions.
 */
export declare const SEMVER_PATTERN: RegExp;
//# sourceMappingURL=manifest.types.d.ts.map