export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.scale;

        // Add title
        this.add.text(width / 2, height / 3, 'Boulderdash', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Add start button
        const button = this.add.rectangle(width / 2, height / 2, 200, 50, 0x00ff00);
        const buttonText = this.add.text(width / 2, height / 2, 'Start Game', {
            fontSize: '24px',
            color: '#000000'
        }).setOrigin(0.5);

        // Make button interactive
        button.setInteractive();
        button.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        // Add hover effect
        button.on('pointerover', () => {
            button.setFillStyle(0x00dd00);
        });
        button.on('pointerout', () => {
            button.setFillStyle(0x00ff00);
        });
    }
}
