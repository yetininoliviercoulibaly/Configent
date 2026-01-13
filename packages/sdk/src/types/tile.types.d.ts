/**
 * Tile size options for the Bento Grid layout.
 */
export type TileSize = "1x1" | "1x2" | "2x1" | "2x2";
/**
 * Tile type options.
 */
export type TileType = "webview";
/**
 * Definition of a UI tile (widget) exposed by a plugin.
 */
export interface TileDefinition {
    /**
     * Unique identifier for the tile within the plugin.
     */
    id: string;
    /**
     * Type of tile rendering.
     */
    type: TileType;
    /**
     * Size of the tile in the grid.
     */
    size: TileSize;
    /**
     * Source URL or path for the tile content.
     * @example "index.html#widget"
     */
    src: string;
}
//# sourceMappingURL=tile.types.d.ts.map