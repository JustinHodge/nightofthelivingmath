import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.background = this.add
            .image(512, 384, 'background')
            .setTint(0xdddddd)
            .setAlpha(0.7);

        this.add
            .rectangle(
                this.game.canvas.width / 2,
                this.game.canvas.height / 2,
                600,
                600,
                0xcccccc,
                0.5
            )
            .setOrigin(0.5, 0.5)
            .setStrokeStyle(3, 0x000000);

        this.logo = this.add.image(512, 300, 'logo');

        const difficulties = [
            {
                label: 'Beginner',
                difficultyNumber: 1,
                description: 'Addition Only',
            },
            {
                label: 'Easy',
                difficultyNumber: 2,
                description: 'Addition and Subtraction',
            },
            {
                label: 'Medium',
                difficultyNumber: 3,
                description: 'Challenging Addition And Subtraction',
            },
            {
                label: 'Hard',
                difficultyNumber: 4,
                description:
                    'Addition, Subtraction, Multiplication, and Division',
            },
            {
                label: 'Impossible',
                difficultyNumber: 5,
                description:
                    'Challenging Addition, Subtraction, Multiplication, and Division',
            },
        ];

        this.data.set('difficulties', difficulties);
        this.data.set('difficulty', difficulties[0]);

        for (const difficulty of difficulties) {
            const gameSelector = this.add
                .text(
                    512,
                    450 + 30 * difficulty.difficultyNumber,
                    difficulty.label,
                    {
                        fontFamily: 'Arial Black',
                        fontSize: 24,
                        color: '#ffffff',
                        stroke: '#000000',
                        strokeThickness: 8,
                        align: 'center',
                    }
                )
                .setOrigin(0.5)
                .setInteractive();

            gameSelector.once(
                'pointerdown',
                (pointer: Phaser.Input.Pointer) => {
                    // this.registry.set('difficulty', difficulty);
                    this.scene.start('Game');
                }
            );

            gameSelector.on('pointerover', (pointer: Phaser.Input.Pointer) => {
                gameSelector.setTint(0xa60000);
            });

            gameSelector.on('pointerout', (pointer: Phaser.Input.Pointer) => {
                gameSelector.clearTint();
            });
        }
    }
}
