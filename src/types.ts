import { TileType } from './level';

export interface GameScene {
    getTileSize(): number;
    getTileAt(x: number, y: number): TileType;
    moveTile(fromX: number, fromY: number, toX: number, toY: number): void;
}