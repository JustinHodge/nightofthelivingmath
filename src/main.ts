import {
    GAME_BACKGROUND_COLOR,
    GAME_DEFAULT_PHYSICS_SYSTEM,
    GAME_HEIGHT,
    GAME_PARENT_KEY,
    GAME_WIDTH,
} from './constants';
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: GAME_PARENT_KEY,
    backgroundColor: GAME_BACKGROUND_COLOR,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
    physics: {
        default: GAME_DEFAULT_PHYSICS_SYSTEM,
        arcade: {
            debug: false,
        },
    },
};

export default new Game(config);
