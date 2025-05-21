import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class Exit extends Tile {
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'exit');
    }
    
    // Exit only appears when enough diamonds are collected
    // Add logic in GameScene to show/hide this
}
