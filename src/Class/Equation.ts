import { EQUATION_DEFAULT_HIDDEN_COMPONENT } from '../constants';
import { TOperator, TEquationElement, TDifficulty } from '../vite-env';

export class Equation {
    private num1: {
        value: number;
        visible: boolean;
    };
    private num2: {
        value: number;
        visible: boolean;
    };
    private operator: {
        value: TOperator;
        visible: boolean;
    };
    private result: {
        value: number;
        visible: boolean;
    };

    private visibleString: string = '';
    private hiddenComponent: TEquationElement =
        EQUATION_DEFAULT_HIDDEN_COMPONENT;

    constructor(difficulty: TDifficulty) {
        this.generateEquation(difficulty);
    }

    public getVisibleEquation() {
        return this.visibleString;
    }

    public getInvisibleElement(): number | TOperator {
        return this[this.hiddenComponent].value;
    }

    private generateEquation(difficulty: TDifficulty) {
        const operators = difficulty.operators;

        this.operator = {
            value: operators[Math.floor(Math.random() * operators.length)],
            visible: true,
        };

        while (
            !Number.isInteger(this.num1?.value) ||
            !Number.isInteger(this.num2?.value) ||
            !Number.isInteger(this.result?.value)
        ) {
            this.num1 = {
                value: Math.floor(Math.random() * 100),
                visible: true,
            };
            this.num2 = {
                value: Math.floor(Math.random() * 100),
                visible: true,
            };
            const testString =
                '' + this.num1.value + this.operator.value + this.num2.value;

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
        this.visibleString += this.num1.visible ? this.num1.value : ' ? ';
        this.visibleString += this.operator.visible
            ? this.operator.value
            : ' ? ';
        this.visibleString += this.num2.visible ? this.num2.value : ' ? ';
        this.visibleString += '=';
        this.visibleString += this.result.visible ? this.result.value : ' ? ';
    }
}
