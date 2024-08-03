import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.setPath('assets');
        this.load.image('background', 'nightofthelivingmathmap.png');
        this.load.image('sprite-sheet', 'atlas.png');
        this.load.atlas('atlas', 'atlas.png', 'atlas.json');
        this.load.image('crosshair1', 'PlayerAssets/crosshair1.png');
        this.load.image('crosshair2', 'PlayerAssets/crosshair2.png');
        this.load.image('crosshair3', 'PlayerAssets/crosshair3.png');
        this.load.image('crosshair4', 'PlayerAssets/crosshair4.png');
        this.load.image('crosshair5', 'PlayerAssets/crosshair5.png');
        this.load.image('crosshairmiss', 'PlayerAssets/crosshairmiss.png');
        this.load.image('crosshairhit', 'PlayerAssets/crosshairhit.png');
        this.load.image('health4', 'PlayerAssets/health4.png');
        this.load.image('health3', 'PlayerAssets/health3.png');
        this.load.image('health2', 'PlayerAssets/health2.png');
        this.load.image('health1', 'PlayerAssets/health1.png');
        this.load.image('health0', 'PlayerAssets/health0.png');
    }

    create() {
        this.scene.start('Preloader');
    }
}
