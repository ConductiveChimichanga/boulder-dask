export enum TileType {
    Empty = 0,
    Dirt = 1,
    Wall = 2,
    Boulder = 3,      // Rocks that can fall and roll
    Diamond = 4,      // Collectible items needed to complete the level
    Exit = 5,         // The door that appears when enough diamonds are collected
    Player = 6,       // The player's starting position in level design
    Butterfly = 7,    // Enemy that moves in a pattern and explodes when killed
    Amoeba = 8,       // Grows and can turn into diamonds
    Firefly = 9,      // Enemy that moves in a pattern, opposite to butterfly
    MagicWall = 10,   // Special wall that transforms boulders into diamonds when active
    DestructibleWall = 11  // Wall that can be destroyed by explosions
}

export class Level {
    private static readonly WIDTH = 40;
    private static readonly HEIGHT = 22;
    private tiles: TileType[][];

    constructor() {
        // Initialize the level with dirt
        this.tiles = Array(Level.HEIGHT).fill(null).map(() => 
            Array(Level.WIDTH).fill(TileType.Dirt)
        );

        // Create border walls (indestructible)
        for (let x = 0; x < Level.WIDTH; x++) {
            this.tiles[0][x] = TileType.Wall;  // Top border
            this.tiles[Level.HEIGHT - 1][x] = TileType.Wall;  // Bottom border
        }
        for (let y = 0; y < Level.HEIGHT; y++) {
            this.tiles[y][0] = TileType.Wall;  // Left border
            this.tiles[y][Level.WIDTH - 1] = TileType.Wall;  // Right border
        }

        // Create a variety of tile types in different sections
        
        // Create starting area
        this.tiles[1][1] = TileType.Empty;
        this.tiles[1][2] = TileType.Empty;
        this.tiles[2][1] = TileType.Empty;
        this.tiles[2][2] = TileType.Empty;

        // Add some boulders
        this.tiles[3][4] = TileType.Boulder;
        this.tiles[3][5] = TileType.Boulder;
        this.tiles[4][6] = TileType.Boulder;

        // Add some diamonds
        this.tiles[2][8] = TileType.Diamond;
        this.tiles[3][8] = TileType.Diamond;
        this.tiles[4][8] = TileType.Diamond;

        // Add destructible walls
        this.tiles[5][5] = TileType.DestructibleWall;
        this.tiles[5][6] = TileType.DestructibleWall;
        this.tiles[5][7] = TileType.DestructibleWall;
        this.tiles[6][5] = TileType.DestructibleWall;

        // Add a magic wall section
        this.tiles[10][15] = TileType.MagicWall;
        this.tiles[10][16] = TileType.MagicWall;
        this.tiles[10][17] = TileType.MagicWall;

        // Add some enemies
        this.tiles[8][8] = TileType.Butterfly;
        this.tiles[8][12] = TileType.Firefly;

        // Add some amoeba
        this.tiles[15][15] = TileType.Amoeba;
        
        // Add exit
        this.tiles[Level.HEIGHT - 2][Level.WIDTH - 2] = TileType.Exit;

        // Add some vertical destructible walls
        for (let y = 3; y < Level.HEIGHT - 3; y++) {
            if (y % 5 === 0) {  // Create gaps every 5 blocks
                continue;
            }
            this.tiles[y][10] = TileType.DestructibleWall;
            this.tiles[y][20] = TileType.DestructibleWall;
            this.tiles[y][30] = TileType.DestructibleWall;
        }
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
