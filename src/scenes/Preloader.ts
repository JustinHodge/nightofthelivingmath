import { Scene } from 'phaser';
import {
    BACKGROUND_KEY,
    GAME_MIDDLE_X,
    GAME_MIDDLE_Y,
    LOAD_PROGRESS_EVENT_KEY,
    PROGRESS_BAR_CONTAINER_HEIGHT,
    PROGRESS_BAR_CONTAINER_STROKE_COLOR,
    PROGRESS_BAR_CONTAINER_STROKE_WIDTH,
    PROGRESS_BAR_CONTAINER_WIDTH,
    PROGRESS_BAR_FILL_HEIGHT,
    PROGRESS_BAR_FILL_X,
    PROGRESS_BAR_FILL_Y,
    PROGRESS_BAR_FILL_INITIAL_WIDTH,
    PROGRESS_BAR_FILL_COLOR,
    PROGRESS_BAR_FILL_MAX_WIDTH,
    ASSETS_PATH,
    LOGO_KEY,
    LOGO_FILENAME,
    MAP_NODES_KEY,
    MAP_NODES_FILENAME,
    ATLAS_KEY,
    ATLAS_IMAGE_FILENAME,
    ATLAS_JSON_FILENAME,
    PLAYER_SPRITE_ATLAS_KEY,
    PLAYER_SPRITE_ATLAS_JSON_FILENAME,
    HUD_KEY,
    HUD_FILENAME,
    MAIN_MENU_SCENE_KEY,
    PRELOADER_SCENE_KEY,
    PLAYER_SPRITE_ATLAS_IMAGE_FILENAME,
} from '../constants';

export class Preloader extends Scene {
    constructor() {
        super(PRELOADER_SCENE_KEY);
    }

    init() {
        this.add.image(GAME_MIDDLE_X, GAME_MIDDLE_Y, BACKGROUND_KEY);

        const progress_container = this.add.rectangle(
            GAME_MIDDLE_X,
            GAME_MIDDLE_Y,
            PROGRESS_BAR_CONTAINER_WIDTH,
            PROGRESS_BAR_CONTAINER_HEIGHT
        );

        progress_container.setStrokeStyle(
            PROGRESS_BAR_CONTAINER_STROKE_WIDTH,
            PROGRESS_BAR_CONTAINER_STROKE_COLOR
        );

        const ProgressFill = this.add.rectangle(
            PROGRESS_BAR_FILL_X,
            PROGRESS_BAR_FILL_Y,
            PROGRESS_BAR_FILL_INITIAL_WIDTH,
            PROGRESS_BAR_FILL_HEIGHT,
            PROGRESS_BAR_FILL_COLOR
        );

        this.load.on(LOAD_PROGRESS_EVENT_KEY, (progress: number) => {
            ProgressFill.width = PROGRESS_BAR_FILL_MAX_WIDTH * progress;
        });
    }

    preload() {
        this.load.setPath(ASSETS_PATH);
        this.load.image(LOGO_KEY, LOGO_FILENAME);
        this.load.json(MAP_NODES_KEY, MAP_NODES_FILENAME);
        this.load.emit(LOAD_PROGRESS_EVENT_KEY, 0.3);

        this.load.atlas(ATLAS_KEY, ATLAS_IMAGE_FILENAME, ATLAS_JSON_FILENAME);
        this.load.emit(LOAD_PROGRESS_EVENT_KEY, 0.7);

        this.load.atlas(
            PLAYER_SPRITE_ATLAS_KEY,
            PLAYER_SPRITE_ATLAS_IMAGE_FILENAME,
            PLAYER_SPRITE_ATLAS_JSON_FILENAME
        );

        this.load.emit(LOAD_PROGRESS_EVENT_KEY, 0.9);

        this.load.image(HUD_KEY, HUD_FILENAME);
        this.load.emit(LOAD_PROGRESS_EVENT_KEY, 1);
    }

    create() {
        this.scene.start(MAIN_MENU_SCENE_KEY);
    }
}
