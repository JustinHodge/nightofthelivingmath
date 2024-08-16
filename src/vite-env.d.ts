/// <reference types="vite/client" />

import { ENEMY_TYPES, EQUATION_ELEMENT, EQUATION_OPERATOR } from './constants';

export type TDifficulty = {
    label: string;
    difficultyNumber: number;
    description: string;
    hidableElements: EQUATION_ELEMENT[];
    operators: EQUATION_OPERATOR[];
};

export interface IPathNode {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type IEnemyData = {
    [key in ENEMY_TYPES]: IEnemyConfig;
};

export type TAnimationFrameData = {
    [key in ENEMY_FACING_DIRECTIONS]: IAnimationFrameData;
};

export interface IEnemyConfig {
    animationFrameData: TAnimationFrameData;
    getScoreMultiplier: () => number;
}

export interface IAnimationFrameData {
    prefix: string;
    digitsInFrame: number;
    frameSet: number[];
}

export interface ICoordinate {
    x: number;
    y: number;
}

export interface IPlayerKilledEventData {
    score: number;
    killPosition: ICoordinate;
}
