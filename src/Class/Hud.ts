import {
    ATLAS_KEY,
    GAME_HEIGHT,
    GAME_WIDTH,
    HUD_DEPTH,
    HUD_DIGIT_MAP,
    HUD_KEY,
    HUD_LOADED_EQUATION_TEXT_STYLE,
    HUD_RELOAD_STRING,
    HUD_SCORE_DISPLAY_DIGIT_PADDING,
    HUD_SCORE_DISPLAY_DIGITS,
    LOADED_EQUATION_ELEMENT_DEPTH,
    SCORE_DISPLAY_DEPTH,
} from '../constants';
import { TEquationElement } from '../vite-env';

export class Hud extends Phaser.GameObjects.Image {
    private score: number = 0;
    private currentItem: string | null = null;
    private scoreDisplay: Phaser.GameObjects.Image[] = [];
    private loadedEquationElement: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, HUD_KEY);

        this.setScale(GAME_WIDTH / this.width);
        this.setY(GAME_HEIGHT - this.height);
        this.setX(GAME_WIDTH / 2);
        this.setDepth(HUD_DEPTH);

        this.initScoreDisplay();
        this.initLoadedEquationElement();

        scene.add.existing(this);
    }

    public setScore(newScore: number) {
        this.score = newScore;
        this.updateScoreDisplay();
    }

    public setCurrentItem(item: string | null) {
        this.currentItem = item;
    }

    public animateReload() {
        // TODO add animation
        throw new Error('Method not implemented.');
    }

    public updateLoadedEquationElement(newElement: TEquationElement | null) {
        this.loadedEquationElement.setText(newElement ?? HUD_RELOAD_STRING);
    }

    private initLoadedEquationElement() {
        this.loadedEquationElement = new Phaser.GameObjects.Text(
            this.scene,
            GAME_HEIGHT,
            0,
            '',
            HUD_LOADED_EQUATION_TEXT_STYLE
        );

        this.loadedEquationElement.setY(
            this.scene.sys.canvas.height -
                this.loadedEquationElement.displayHeight -
                (this.displayHeight - this.loadedEquationElement.displayHeight)
        );

        this.scene.add.existing(this.loadedEquationElement);

        this.loadedEquationElement.setDepth(LOADED_EQUATION_ELEMENT_DEPTH);

        this.updateLoadedEquationElement(null);
    }

    private updateScoreDisplay() {
        for (let i = 0; i < this.scoreDisplay.length; i++) {
            this.scoreDisplay[i].setTexture(
                ATLAS_KEY,
                HUD_DIGIT_MAP[this.score.toString()[i] ?? '0']
            );
        }
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

        this.updateScoreDisplay();
    }
}
