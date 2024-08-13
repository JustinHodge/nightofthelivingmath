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

    private visibleString: string = '';
    private hiddenComponent: EQUATION_ELEMENT =
        EQUATION_DEFAULT_HIDDEN_COMPONENT;

    constructor(difficulty: TDifficulty) {
        this.generateEquation(difficulty);
    }

    public getVisibleEquation() {
        return this.visibleString;
    }

    public getInvisibleElement(): number | EQUATION_OPERATOR {
        return this[this.hiddenComponent].value;
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

        const hidableElements = difficulty.hidableElements;
        this.hiddenComponent =
            hidableElements[Math.floor(Math.random() * hidableElements.length)];
        this[this.hiddenComponent].visible = false;

        this.buildVisibleString();
    }

    private buildVisibleString() {
        this.visibleString += this[EQUATION_ELEMENT.operand1].visible
            ? this[EQUATION_ELEMENT.operand1].value
            : ' ? ';
        this.visibleString += this.operator.visible
            ? this.operator.value
            : ' ? ';
        this.visibleString += this[EQUATION_ELEMENT.operand2].visible
            ? this[EQUATION_ELEMENT.operand2].value
            : ' ? ';
        this.visibleString += '=';
        this.visibleString += this.result.visible ? this.result.value : ' ? ';
    }
}
