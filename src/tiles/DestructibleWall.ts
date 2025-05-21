import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class DestructibleWall extends Tile {
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'destructible-wall');
    }
}
