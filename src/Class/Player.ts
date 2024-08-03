import { gameSize } from '../main';
import { Enemy } from './Enemy';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private maxHealth = 16;
    private health = this.maxHealth;
    private healthOrbs: Phaser.GameObjects.Image[] = [];
    private currentScore = 0;
    private scoreDisplay: Phaser.GameObjects.Text;

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

        this.scoreDisplay = scene.add.text(10, 5, 'Score: 0', {
            fontSize: '20px',
            backgroundColor: '#cccccccc',
            padding: {
                x: 10,
                y: 5,
            },
            stroke: '#000000',
            strokeThickness: 4,
        });

        this.setHealthOrbs();
        this.setScore();

        scene.input.on(
            'gameobjectdown',
            (pointer: Phaser.Input.Pointer, gameObject: Enemy) => {
                this.play('hit').chain('idle');
                this.scene.events.emit('playerHitEnemy', gameObject);
            }
        );

        this.createAnims();
        this.play('idle');
    }

    public addScore(score: number) {
        this.currentScore += score;
        this.setScore();
    }

    public isDead() {
        return this.health <= 0;
    }

    public takeDamage(damage: number) {
        this.health = Math.max(this.health - damage, 0);
        this.setHealthOrbs();
    }

    private setScore() {
        this.scoreDisplay.setText('Score: ' + this.currentScore);
    }

    private setHealthOrbs() {
        for (const healthOrb of this.healthOrbs) {
            healthOrb.destroy();
        }

        this.healthOrbs = [];

        for (let i = 0; i < Math.ceil(this.maxHealth / 4); i++) {
            const healthInThisOrb = this.health - i * 4;
            const imageNumber =
                healthInThisOrb >= 0 ? Math.min(healthInThisOrb, 4) : 0;
            const healthImage = 'health' + imageNumber;
            const healthImageSize = 64;

            const newOrb = this.scene.add
                .sprite(gameSize.width - 75, i * healthImageSize, healthImage)
                .setOrigin(0, 0)
                .setDepth(100);

            this.healthOrbs.push(newOrb);
        }
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
