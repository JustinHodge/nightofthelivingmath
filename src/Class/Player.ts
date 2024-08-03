import { Enemy } from './Enemy';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private maxHealth = 16;
    private health = this.maxHealth;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'crosshair1');
        scene.add.existing(this);
        scene.input.on(
            'pointermove',
            (pointer: { x: number | undefined; y: number | undefined }) => {
                this.setPosition(pointer.x, pointer.y);
                this.setDepth(100);
                this.setScale(2);
            }
        );

        for (let i = 0; i < Math.ceil(this.maxHealth / 4); i++) {
            const healthImage = 'health' + Math.min(this.health - i * 4, 4);
            const healthImageSize = 64;
            scene.add
                .sprite(10, i * healthImageSize, healthImage)
                .setOrigin(0, 0)
                .setDepth(100);
        }
        scene.input.on(
            'gameobjectdown',
            (pointer: Phaser.Input.Pointer, gameObject: Enemy) => {
                this.play('hit').chain('idle');
                gameObject.markAsDead();
            }
        );

        this.createAnims();
        this.play('idle');
    }

    private createAnims() {
        const idleFrames: Phaser.Types.Animations.AnimationFrame[] = [
            { key: 'crosshair3' },
            { key: 'crosshair4' },
            { key: 'crosshair5' },
        ];

        this.anims.create({
            key: 'miss',
            frames: [{ key: 'crosshairmiss' }],
            frameRate: 3,
            repeat: 0,
        });

        this.anims.create({
            key: 'hit',
            frames: [{ key: 'crosshairhit' }],
            frameRate: 3,
            repeat: 0,
        });

        this.anims.create({
            key: 'idle',
            frames: idleFrames,
            frameRate: 1,
            repeat: -1,
        });
    }
}
