/// <reference types="vite/client" />

import { ENEMY_TYPES } from './constants';

export type TOperator = '+' | '-' | '*' | '/';

export type TDifficulty = {
    label: string;
    difficultyNumber: number;
    description: string;
    hidableElements: TEquationElement[];
    operators: TOperator[];
};

export type TEquationElement = 'num1' | 'num2' | 'operator' | 'result';

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
