import 'phaser';
import { Level, TileType } from './level';
import { MenuScene } from './menuScene';
import { Boulder } from './tiles/Boulder';
import { Tile } from './tiles/Tile';
import { GameScene as IGameScene } from './types';
import { Diamond } from './tiles/Diamond';
import { Butterfly } from './tiles/Butterfly';
import { Firefly } from './tiles/Firefly';
import { Amoeba } from './tiles/Amoeba';
import { MagicWall } from './tiles/MagicWall';
import { Exit } from './tiles/Exit';

export class GameScene extends Phaser.Scene implements IGameScene {
    private level!: Level;
    private player!: Phaser.GameObjects.Image;
    private tileSize = 32;
    private playerGridPos = { x: 1, y: 1 };
    private isMoving = false;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private tiles: Map<string, Tile> = new Map();
    private diamondsCollected: number = 0;
    private requiredDiamonds: number = 12; // Adjust this based on level design
    private isPlayerDead: boolean = false;
    private isLevelComplete: boolean = false;
    private scoreText!: Phaser.GameObjects.Text;
    private diamondText!: Phaser.GameObjects.Text;
    private hudBackground!: Phaser.GameObjects.Rectangle;
    private score: number = 0;
    private diamondValue: number = 100; // Points per diamond
    
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

        // Player - Blue character with details
        graphics.lineStyle(2, 0x4444ff);
        graphics.fillStyle(0x0000ff);
        
        // Body
        graphics.fillCircle(16, 16, 12);
        graphics.strokeCircle(16, 16, 12);
        
        // Eyes
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(12, 14, 3);
        graphics.fillCircle(20, 14, 3);
        graphics.fillStyle(0x000000);
        graphics.fillCircle(12, 14, 1.5);
        graphics.fillCircle(20, 14, 1.5);
        
        // Smile
        graphics.lineStyle(2, 0xffffff);
        graphics.beginPath();
        graphics.arc(16, 18, 6, 0, Math.PI);
        graphics.strokePath();
        
        graphics.generateTexture('player', 32, 32);
        graphics.clear();

        // Butterfly - More detailed design
        graphics.lineStyle(2, 0xFF1493);
        
        // Wings
        for (let i = 0; i < 2; i++) {
            const xOffset = i ? 1 : -1;
            // Top wings
            graphics.fillStyle(0xFF69B4);
            graphics.beginPath();
            graphics.moveTo(16, 16);
            graphics.lineTo(16 + (8 * xOffset), 8);
            graphics.lineTo(16 + (12 * xOffset), 12);
            graphics.lineTo(16, 16);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();

            // Bottom wings
            graphics.fillStyle(0xFF1493);
            graphics.beginPath();
            graphics.moveTo(16, 16);
            graphics.lineTo(16 + (8 * xOffset), 24);
            graphics.lineTo(16 + (12 * xOffset), 20);
            graphics.lineTo(16, 16);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
        }

        // Body
        graphics.fillStyle(0xFFB6C1);
        graphics.fillCircle(16, 16, 4);
        graphics.strokeCircle(16, 16, 4);
        
        // Antennae
        graphics.lineStyle(1, 0xFF1493);
        graphics.beginPath();
        graphics.moveTo(14, 14);
        graphics.lineTo(10, 8);
        graphics.moveTo(18, 14);
        graphics.lineTo(22, 8);
        graphics.strokePath();

        graphics.generateTexture('butterfly', 32, 32);
        graphics.clear();

        // Firefly - Enhanced glow effect
        // Outer glow layers
        for (let radius = 14; radius > 8; radius -= 2) {
            graphics.lineStyle(2, 0xFF8C00, 0.2);
            graphics.strokeCircle(16, 16, radius);
        }
        
        // Body
        graphics.fillStyle(0xFF4500);
        graphics.fillCircle(16, 16, 8);
        graphics.lineStyle(2, 0xFF8C00);
        graphics.strokeCircle(16, 16, 8);
        
        // Light spots
        graphics.fillStyle(0xFFFF00);
        graphics.fillCircle(14, 14, 2);
        graphics.fillCircle(18, 14, 2);
        graphics.fillCircle(16, 18, 2);

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
        
        // Create HUD background
        const hudHeight = 50;
        this.hudBackground = this.add.rectangle(0, 0, this.scale.width, hudHeight, 0x000000, 0.7);
        this.hudBackground.setOrigin(0, 0);
        this.hudBackground.setScrollFactor(0);
        this.hudBackground.setDepth(100);

        // Add score display
        this.scoreText = this.add.text(this.scale.width - 20, hudHeight/2, 'Score: 0', {
            fontSize: '24px',
            color: '#fff',
            align: 'right'
        });
        this.scoreText.setOrigin(1, 0.5);
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(100);

        // Add diamond counter
        const diamondIcon = this.add.image(20, hudHeight/2, 'diamond');
        diamondIcon.setScale(0.8);
        diamondIcon.setScrollFactor(0);
        diamondIcon.setDepth(100);

        // Add diamond counter text
        this.diamondText = this.add.text(50, hudHeight/2, '0/' + this.requiredDiamonds, {
            fontSize: '24px',
            color: '#00ffff',
            align: 'left'
        });
        this.diamondText.setOrigin(0, 0.5);
        this.diamondText.setScrollFactor(0);
        this.diamondText.setDepth(100);
        
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
                        this.tiles.set(`${x},${y}`, new Boulder(this, x, y));
                        break;
                    case TileType.Diamond:
                        this.tiles.set(`${x},${y}`, new Diamond(this, x, y));
                        break;
                    case TileType.Butterfly:
                        this.tiles.set(`${x},${y}`, new Butterfly(this, x, y));
                        break;
                    case TileType.Firefly:
                        this.tiles.set(`${x},${y}`, new Firefly(this, x, y));
                        break;
                    case TileType.Amoeba:
                        this.tiles.set(`${x},${y}`, new Amoeba(this, x, y));
                        break;
                    case TileType.MagicWall:
                        this.tiles.set(`${x},${y}`, new MagicWall(this, x, y));
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

        // Create player with the new sprite
        this.player = this.add.image(
            this.playerGridPos.x * this.tileSize + this.tileSize/2,
            this.playerGridPos.y * this.tileSize + this.tileSize/2,
            'player'
        );
    }

    getPlayerPosition() {
        return { ...this.playerGridPos };
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

    private checkEnemyCollisions() {
        const enemyPositions = new Map<string, Tile>();
        
        // Collect positions of all enemies
        for (const [key, tile] of this.tiles.entries()) {
            if (tile instanceof Butterfly || tile instanceof Firefly) {
                const pos = tile.getGridPosition();
                const posKey = `${pos.x},${pos.y}`;
                
                if (enemyPositions.has(posKey)) {
                    // Collision detected! Create explosion
                    const otherEnemy = enemyPositions.get(posKey)!;
                    this.createExplosion(pos.x, pos.y);
                    
                    // Remove both enemies
                    tile.destroy();
                    otherEnemy.destroy();
                    this.tiles.delete(key);
                    
                    // Find and delete the other enemy from the tiles map
                    for (const [otherKey, t] of this.tiles.entries()) {
                        if (t === otherEnemy) {
                            this.tiles.delete(otherKey);
                            break;
                        }
                    }
                    
                    // Convert the explosion area to diamonds
                    this.createDiamondsFromExplosion(pos.x, pos.y);
                } else {
                    enemyPositions.set(posKey, tile);
                }
            }
        }
    }
    
    private createExplosion(x: number, y: number) {
        // Create a particle effect for the explosion
        const particles = this.add.particles(x * this.tileSize + this.tileSize/2, 
                                          y * this.tileSize + this.tileSize/2, 
                                          'diamond', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 500,
            quantity: 20,
            tint: [0xFF69B4, 0xFF8C00] // Mix of butterfly and firefly colors
        });
        
        // Auto-destroy the emitter after animation
        this.time.delayedCall(500, () => {
            particles.destroy();
        });
    }
    
    private createDiamondsFromExplosion(centerX: number, centerY: number) {
        // Create diamonds in a cross pattern
        const diamondPositions = [
            {x: centerX, y: centerY},
            {x: centerX + 1, y: centerY},
            {x: centerX - 1, y: centerY},
            {x: centerX, y: centerY + 1},
            {x: centerX, y: centerY - 1}
        ];
        
        for (const pos of diamondPositions) {
            if (this.level.getTile(pos.x, pos.y) === TileType.Empty) {
                this.level.setTile(pos.x, pos.y, TileType.Diamond);
                this.tiles.set(`${pos.x},${pos.y}`, new Diamond(this, pos.x, pos.y));
            }
        }
    }

    update() {
        if (this.isPlayerDead || this.isLevelComplete) {
            return; // Stop updates if game is over
        }

        // Update all tiles
        for (const tile of this.tiles.values()) {
            tile.update();
        }

        // Check for enemy collisions
        this.checkEnemyCollisions();

        // Check for death by boulder or enemies
        this.checkForDeath();

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

            const targetTile = this.level.getTile(newX, newY);
            switch (targetTile) {
                case TileType.Boulder:
                    const boulder = this.tiles.get(`${newX},${newY}`) as Boulder;
                    if (boulder && boulder.canBePushed({ dx, dy })) {
                        boulder.push({ dx, dy });
                        this.movePlayer(newX, newY);
                    }
                    break;
                    
                case TileType.Diamond:
                    this.collectDiamond(newX, newY);
                    this.movePlayer(newX, newY);
                    break;
                    
                case TileType.Empty:
                case TileType.Dirt:
                    if (targetTile === TileType.Dirt) {
                        this.level.setTile(newX, newY, TileType.Empty);
                        this.children.list
                            .filter(obj => obj instanceof Phaser.GameObjects.Image)
                            .find(img => {
                                return img.x === newX * this.tileSize + this.tileSize/2 && 
                                       img.y === newY * this.tileSize + this.tileSize/2;
                            })?.destroy();
                    }
                    this.movePlayer(newX, newY);
                    break;
                    
                case TileType.Exit:
                    if (this.diamondsCollected >= this.requiredDiamonds) {
                        this.levelComplete();
                    }
                    break;
            }
        }
    }

    private collectDiamond(x: number, y: number) {
        const key = `${x},${y}`;
        const diamond = this.tiles.get(key);
        if (diamond) {
            diamond.destroy();
            this.tiles.delete(key);
            this.level.setTile(x, y, TileType.Empty);
            this.diamondsCollected++;
            this.score += this.diamondValue;
            
            // Update score and diamond displays
            this.scoreText.setText(`Score: ${this.score}`);
            this.diamondText.setText(`${this.diamondsCollected}/${this.requiredDiamonds}`);
            
            // Show exit when enough diamonds are collected
            if (this.diamondsCollected >= this.requiredDiamonds) {
                this.showExit();
            }
        }
    }

    private checkForDeath() {
        const px = this.playerGridPos.x;
        const py = this.playerGridPos.y;
        
        // Check for boulder falling on player
        const aboveTile = this.tiles.get(`${px},${py-1}`);
        if (aboveTile instanceof Boulder && aboveTile.isFalling) {
            this.playerDeath();
            return;
        }
        
        // Check for enemies
        for (const tile of this.tiles.values()) {
            if (tile instanceof Butterfly || tile instanceof Firefly) {
                const pos = tile.getGridPosition();
                if (pos.x === px && pos.y === py) {
                    this.playerDeath();
                    return;
                }
            }
        }
    }

    private playerDeath() {
        if (this.isPlayerDead) return;
        
        this.isPlayerDead = true;
        this.add.text(this.scale.width/2, this.scale.height/2, 'Game Over', {
            fontSize: '64px',
            color: '#ff0000'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Restart the scene after a delay
        this.time.delayedCall(2000, () => {
            this.scene.restart();
        });
    }

    private levelComplete() {
        if (this.isLevelComplete) return;
        
        this.isLevelComplete = true;
        this.add.text(this.scale.width/2, this.scale.height/2, 'Level Complete!', {
            fontSize: '64px',
            color: '#00ff00'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Go back to menu after a delay
        this.time.delayedCall(2000, () => {
            this.scene.start('MenuScene');
        });
    }

    private showExit() {
        // Find a suitable position for the exit (e.g., near the edge of the map)
        let exitX = this.level.width - 2;
        let exitY = this.level.height - 2;
        
        // Make sure the position is empty or dirt
        const tile = this.level.getTile(exitX, exitY);
        if (tile === TileType.Empty || tile === TileType.Dirt) {
            this.level.setTile(exitX, exitY, TileType.Exit);
            new Exit(this, exitX, exitY);
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
