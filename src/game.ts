import 'phaser';
import { Level, TileType } from './level';
import { MenuScene } from './menuScene';
import { Boulder } from './tiles/Boulder';
import { Tile } from './tiles/Tile';
import { GameScene as IGameScene } from './types';

export class GameScene extends Phaser.Scene implements IGameScene {
    private level!: Level;
    private player!: Phaser.GameObjects.Rectangle;
    private tileSize = 32;
    private playerGridPos = { x: 1, y: 1 };
    private isMoving = false;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private tiles: Map<string, Tile> = new Map();

    constructor() {
        super({ key: 'GameScene' });
    }

    getTileSize(): number {
        return this.tileSize;
    }

    getTileAt(x: number, y: number): TileType {
        return this.level.getTile(x, y);
    }

    moveTile(fromX: number, fromY: number, toX: number, toY: number) {
        const key = `${fromX},${fromY}`;
        const tile = this.tiles.get(key);
        if (!tile) return;

        // Update the level data
        const tileType = this.level.getTile(fromX, fromY);
        this.level.setTile(fromX, fromY, TileType.Empty);
        this.level.setTile(toX, toY, tileType);

        // Update the tile map
        this.tiles.delete(key);
        this.tiles.set(`${toX},${toY}`, tile);

        // Move the tile sprite
        tile.moveTo(toX, toY);
    }

    preload() {
        // Create and load colored textures for each tile type
        const graphics = this.add.graphics();
        
        // Empty - Black with dark gray grid pattern
        graphics.lineStyle(1, 0x333333);
        graphics.fillStyle(0x000000);
        graphics.fillRect(0, 0, 32, 32);
        graphics.strokeRect(0, 0, 32, 32);
        graphics.strokeRect(8, 8, 16, 16);
        graphics.generateTexture('empty', 32, 32);
        graphics.clear();

        // Dirt - Brown with darker spots
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 32, 32);
        graphics.fillStyle(0x654321);
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * 24;
            const y = Math.random() * 24;
            graphics.fillCircle(x + 4, y + 4, 3);
        }
        graphics.generateTexture('dirt', 32, 32);
        graphics.clear();

        // Wall - Dark brown with brick pattern
        graphics.fillStyle(0x654321);
        graphics.fillRect(0, 0, 32, 32);
        graphics.lineStyle(2, 0x4A3219);
        for (let y = 0; y < 32; y += 8) {
            graphics.strokeRect(0, y, 32, 8);
        }
        for (let x = 0; x < 32; x += 16) {
            graphics.strokeRect(x, 0, 16, 32);
        }
        graphics.generateTexture('wall', 32, 32);
        graphics.clear();

        // Boulder - Circular rock with shading
        graphics.fillStyle(0xA0522D);
        graphics.fillCircle(16, 16, 14);
        graphics.lineStyle(2, 0x8B4513);
        graphics.strokeCircle(16, 16, 14);
        graphics.fillStyle(0xCD853F);
        graphics.fillCircle(12, 12, 4); // Highlight
        graphics.generateTexture('boulder', 32, 32);
        graphics.clear();

        // Diamond - Cyan diamond shape with sparkle
        graphics.lineStyle(2, 0x00FFFF);
        graphics.beginPath();
        graphics.moveTo(16, 4);
        graphics.lineTo(28, 16);
        graphics.lineTo(16, 28);
        graphics.lineTo(4, 16);
        graphics.closePath();
        graphics.strokePath();
        graphics.fillStyle(0x00FFFF);
        graphics.fillPath();
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(16, 16, 2); // Center sparkle
        graphics.generateTexture('diamond', 32, 32);
        graphics.clear();

        // Exit - Green portal-like swirl
        graphics.lineStyle(2, 0x00FF00);
        graphics.beginPath();
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 8) {
            const r = 12 + Math.sin(i * 2) * 4;
            const x = 16 + Math.cos(i) * r;
            const y = 16 + Math.sin(i) * r;
            i === 0 ? graphics.moveTo(x, y) : graphics.lineTo(x, y);
        }
        graphics.closePath();
        graphics.strokePath();
        graphics.fillStyle(0x00FF00);
        graphics.fillPath();
        graphics.generateTexture('exit', 32, 32);
        graphics.clear();

        // Butterfly - Pink with wing pattern
        graphics.fillStyle(0xFF69B4);
        graphics.fillCircle(16, 16, 8);
        graphics.lineStyle(2, 0xFF1493);
        graphics.beginPath();
        graphics.moveTo(16, 8);
        // Draw wings using curves
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
            const x1 = 16 + Math.cos(i) * 12;
            const y1 = 16 + Math.sin(i) * 12;
            const x2 = 16 + Math.cos(i + Math.PI / 4) * 16;
            const y2 = 16 + Math.sin(i + Math.PI / 4) * 16;
            graphics.lineTo(x1, y1);
            graphics.lineTo(x2, y2);
        }
        graphics.closePath();
        graphics.strokePath();
        graphics.generateTexture('butterfly', 32, 32);
        graphics.clear();

        // Firefly - Orange-red with glow
        graphics.fillStyle(0xFF4500);
        graphics.fillCircle(16, 16, 8);
        graphics.lineStyle(2, 0xFF8C00);
        graphics.strokeCircle(16, 16, 12);
        graphics.generateTexture('firefly', 32, 32);
        graphics.clear();

        // Amoeba - Purple blob with animated-looking edges
        graphics.fillStyle(0x9370DB);
        graphics.beginPath();
        for (let i = 0; i < Math.PI * 2; i += Math.PI / 6) {
            const r = 12 + Math.sin(i * 3) * 4;
            const x = 16 + Math.cos(i) * r;
            const y = 16 + Math.sin(i) * r;
            i === 0 ? graphics.moveTo(x, y) : graphics.lineTo(x, y);
        }
        graphics.closePath();
        graphics.fill();
        graphics.generateTexture('amoeba', 32, 32);
        graphics.clear();

        // Magic Wall - Gray with sparkles
        graphics.fillStyle(0x808080);
        graphics.fillRect(0, 0, 32, 32);
        graphics.fillStyle(0xFFFFFF);
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * 24 + 4;
            const y = Math.random() * 24 + 4;
            graphics.fillCircle(x, y, 1);
        }
        graphics.generateTexture('magic-wall', 32, 32);
        graphics.clear();

        // Destructible Wall - Gray with cracks
        graphics.fillStyle(0x808080);
        graphics.fillRect(0, 0, 32, 32);
        graphics.lineStyle(1, 0x666666);
        graphics.moveTo(8, 8);
        graphics.lineTo(24, 24);
        graphics.moveTo(24, 8);
        graphics.lineTo(8, 24);
        graphics.strokePath();
        graphics.generateTexture('destructible-wall', 32, 32);
        graphics.clear();

        // Clean up the graphics object
        graphics.destroy();
    }

    create() {
        this.level = new Level();
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Draw the level
        for (let y = 0; y < this.level.height; y++) {
            for (let x = 0; x < this.level.width; x++) {
                const tile = this.level.getTile(x, y);
                switch (tile) {
                    case TileType.Empty:
                        this.add.image(
                            x * this.tileSize + this.tileSize/2,
                            y * this.tileSize + this.tileSize/2,
                            'empty'
                        );
                        break;
                    case TileType.Boulder:
                        const boulder = new Boulder(this, x, y);
                        this.tiles.set(`${x},${y}`, boulder);
                        break;
                    default:
                        this.add.image(
                            x * this.tileSize + this.tileSize/2,
                            y * this.tileSize + this.tileSize/2,
                            this.getTextureNameForTile(tile)
                        );
                        break;
                }
            }
        }

        // Add player at the first empty space we find
        for (let y = 0; y < this.level.height; y++) {
            for (let x = 0; x < this.level.width; x++) {
                if (this.level.getTile(x, y) === TileType.Empty) {
                    this.playerGridPos = { x, y };
                    break;
                }
            }
        }

        // Create player (blue rectangle for now)
        this.player = this.add.rectangle(
            this.playerGridPos.x * this.tileSize + this.tileSize/2,
            this.playerGridPos.y * this.tileSize + this.tileSize/2,
            this.tileSize * 0.8,
            this.tileSize * 0.8,
            0x0000ff
        );
    }

    private getTextureNameForTile(tile: TileType): string {
        switch (tile) {
            case TileType.Dirt: return 'dirt';
            case TileType.Wall: return 'wall';
            case TileType.Diamond: return 'diamond';
            case TileType.Exit: return 'exit';
            case TileType.Butterfly: return 'butterfly';
            case TileType.Firefly: return 'firefly';
            case TileType.Amoeba: return 'amoeba';
            case TileType.MagicWall: return 'magic-wall';
            case TileType.DestructibleWall: return 'destructible-wall';
            default: return 'empty';
        }
    }

    update() {
        // Update all tiles (this will handle boulder falling and rolling)
        for (const tile of this.tiles.values()) {
            tile.update();
        }

        if (this.isMoving) {
            const targetX = this.playerGridPos.x * this.tileSize + this.tileSize/2;
            const targetY = this.playerGridPos.y * this.tileSize + this.tileSize/2;
            if (this.player.x === targetX && this.player.y === targetY) {
                this.isMoving = false;
            }
            return;
        }

        // Handle movement input
        let dx = 0;
        let dy = 0;

        if (this.cursors.left.isDown) dx = -1;
        else if (this.cursors.right.isDown) dx = 1;
        else if (this.cursors.up.isDown) dy = -1;
        else if (this.cursors.down.isDown) dy = 1;

        if (dx !== 0 || dy !== 0) {
            const newX = this.playerGridPos.x + dx;
            const newY = this.playerGridPos.y + dy;

            // Check if the new position is valid
            const targetTile = this.level.getTile(newX, newY);
            if (targetTile === TileType.Boulder) {
                // Try to push the boulder
                const boulder = this.tiles.get(`${newX},${newY}`) as Boulder;
                if (boulder && boulder.canBePushed({ dx, dy })) {
                    boulder.push({ dx, dy });
                    this.movePlayer(newX, newY);
                }
            } else if (targetTile === TileType.Empty || targetTile === TileType.Dirt) {
                if (targetTile === TileType.Dirt) {
                    this.level.setTile(newX, newY, TileType.Empty);
                    // Find and destroy the dirt image
                    this.children.list
                        .filter(obj => obj instanceof Phaser.GameObjects.Image)
                        .find(img => {
                            return img.x === newX * this.tileSize + this.tileSize/2 && 
                                   img.y === newY * this.tileSize + this.tileSize/2;
                        })?.destroy();
                }
                this.movePlayer(newX, newY);
            }
        }
    }

    private movePlayer(newX: number, newY: number) {
        this.isMoving = true;
        this.playerGridPos.x = newX;
        this.playerGridPos.y = newY;

        this.tweens.add({
            targets: this.player,
            x: newX * this.tileSize + this.tileSize/2,
            y: newY * this.tileSize + this.tileSize/2,
            duration: 150,
            ease: 'Power1',
            onComplete: () => {
                this.isMoving = false;
            }
        });
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 40 * 32, // level width * tile size
    height: 22 * 32, // level height * tile size
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene],
    backgroundColor: '#000000'
};

new Phaser.Game(config);
