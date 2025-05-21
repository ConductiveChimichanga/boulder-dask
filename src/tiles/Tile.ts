import { GameScene } from '../game';

export abstract class Tile {
    public sprite: Phaser.GameObjects.Image;
    protected scene: GameScene;
    protected gridX: number;
    protected gridY: number;

    constructor(scene: GameScene, x: number, y: number, texture: string) {
        this.scene = scene;
        this.gridX = x;
        this.gridY = y;
        this.sprite = scene.add.image(
            x * scene.getTileSize() + scene.getTileSize()/2,
            y * scene.getTileSize() + scene.getTileSize()/2,
            texture
        );
    }

    update() {
        // Base update method, to be overridden by subclasses
    }

    moveTo(x: number, y: number) {
        this.gridX = x;
        this.gridY = y;
        this.scene.tweens.add({
            targets: this.sprite,
            x: x * this.scene.getTileSize() + this.scene.getTileSize()/2,
            y: y * this.scene.getTileSize() + this.scene.getTileSize()/2,
            duration: 150,
            ease: 'Power1'
        });
    }

    getGridPosition() {
        return { x: this.gridX, y: this.gridY };
    }

    destroy() {
        this.sprite.destroy();
    }
}