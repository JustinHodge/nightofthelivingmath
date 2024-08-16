import {
    EQUATION_DEFAULT_HIDDEN_COMPONENT,
    EQUATION_ELEMENT,
    EQUATION_OPERATOR,
} from '../constants';
import { TDifficulty } from '../vite-env';

export class Equation {
    private [EQUATION_ELEMENT.operand1]: {
        value: number;
        visible: boolean;
    };
    private [EQUATION_ELEMENT.operand2]: {
        value: number;
        visible: boolean;
    };
    private [EQUATION_ELEMENT.operator]: {
        value: EQUATION_OPERATOR;
        visible: boolean;
    };
    private [EQUATION_ELEMENT.result]: {
        value: number;
        visible: boolean;
    };

    private enemyString: string = '';
    private playerString: string = '';
    private hiddenComponent: EQUATION_ELEMENT =
        EQUATION_DEFAULT_HIDDEN_COMPONENT;

    constructor(difficulty: TDifficulty) {
        this.generateEquation(difficulty);
    }

    public getEnemyString() {
        return this.enemyString;
    }

    public getPlayerString() {
        return this.playerString;
    }

    private generateEquation(difficulty: TDifficulty) {
        const operators = difficulty.operators;

        this.operator = {
            value: operators[Math.floor(Math.random() * operators.length)],
            visible: true,
        };

        while (
            !Number.isInteger(this[EQUATION_ELEMENT.operand1]?.value) ||
            !Number.isInteger(this[EQUATION_ELEMENT.operand2]?.value) ||
            !Number.isInteger(this.result?.value)
        ) {
            this[EQUATION_ELEMENT.operand1] = {
                value: Math.floor(Math.random() * 100),
                visible: true,
            };
            this[EQUATION_ELEMENT.operand2] = {
                value: Math.floor(Math.random() * 100),
                visible: true,
            };
            const testString = (
                this[EQUATION_ELEMENT.operand1].value +
                this.operator.value +
                this[EQUATION_ELEMENT.operand2].value
            ).toString();

            this.result = {
                value: eval(testString),
                visible: true,
            };
        }

        this.hideElement(difficulty);

        this.buildPlayerString();

        this.buildEnemyString();
    }

    private hideElement(difficulty: TDifficulty) {
        const hidableElements = difficulty.hidableElements;
        this.hiddenComponent =
            hidableElements[Math.floor(Math.random() * hidableElements.length)];
        this[this.hiddenComponent].visible = false;
    }

    private buildPlayerString() {
        this.playerString = this[this.hiddenComponent].value.toString();
    }

    private buildEnemyString() {
        this.enemyString += this[EQUATION_ELEMENT.operand1].visible
            ? this[EQUATION_ELEMENT.operand1].value
            : ' ? ';
        this.enemyString += this.operator.visible ? this.operator.value : ' ? ';
        this.enemyString += this[EQUATION_ELEMENT.operand2].visible
            ? this[EQUATION_ELEMENT.operand2].value
            : ' ? ';
        this.enemyString += '=';
        this.enemyString += this.result.visible ? this.result.value : ' ? ';
    }
}
