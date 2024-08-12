import { Scene, GameObjects } from 'phaser';
import {
    BACKGROUND_KEY,
    GAME_MIDDLE_X,
    GAME_MIDDLE_Y,
    MAIN_MENU_BACKGROUND_ALPHA,
    MAIN_MENU_SCENE_KEY,
    MAIN_MENU_BACKGROUND_TINT,
    MAIN_MENU_CURSOR,
    MAIN_MENU_CONTAINER_X,
    MAIN_MENU_CONTAINER_Y,
    MAIN_MENU_CONTAINER_WIDTH,
    MAIN_MENU_CONTAINER_HEIGHT,
    MAIN_MENU_CONTAINER_FILL_COLOR,
    MAIN_MENU_CONTAINER_FILL_ALPHA,
    MAIN_MENU_CONTAINER_STROKE_COLOR,
    MAIN_MENU_CONTAINER_STROKE_WIDTH,
    LOGO_KEY,
    DIFFICULTIES,
    MAIN_MENU_DIFFICULTY_SELECTOR_PADDING_Y,
    POINTER_DOWN_EVENT_KEY,
    POINTER_OVER_EVENT_KEY,
    GAME_SCENE_KEY,
    POINTER_OUT_EVENT_KEY,
    REGISTRY_DIFFICULTY_KEY,
    MAIN_MENU_DIFFICULTY_SELECTOR_HIGHLIGHT_COLOR,
    MAIN_MENU_DIFFICULTY_SELECTOR_TEXT_STYLE,
} from '../constants';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    menuContainer: GameObjects.Rectangle;

    constructor() {
        super(MAIN_MENU_SCENE_KEY);
    }

    create() {
        this.input.setDefaultCursor(MAIN_MENU_CURSOR);
        this.background = this.add
            .image(GAME_MIDDLE_X, GAME_MIDDLE_Y, BACKGROUND_KEY)
            .setTint(MAIN_MENU_BACKGROUND_TINT)
            .setAlpha(MAIN_MENU_BACKGROUND_ALPHA);

        this.menuContainer = this.add
            .rectangle(
                MAIN_MENU_CONTAINER_X,
                MAIN_MENU_CONTAINER_Y,
                MAIN_MENU_CONTAINER_WIDTH,
                MAIN_MENU_CONTAINER_HEIGHT,
                MAIN_MENU_CONTAINER_FILL_COLOR,
                MAIN_MENU_CONTAINER_FILL_ALPHA
            )
            .setStrokeStyle(
                MAIN_MENU_CONTAINER_STROKE_WIDTH,
                MAIN_MENU_CONTAINER_STROKE_COLOR
            );

        this.logo = this.add.image(GAME_MIDDLE_X, GAME_MIDDLE_Y, LOGO_KEY);
        this.logo.setY(this.logo.y - this.logo.displayHeight / 2);

        this.registry.set(REGISTRY_DIFFICULTY_KEY, DIFFICULTIES[0]);

        for (let i = 0; i < DIFFICULTIES.length; i++) {
            const difficulty = DIFFICULTIES[i];
            const gameSelector = this.add
                .text(
                    GAME_MIDDLE_X,
                    GAME_MIDDLE_Y + 30 * difficulty.difficultyNumber,
                    difficulty.label,
                    MAIN_MENU_DIFFICULTY_SELECTOR_TEXT_STYLE
                )
                .setOrigin(0.5)
                .setInteractive();

            gameSelector.setY(
                gameSelector.y +
                    (gameSelector.displayHeight / 2 +
                        MAIN_MENU_DIFFICULTY_SELECTOR_PADDING_Y * 2) *
                        i
            );

            gameSelector.once(POINTER_DOWN_EVENT_KEY, () => {
                this.registry.set(REGISTRY_DIFFICULTY_KEY, difficulty);
                this.scene.start(GAME_SCENE_KEY);
            });

            gameSelector.on(POINTER_OVER_EVENT_KEY, () => {
                gameSelector.setTint(
                    MAIN_MENU_DIFFICULTY_SELECTOR_HIGHLIGHT_COLOR
                );
            });

            gameSelector.on(POINTER_OUT_EVENT_KEY, () => {
                gameSelector.clearTint();
            });
        }
    }
}
