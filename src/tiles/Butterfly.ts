import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class Butterfly extends Tile {
    private direction: number = 0; // 0: right, 1: up, 2: left, 3: down
    private readonly MOVE_INTERVAL = 500; // Move every 500ms
    private lastMoveTime = 0;

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'butterfly');
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
            {x: 1, y: 0},   // right
            {x: 0, y: -1},  // up
            {x: -1, y: 0},  // left
            {x: 0, y: 1}    // down
        ];
        
        // Try to move in current direction
        let dir = directions[this.direction];
        let newX = pos.x + dir.x;
        let newY = pos.y + dir.y;
        
        // If we can't move in current direction, turn clockwise
        if (this.scene.getTileAt(newX, newY) !== TileType.Empty) {
            this.direction = (this.direction + 1) % 4;
            dir = directions[this.direction];
            newX = pos.x + dir.x;
            newY = pos.y + dir.y;
        }
        
        if (this.scene.getTileAt(newX, newY) === TileType.Empty) {
            this.scene.moveTile(pos.x, pos.y, newX, newY);
        }
    }
}
