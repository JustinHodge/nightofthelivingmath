import { Scene } from 'phaser';
import { gameSize } from '../main';
export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(
            gameSize.middleX,
            gameSize.middleY,
            'background'
        );
        this.background.setAlpha(0.5);

        this.anims.create({
            key: 'walkup',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'Player Character Walking Animation Frames/Zombie-Tileset---_',
                start: 482,
                end: 483,
                zeroPad: 4,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.add
            .sprite(
                gameSize.middleX,
                gameSize.height - gameSize.height / 10,
                'atlas',
                'Player Character Walking Animation Frames/Zombie-Tileset---_0482'
            )
            .play('walkup');

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }
}
