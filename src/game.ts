import 'phaser';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load assets here
    }

    create() {
        // Set up game objects here
        this.add.text(400, 300, 'Boulder Dash', {
            color: '#ffffff',
            fontSize: '32px'
        }).setOrigin(0.5);
    }

    update() {
        // Game loop logic here
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: MainScene
};

new Phaser.Game(config);
