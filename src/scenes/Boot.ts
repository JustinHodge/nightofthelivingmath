import { Scene } from 'phaser';
import {
    ASSETS_PATH,
    BACKGROUND_IMAGE,
    BACKGROUND_KEY,
    BOOT_SCENE_KEY,
    PRELOADER_SCENE_KEY,
} from '../constants';

export class Boot extends Scene {
    constructor() {
        super(BOOT_SCENE_KEY);
    }

    preload() {
        this.load.setPath(ASSETS_PATH);
        this.load.image(BACKGROUND_KEY, BACKGROUND_IMAGE);
    }

    create() {
        this.scene.start(PRELOADER_SCENE_KEY);
    }
}
