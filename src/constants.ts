import { IEnemyData, TDifficulty } from './vite-env';

// ENUMS
export enum EQUATION_ELEMENT {
    result = 'result',
    operator = 'operator',
    operand1 = 'operand1',
    operand2 = 'operand2',
}
export enum ENEMY_TYPES {
    bigZombie = 'bigZombie',
}

export enum ENEMY_FACING_DIRECTIONS {
    down = 'down',
    left = 'left',
    right = 'right',
    up = 'up',
    idle = 'idle',
    death = 'death',
}

export enum EQUATION_OPERATOR {
    addition = '+',
    subtraction = '-',
    multiplication = '*',
    division = '/',
}

export const ASSETS_PATH = 'assets';
export const ASSETS_URL = `/${ASSETS_PATH}`;

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;
export const GAME_MIDDLE_X = GAME_WIDTH / 2;
export const GAME_MIDDLE_Y = GAME_HEIGHT / 2;
export const GAME_PARENT_KEY = 'game-container';
export const GAME_BACKGROUND_COLOR = ' #222222';
export const GAME_DEFAULT_PHYSICS_SYSTEM = 'arcade';

export const PROGRESS_BAR_CONTAINER_HEIGHT = 32;
export const PROGRESS_BAR_CONTAINER_WIDTH = 468;
export const PROGRESS_BAR_CONTAINER_STROKE_WIDTH = 1;
export const PROGRESS_BAR_CONTAINER_STROKE_COLOR = 0xffffff;
export const PROGRESS_BAR_CONTAINER_Y_PADDING = 2;
export const PROGRESS_BAR_CONTAINER_X_PADDING = 13;
export const PROGRESS_BAR_FILL_X =
    GAME_MIDDLE_X -
    (PROGRESS_BAR_CONTAINER_WIDTH - PROGRESS_BAR_CONTAINER_X_PADDING * 2) / 2;
export const PROGRESS_BAR_FILL_Y = GAME_MIDDLE_Y;
export const PROGRESS_BAR_FILL_HEIGHT =
    PROGRESS_BAR_CONTAINER_HEIGHT - PROGRESS_BAR_CONTAINER_Y_PADDING * 2;
export const PROGRESS_BAR_FILL_COLOR = 0xffffff;
export const PROGRESS_BAR_FILL_INITIAL_WIDTH = 4;
export const PROGRESS_BAR_FILL_MAX_WIDTH =
    PROGRESS_BAR_CONTAINER_WIDTH - PROGRESS_BAR_CONTAINER_X_PADDING * 2;

export const LOGO_KEY = 'logo';
export const LOGO_FILENAME = 'logo.png';

export const MAP_NODES_KEY = 'mapNodes';
export const MAP_NODES_FILENAME = 'nightofthelivingmathmap.json';

export const ATLAS_KEY = 'atlas';
export const ATLAS_JSON_FILENAME = 'atlas.json';
export const ATLAS_IMAGE_FILENAME = 'atlas.png';

export const PLAYER_SPRITE_ATLAS_KEY = 'player-sprites';
export const PLAYER_SPRITE_ATLAS_JSON_FILENAME = 'player-sprites.json';
export const PLAYER_SPRITE_ATLAS_IMAGE_FILENAME = 'player-sprites.png';

export const HUD_KEY = 'hud';
export const HUD_FILENAME = 'HUD.png';

export const BACKGROUND_IMAGE = 'nightofthelivingmathmap.png';
export const BACKGROUND_KEY = 'background';

export const MAIN_MENU_BACKGROUND_ALPHA = 0.7;
export const MAIN_MENU_BACKGROUND_TINT = 0xdddddd;
export const MAIN_MENU_CURSOR = 'auto';
export const MAIN_MENU_CONTAINER_X = GAME_MIDDLE_X;
export const MAIN_MENU_CONTAINER_Y = GAME_MIDDLE_Y;
export const MAIN_MENU_CONTAINER_WIDTH = 600;
export const MAIN_MENU_CONTAINER_HEIGHT = 600;
export const MAIN_MENU_CONTAINER_FILL_COLOR = 0xcccccc;
export const MAIN_MENU_CONTAINER_FILL_ALPHA = 0.5;
export const MAIN_MENU_CONTAINER_STROKE_COLOR = 0x000000;
export const MAIN_MENU_CONTAINER_STROKE_WIDTH = 3;
export const MAIN_MENU_DIFFICULTY_SELECTOR_PADDING_Y = 0;
export const MAIN_MENU_DIFFICULTY_SELECTOR_HIGHLIGHT_COLOR = 0xa60000;
export const MAIN_MENU_DIFFICULTY_SELECTOR_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle =
    {
        fontFamily: 'Arial Black',
        fontSize: 24,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
    };

export const GAME_CURSOR = 'none';

export const MAIN_MENU_LOGO_X = GAME_MIDDLE_X;
export const MAIN_MENU_LOGO_Y = GAME_MIDDLE_Y;

export const BASE_ENEMY_DAMAGE = 1;

export const CURRENT_EQUATION_ELEMENT_DISPLAY_X = 750;
export const CURRENT_EQUATION_ELEMENT_DISPLAY_Y = 700;
export const CURRENT_EQUATION_ELEMENT_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle =
    {
        fontSize: '20px',
        backgroundColor: '#cccccccc',
        padding: {
            x: 10,
            y: 5,
        },
        stroke: '#000000',
        strokeThickness: 4,
    };

export const PLAYER_START_X = GAME_MIDDLE_X;
export const PLAYER_START_Y = GAME_MIDDLE_Y;
export const PLAYER_SPRITE_FRAME_3 = 'crosshair/crosshair3.png';
export const PLAYER_SPRITE_FRAME_4 = 'crosshair/crosshair4.png';
export const PLAYER_SPRITE_FRAME_5 = 'crosshair/crosshair5.png';
export const PLAYER_SPRITE_MISS_FRAME = 'crosshair/crosshairmiss.png';
export const PLAYER_SPRITE_HIT_FRAME = 'crosshair/crosshairhit.png';
export const PLAYER_MAX_HEALTH = 16;
export const PLAYER_SPRITE_SCALE = 2;
export const PLAYER_HEALTH_ORB_SPRITE_FRAMES: Record<number, string> = {
    0: 'health/health0.png',
    1: 'health/health1.png',
    2: 'health/health2.png',
    3: 'health/health3.png',
    4: 'health/health4.png',
};
export const PLAYER_HEALTH_ORB_IMAGE_SIZE = 64;

export const HUD_DIGIT_MAP: Record<string, string> = {
    '0': 'UI Elements/Zombie-Tileset---_0501',
    '1': 'UI Elements/Zombie-Tileset---_0502',
    '2': 'UI Elements/Zombie-Tileset---_0503',
    '3': 'UI Elements/Zombie-Tileset---_0504',
    '4': 'UI Elements/Zombie-Tileset---_0505',
    '5': 'UI Elements/Zombie-Tileset---_0506',
    '6': 'UI Elements/Zombie-Tileset---_0507',
    '7': 'UI Elements/Zombie-Tileset---_0508',
    '8': 'UI Elements/Zombie-Tileset---_0509',
    '9': 'UI Elements/Zombie-Tileset---_0510',
};
export const HUD_NO_ENEMY_STRING = 'NO ENEMY!';
export const HUD_LOADED_EQUATION_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle =
    {
        fontSize: '20px',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'left',
    };

export const HUD_SCORE_DISPLAY_DIGITS = 6;
export const HUD_SCORE_DISPLAY_DIGIT_PADDING = 10;

export const EQUATION_DEFAULT_HIDDEN_COMPONENT: EQUATION_ELEMENT =
    EQUATION_ELEMENT.result;

export const ENEMY_SPEECH_BUBBLE_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle =
    {
        padding: {
            x: 1,
            y: 1,
        },
        backgroundColor: '#ffffff99',
        color: '#000000',
        fontSize: '1.5rem',
        align: 'center',
        shadow: {
            offsetX: 2,
            offsetY: 2,
            blur: 2,
            color: '#000000',
            fill: true,
            stroke: true,
        },
    };
export const ENEMY_ANIMATION_FRAME_RATE = 5;

export const ENEMY_DATA: IEnemyData = {
    [ENEMY_TYPES.bigZombie]: {
        animationFrameData: {
            [ENEMY_FACING_DIRECTIONS.down]: {
                prefix: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_',
                digitsInFrame: 4,
                frameSet: [412, 413, 414],
            },
            [ENEMY_FACING_DIRECTIONS.left]: {
                prefix: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_',
                digitsInFrame: 4,
                frameSet: [415, 416, 417],
            },
            [ENEMY_FACING_DIRECTIONS.right]: {
                prefix: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_',
                digitsInFrame: 4,
                frameSet: [415, 416, 417],
            },
            [ENEMY_FACING_DIRECTIONS.up]: {
                prefix: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_',
                digitsInFrame: 4,
                frameSet: [418, 419, 420],
            },
            [ENEMY_FACING_DIRECTIONS.death]: {
                prefix: 'Damaged Big Zombie Animation Frames/Zombie-Tileset---_',
                digitsInFrame: 4,
                frameSet: [421, 422, 421, 422, 421, 422, 423],
            },
            [ENEMY_FACING_DIRECTIONS.idle]: {
                prefix: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_',
                digitsInFrame: 4,
                frameSet: [412, 415, 418, 421],
            },
        },
        getScoreMultiplier: () => 100,
    },
};

export const EQUATION_BACKGROUND_MARGIN = 10;
export const LOADED_EQUATION_BACKGROUND_IMAGE =
    'Inventory interface/SHOTGUN_SLOT';
export const ITEM_EMPTY_BACKGROUND_IMAGE = 'Inventory interface/EMPTY_SLOT';
export const ITEM_HEALTH_KIT_BACKGROUND_IMAGE =
    'Inventory interface/HEALTH_KIT_SLOT';
export const ITEM_BOMB_BACKGROUND_IMAGE = 'Inventory interface/GRENADE_SLOT';
export const DROP_BOMB_IMAGE =
    'Pickable Items and Weapons/Zombie-Tileset---_0328';
export const DROP_HEALTH_KIT_IMAGE =
    'Pickable Items and Weapons/Zombie-Tileset---_0340';

// DEPTH LAYERS
export const PLAYER_SPRITE_DEPTH = 1700;
export const PLAYER_HEALTH_ORB_DEPTH = 100;
export const HUD_DEPTH = 1600;
export const LOADED_EQUATION_ELEMENT_DEPTH = 1601;
export const SCORE_DISPLAY_DEPTH = 1602;

// REGISTRY KEYS
export const REGISTRY_DIFFICULTY_KEY = 'difficulty';

// ANIMATION KEYS
export const PLAYER_IDLE_ANIMATION_KEY = 'PlayerIdleAnimation';
export const PLAYER_MISS_ANIMATION_KEY = 'PlayerMissAnimation';
export const PLAYER_HIT_ANIMATION_KEY = 'PlayerHitAnimation';
export const ENEMY_DEATH_ANIMATION_KEY = 'EnemyDeathAnimation';
export const ENEMY_WALK_DOWN_ANIMATION_KEY = 'EnemyWalkDownAnimation';
export const ENEMY_WALK_LEFT_ANIMATION_KEY = 'EnemyWalkLeftAnimation';
export const ENEMY_WALK_RIGHT_ANIMATION_KEY = 'EnemyWalkRightAnimation';
export const ENEMY_WALK_UP_ANIMATION_KEY = 'EnemyWalkUpAnimation';

// EVENT KEYS
export const LOAD_PROGRESS_EVENT_KEY = 'progress';
export const POINTER_DOWN_EVENT_KEY = 'pointerdown';
export const POINTER_OVER_EVENT_KEY = 'pointerover';
export const POINTER_OUT_EVENT_KEY = 'pointerout';
export const POINTER_MOVE_EVENT_KEY = 'pointermove';
export const ANIMATION_COMPLETED_EVENT_KEY = 'animationcomplete';
export const GAME_OBJECT_DOWN_EVENT_KEY = 'gameobjectdown';
export const ENEMY_HIT_PLAYER_EVENT_KEY = 'enemyHitPlayer';
export const PLAYER_KILLED_ENEMY_EVENT_KEY = 'playerKilledEnemy';
export const PLAYER_HIT_ENEMY_EVENT_KEY = 'playerHitEnemy';
export const PLAYER_RELOAD_EVENT_KEY = 'playerReload';
export const PLAYER_PICKED_UP_DROP_EVENT_KEY = 'playerPickedUpDrop';
export const PLAYER_HEAL_EVENT_KEY = 'playerHeal';
export const PLAYER_BOMB_EVENT_KEY = 'playerBomb';

// SCENE KEYS
export const PRELOADER_SCENE_KEY = 'Preloader';
export const MAIN_MENU_SCENE_KEY = 'MainMenu';
export const GAME_SCENE_KEY = 'Game';
export const GAME_OVER_SCENE_KEY = 'GameOver';
export const BOOT_SCENE_KEY = 'Boot';

// MATH CONSTANTS
export const MILLIS_IN_SECOND = 1000;
export const RIGHT_FACING_ANGLES = {
    max: Math.PI / 4,
    min: 2 * Math.PI - Math.PI / 4,
};

export const DOWN_FACING_ANGLES = {
    max: Math.PI / 2 + Math.PI / 4,
    min: Math.PI / 4,
};

export const LEFT_FACING_ANGLES = {
    max: Math.PI + Math.PI / 4,
    min: Math.PI / 2 + Math.PI / 4,
};

export const UP_FACING_ANGLES = {
    max: 2 * Math.PI - Math.PI / 4,
    min: Math.PI + Math.PI / 4,
};

// GAME_CONSTANTS
export const ANIMATION_INFINITE_REPEAT = -1;
export const DIFFICULTIES: TDifficulty[] = [
    {
        label: 'Beginner',
        difficultyNumber: 1,
        description: 'Addition Only',
        hidableElements: [
            EQUATION_ELEMENT.operand1,
            EQUATION_ELEMENT.operand2,
            EQUATION_ELEMENT.result,
        ],
        operators: [EQUATION_OPERATOR.addition],
    },
    {
        label: 'Easy',
        difficultyNumber: 2,
        description: 'Addition and Subtraction',
        hidableElements: [
            EQUATION_ELEMENT.operand1,
            EQUATION_ELEMENT.operand2,
            EQUATION_ELEMENT.result,
        ],
        operators: [EQUATION_OPERATOR.addition, EQUATION_OPERATOR.subtraction],
    },
    {
        label: 'Medium',
        difficultyNumber: 3,
        description: 'Challenging Addition And Subtraction',
        hidableElements: [
            EQUATION_ELEMENT.operand1,
            EQUATION_ELEMENT.operand2,
            EQUATION_ELEMENT.result,
            EQUATION_ELEMENT.operator,
        ],
        operators: [EQUATION_OPERATOR.addition, EQUATION_OPERATOR.subtraction],
    },
    {
        label: 'Hard',
        difficultyNumber: 4,
        description: 'Addition, Subtraction, Multiplication, and Division',
        hidableElements: [
            EQUATION_ELEMENT.operand1,
            EQUATION_ELEMENT.operand2,
            EQUATION_ELEMENT.result,
        ],
        operators: [
            EQUATION_OPERATOR.addition,
            EQUATION_OPERATOR.subtraction,
            EQUATION_OPERATOR.multiplication,
            EQUATION_OPERATOR.division,
        ],
    },
    {
        label: 'Impossible',
        difficultyNumber: 5,
        description:
            'Challenging Addition, Subtraction, Multiplication, and Division',
        hidableElements: [
            EQUATION_ELEMENT.operand1,
            EQUATION_ELEMENT.operand2,
            EQUATION_ELEMENT.result,
            EQUATION_ELEMENT.operator,
        ],
        operators: [
            EQUATION_OPERATOR.addition,
            EQUATION_OPERATOR.subtraction,
            EQUATION_OPERATOR.multiplication,
            EQUATION_OPERATOR.division,
        ],
    },
];
