import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class Butterfly extends Tile {
    private direction: number = 0; // 0: right, 1: up, 2: left, 3: down
    private readonly BASE_MOVE_INTERVAL = 500; // Base movement speed
    private readonly CHASE_MOVE_INTERVAL = 300; // Faster movement when chasing
    private lastMoveTime = 0;
    private readonly DETECTION_RANGE = 5; // How far the butterfly can see

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'butterfly');
    }
    
    update() {
        const time = Date.now();
        const moveInterval = this.isPlayerNearby() ? this.CHASE_MOVE_INTERVAL : this.BASE_MOVE_INTERVAL;
        
        if (time - this.lastMoveTime >= moveInterval) {
            this.move();
            this.lastMoveTime = time;
        }
    }
    
    private isPlayerNearby(): boolean {
        const pos = this.getGridPosition();
        const playerPos = this.scene.getPlayerPosition();
        const distance = Math.abs(pos.x - playerPos.x) + Math.abs(pos.y - playerPos.y);
        return distance <= this.DETECTION_RANGE;
    }
    
    private getPathToPlayer(): {x: number, y: number} | null {
        const pos = this.getGridPosition();
        const playerPos = this.scene.getPlayerPosition();
        
        // If player is nearby, try to intercept
        if (this.isPlayerNearby()) {
            const dx = playerPos.x - pos.x;
            const dy = playerPos.y - pos.y;
            
            // Try to move towards player while avoiding obstacles
            const possibleMoves = [
                {x: Math.sign(dx), y: 0},
                {x: 0, y: Math.sign(dy)},
                {x: -Math.sign(dx), y: 0},
                {x: 0, y: -Math.sign(dy)}
            ];
            
            for (const move of possibleMoves) {
                const newX = pos.x + move.x;
                const newY = pos.y + move.y;
                if (this.scene.getTileAt(newX, newY) === TileType.Empty) {
                    return move;
                }
            }
        }
        return null;
    }
    
    private move() {
        const pos = this.getGridPosition();
        const pathToPlayer = this.getPathToPlayer();
        
        // If we can move towards player, do it
        if (pathToPlayer) {
            const newX = pos.x + pathToPlayer.x;
            const newY = pos.y + pathToPlayer.y;
            if (this.scene.getTileAt(newX, newY) === TileType.Empty) {
                this.scene.moveTile(pos.x, pos.y, newX, newY);
                return;
            }
        }
        
        // Otherwise use normal clockwise pattern
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
