/// <reference types="vite/client" />
export type TOperator = '+' | '-' | '*' | '/';

export type TDifficulty = {
    label: string;
    difficultyNumber: number;
    description: string;
    hidableElements: TEquationElement[];
    operators: TOperator[];
};

export type TEquationElement = 'num1' | 'num2' | 'operator' | 'result';
