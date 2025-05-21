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

        // Create larger open areas for monsters
        
        // Player starting area (top-left)
        for (let y = 1; y <= 3; y++) {
            for (let x = 1; x <= 3; x++) {
                this.tiles[y][x] = TileType.Empty;
            }
        }

        // Create three main chambers with open spaces
        
        // Left chamber (with butterflies)
        this.createChamber(5, 5, 12, 12);
        this.tiles[6][7] = TileType.Butterfly;
        this.tiles[8][9] = TileType.Butterfly;
        this.tiles[10][7] = TileType.Diamond;
        this.tiles[7][10] = TileType.Diamond;

        // Middle chamber (with fireflies)
        this.createChamber(5, 15, 12, 22);
        this.tiles[7][17] = TileType.Firefly;
        this.tiles[9][19] = TileType.Firefly;
        this.tiles[8][18] = TileType.Diamond;
        this.tiles[10][20] = TileType.Diamond;

        // Right chamber (with mixed enemies)
        this.createChamber(5, 25, 12, 32);
        this.tiles[6][27] = TileType.Butterfly;
        this.tiles[8][29] = TileType.Firefly;
        this.tiles[7][28] = TileType.Diamond;
        this.tiles[9][30] = TileType.Diamond;

        // Add boulders as obstacles
        this.tiles[4][8] = TileType.Boulder;
        this.tiles[4][18] = TileType.Boulder;
        this.tiles[4][28] = TileType.Boulder;

        // Add more diamonds scattered around
        this.tiles[14][8] = TileType.Diamond;
        this.tiles[14][18] = TileType.Diamond;
        this.tiles[14][28] = TileType.Diamond;
        this.tiles[14][38] = TileType.Diamond;

        // Add some amoeba growth zones
        this.tiles[16][10] = TileType.Amoeba;
        this.tiles[16][20] = TileType.Amoeba;
        this.tiles[16][30] = TileType.Amoeba;

        // Add magic walls in strategic positions
        this.tiles[18][15] = TileType.MagicWall;
        this.tiles[18][16] = TileType.MagicWall;
        this.tiles[18][17] = TileType.MagicWall;

        // Add destructible walls as chamber separators
        for (let y = 5; y < 15; y++) {
            if (y % 3 !== 0) {  // Create gaps every 3 blocks
                this.tiles[y][13] = TileType.DestructibleWall;
                this.tiles[y][23] = TileType.DestructibleWall;
                this.tiles[y][33] = TileType.DestructibleWall;
            }
        }
    }

    // Helper method to create an open chamber
    private createChamber(startY: number, startX: number, endY: number, endX: number) {
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                this.tiles[y][x] = TileType.Empty;
            }
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
