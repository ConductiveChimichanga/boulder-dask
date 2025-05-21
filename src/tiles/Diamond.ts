import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class Diamond extends Tile {
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'diamond');
    }

    update() {
        const pos = this.getGridPosition();
        const below = this.scene.getTileAt(pos.x, pos.y + 1);
        
        // If there's empty space below, fall down like a boulder
        if (below === TileType.Empty) {
            this.scene.moveTile(pos.x, pos.y, pos.x, pos.y + 1);
        }
    }
}
