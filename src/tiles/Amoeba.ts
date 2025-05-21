import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class Amoeba extends Tile {
    private growthChance = 0.1; // 10% chance to grow each update
    
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'amoeba');
    }
    
    update() {
        if (Math.random() < this.growthChance) {
            this.tryGrow();
        }
    }
    
    private tryGrow() {
        const pos = this.getGridPosition();
        const directions = [
            {x: 0, y: 1},  // down
            {x: 1, y: 0},  // right
            {x: 0, y: -1}, // up
            {x: -1, y: 0}  // left
        ];
        
        // Try to grow in a random direction
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const newX = pos.x + dir.x;
        const newY = pos.y + dir.y;
        
        // Only grow into empty spaces
        if (this.scene.getTileAt(newX, newY) === TileType.Empty) {
            this.scene.moveTile(pos.x, pos.y, newX, newY);
        }
    }
}
