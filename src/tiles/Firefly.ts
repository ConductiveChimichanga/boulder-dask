import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class Firefly extends Tile {
    private direction: number = 0; // 0: left, 1: down, 2: right, 3: up
    private readonly MOVE_INTERVAL = 500; // Move every 500ms
    private lastMoveTime = 0;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'firefly');
    }
    
    update() {
        const time = Date.now();
        if (time - this.lastMoveTime >= this.MOVE_INTERVAL) {
            this.move();
            this.lastMoveTime = time;
        }
    }
    
    private move() {
        const pos = this.getGridPosition();
        const directions = [
            {x: -1, y: 0},  // left
            {x: 0, y: 1},   // down
            {x: 1, y: 0},   // right
            {x: 0, y: -1}   // up
        ];
        
        // Try to move in current direction
        let dir = directions[this.direction];
        let newX = pos.x + dir.x;
        let newY = pos.y + dir.y;
        
        // If we can't move in current direction, turn counter-clockwise
        if (this.scene.getTileAt(newX, newY) !== TileType.Empty) {
            this.direction = (this.direction - 1 + 4) % 4;
            dir = directions[this.direction];
            newX = pos.x + dir.x;
            newY = pos.y + dir.y;
        }
        
        if (this.scene.getTileAt(newX, newY) === TileType.Empty) {
            this.scene.moveTile(pos.x, pos.y, newX, newY);
        }
    }
}
