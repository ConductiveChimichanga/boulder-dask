export enum TileType {
    Empty = 0,
    Dirt = 1
}

export class Level {
    private static readonly WIDTH = 40;
    private static readonly HEIGHT = 22;
    private tiles: TileType[][];

    constructor() {
        // Initialize the level with all dirt except for a small empty area
        this.tiles = Array(Level.HEIGHT).fill(null).map(() => 
            Array(Level.WIDTH).fill(TileType.Dirt)
        );

        // Create a small empty area for testing
        this.tiles[1][1] = TileType.Empty;
        this.tiles[1][2] = TileType.Empty;
        this.tiles[2][1] = TileType.Empty;
        this.tiles[2][2] = TileType.Empty;
    }

    getTile(x: number, y: number): TileType {
        if (x < 0 || x >= Level.WIDTH || y < 0 || y >= Level.HEIGHT) {
            return TileType.Empty;
        }
        return this.tiles[y][x];
    }

    setTile(x: number, y: number, type: TileType): void {
        if (x >= 0 && x < Level.WIDTH && y >= 0 && y < Level.HEIGHT) {
            this.tiles[y][x] = type;
        }
    }

    get width(): number {
        return Level.WIDTH;
    }

    get height(): number {
        return Level.HEIGHT;
    }
}
