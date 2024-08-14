import { Time } from 'phaser';
import {
    ATLAS_KEY,
    EQUATION_BACKGROUND_MARGIN,
    EQUATION_OPERATOR,
    GAME_HEIGHT,
    GAME_WIDTH,
    HUD_DEPTH,
    HUD_DIGIT_MAP,
    HUD_KEY,
    HUD_LOADED_EQUATION_TEXT_STYLE,
    HUD_RELOAD_STRING,
    HUD_SCORE_DISPLAY_DIGIT_PADDING,
    HUD_SCORE_DISPLAY_DIGITS,
    LOADED_EQUATION_BACKGROUND_IMAGE,
    LOADED_EQUATION_ELEMENT_DEPTH,
    PLAYER_RELOAD_EVENT_KEY,
    POINTER_DOWN_EVENT_KEY,
    SCORE_DISPLAY_DEPTH,
} from '../constants';

export class Hud extends Phaser.GameObjects.Image {
    private currentItem: string | null = null;
    private scoreDisplay: Phaser.GameObjects.Image[] = [];
    private loadedEquationElement: Phaser.GameObjects.Text;
    private loadedEquationContainer: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, HUD_KEY);

        this.setScale(GAME_WIDTH / this.width);
        this.setY(GAME_HEIGHT - this.height);
        this.setX(GAME_WIDTH / 2);
        this.setDepth(HUD_DEPTH);

        this.initScoreDisplay();
        this.initLoadedEquationContainer();

        scene.add.existing(this);
    }

    public setScore(newScore: number) {
        const scoreString = newScore
            .toString()
            .padStart(HUD_SCORE_DISPLAY_DIGITS, '0');

        for (let i = 0; i < HUD_SCORE_DISPLAY_DIGITS; i++) {
            this.scoreDisplay[i].setTexture(
                ATLAS_KEY,
                HUD_DIGIT_MAP[scoreString[i] ?? '0']
            );
        }
    }

    public setCurrentItem(item: string | null) {
        this.currentItem = item;
    }

    public animateReload() {
        // TODO add animation
        throw new Error('Method not implemented.');
    }

    public setLoadedEquationElement(
        newElement: number | EQUATION_OPERATOR | null
    ) {
        this.loadedEquationElement.setText(
            (newElement ?? HUD_RELOAD_STRING).toString()
        );
    }

    private initLoadedEquationContainer() {
        const usableHUDSectionPercent = 0.25;
        const numberOfIcons = 3;
        const iconWidth =
            (this.displayWidth * usableHUDSectionPercent) / numberOfIcons -
            EQUATION_BACKGROUND_MARGIN;
        this.loadedEquationElement = new Phaser.GameObjects.Text(
            this.scene,
            0,
            0,
            '',
            HUD_LOADED_EQUATION_TEXT_STYLE
        );

        const loadedEquationBackgroundSprite = new Phaser.GameObjects.Sprite(
            this.scene,
            EQUATION_BACKGROUND_MARGIN / 2,
            EQUATION_BACKGROUND_MARGIN / 2,
            ATLAS_KEY,
            LOADED_EQUATION_BACKGROUND_IMAGE
        );

        loadedEquationBackgroundSprite.setDisplaySize(
            iconWidth,
            this.displayHeight - EQUATION_BACKGROUND_MARGIN
        );

        this.loadedEquationContainer = new Phaser.GameObjects.Container(
            this.scene,
            0,
            0,
            [loadedEquationBackgroundSprite, this.loadedEquationElement]
        );

        this.loadedEquationContainer.setX(GAME_WIDTH - iconWidth * 3);

        this.loadedEquationContainer.setY(GAME_HEIGHT - this.displayHeight / 2);

        this.scene.add.existing(this.loadedEquationContainer);

        this.loadedEquationContainer.setDepth(LOADED_EQUATION_ELEMENT_DEPTH);

        loadedEquationBackgroundSprite.setInteractive();

        loadedEquationBackgroundSprite.on(POINTER_DOWN_EVENT_KEY, () => {
            this.loadedEquationElement.setText('');
            this.scene.add
                .tween({
                    targets: loadedEquationBackgroundSprite,
                    scale: 2,
                    duration: 500,
                    yoyo: true,
                    repeat: 1,
                    ease: 'Linear',
                })
                .setCallback('onUpdate', (tween: Phaser.Tweens.Tween) => {
                    const percentComplete = tween.totalProgress;
                    const maxDots = 4;
                    const dotRepeats = 2;

                    this.loadedEquationElement.setText(
                        '.'.repeat(
                            Math.floor(percentComplete * maxDots * dotRepeats) %
                                maxDots
                        )
                    );
                })
                .setCallback('onComplete', () => {
                    this.scene.events.emit(PLAYER_RELOAD_EVENT_KEY);
                });
        });

        this.setLoadedEquationElement(null);
    }

    private initScoreDisplay() {
        const baseLocation = 150;

        this.scoreDisplay = [];

        for (let i = 0; i < HUD_SCORE_DISPLAY_DIGITS; i++) {
            const newDigit = new Phaser.GameObjects.Image(
                this.scene,
                0,
                0,
                ATLAS_KEY,
                HUD_DIGIT_MAP[0]
            );

            newDigit.setScale(3);
            newDigit.setDepth(SCORE_DISPLAY_DEPTH);
            const newX =
                baseLocation +
                i * (newDigit.displayWidth + HUD_SCORE_DISPLAY_DIGIT_PADDING);
            const newY = this.scene.sys.canvas.height - newDigit.displayHeight;

            newDigit.setX(newX);
            newDigit.setY(newY);

            this.scene.add.existing(newDigit);
            this.scoreDisplay.push(newDigit);
        }

        this.setScore(0);
    }
}
