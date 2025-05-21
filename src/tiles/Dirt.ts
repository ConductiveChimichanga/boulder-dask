import { Tile } from './Tile';
import { GameScene } from '../game';

export class Dirt extends Tile {
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'dirt');
    }

    // Dirt doesn't need any update logic as it's static
    // It will be removed when the player moves into its space
}
