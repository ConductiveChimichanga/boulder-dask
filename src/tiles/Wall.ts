import { Tile } from './Tile';
import { GameScene } from '../game';

export class Wall extends Tile {
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'wall');
    }

    // Walls are completely static and impassable
}
