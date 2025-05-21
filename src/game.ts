import 'phaser';
import { Level, TileType } from './level';
import { MenuScene } from './menuScene';

export class GameScene extends Phaser.Scene {
    private level!: Level;
    private player!: Phaser.GameObjects.Rectangle;
    private tileSize = 32; // pixels per tile
    private playerGridPos = { x: 1, y: 1 };
    private isMoving = false;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load assets here
    }

    create() {
        this.level = new Level();
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Draw the level
        for (let y = 0; y < this.level.height; y++) {
            for (let x = 0; x < this.level.width; x++) {
                const tile = this.level.getTile(x, y);
                const color = tile === TileType.Empty ? 0x000000 : 0x8B4513;
                
                this.add.rectangle(
                    x * this.tileSize + this.tileSize/2,
                    y * this.tileSize + this.tileSize/2,
                    this.tileSize,
                    this.tileSize,
                    color
                );
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
            this.tileSize * 0.8, // slightly smaller than tile
            this.tileSize * 0.8,
            0x0000ff
        );
    }

    update() {
        if (this.isMoving) {
            // If the player is exactly on a tile position, allow new movement
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

            // Check if the new position is empty
            if (this.level.getTile(newX, newY) === TileType.Empty) {
                this.isMoving = true;
                this.playerGridPos.x = newX;
                this.playerGridPos.y = newY;

                // Move the player sprite
                this.tweens.add({
                    targets: this.player,
                    x: newX * this.tileSize + this.tileSize/2,
                    y: newY * this.tileSize + this.tileSize/2,
                    duration: 150, // 150ms per tile movement
                    ease: 'Power1',
                    onComplete: () => {
                        this.isMoving = false;
                    }
                });
            }
        }
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
