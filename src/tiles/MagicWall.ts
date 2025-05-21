import { TileType } from '../level';
import { Tile } from './Tile';
import { GameScene } from '../game';

export class MagicWall extends Tile {
    private isActive: boolean = false;
    
    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y, 'magic-wall');
    }
    
    activate() {
        this.isActive = true;
        // Could add a visual effect here
    }
    
    deactivate() {
        this.isActive = false;
    }
    
    isActivated() {
        return this.isActive;
    }
}
