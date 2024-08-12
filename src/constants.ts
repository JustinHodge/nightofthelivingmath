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
export const LOAD_PROGRESS_KEY = 'progress';

export const LOGO_KEY = 'logo';
export const LOGO_FILENAME = 'logo.png';

export const MAP_NODES_KEY = 'mapNodes';
export const MAP_NODES_FILENAME = 'nightofthelivingmathmap.json';

export const SPRITE_SHEET_KEY = 'sprite-sheet';
export const SPRITE_SHEET_FILENAME = 'atlas.png';

export const ATLAS_KEY = 'atlas';
export const ATLAS_JSON_FILENAME = 'atlas.json';
export const ATLAS_IMAGE_FILENAME = 'atlas.png';

export const PLAYER_SPRITE_SHEET_KEY = 'player-sprite-sheet';
export const PLAYER_SPRITE_SHEET_FILENAME = 'player-sprites.png';

export const PLAYER_SPRITE_ATLAS_KEY = 'player-sprites';
export const PLAYER_SPRITE_ATLAS_JSON_FILENAME = 'player-sprites.json';
export const PLAYER_SPRITE_ATLAS_IMAGE_FILENAME = 'player-sprites.png';

export const HUD_KEY = 'hud';
export const HUD_FILENAME = 'HUD.png';

export const BACKGROUND_IMAGE = 'nightofthelivingmathmap.png';
export const BACKGROUND_KEY = 'background';

// SCENE KEYS
export const PRELOADER_KEY = 'Preloader';
export const MAIN_MENU_KEY = 'MainMenu';
export const GAME_KEY = 'Game';
export const GAME_OVER_KEY = 'GameOver';
