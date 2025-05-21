import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class Boulder extends Tile {
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'boulder');
    }

    canBePushed({ dx, dy }: { dx: number; dy: number }): boolean {
        const pos = this.getGridPosition();
        const targetX = pos.x + dx;
        const targetY = pos.y + dy;
        
        // Can only be pushed horizontally
        if (dy !== 0) return false;
        
        // Check if target position is empty
        return this.scene.getTileAt(targetX, targetY) === TileType.Empty;
    }

    push({ dx, dy }: { dx: number; dy: number }) {
        const pos = this.getGridPosition();
        this.scene.moveTile(pos.x, pos.y, pos.x + dx, pos.y + dy);
    }

    update() {
        const pos = this.getGridPosition();
        const below = this.scene.getTileAt(pos.x, pos.y + 1);
        
        // If there's empty space below, fall down
        if (below === TileType.Empty) {
            this.scene.moveTile(pos.x, pos.y, pos.x, pos.y + 1);
        }
    }
}