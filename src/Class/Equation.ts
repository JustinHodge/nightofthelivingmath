type TDifficulty = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type TEquationElement = 'num1' | 'num2' | 'operator' | 'result';
export type TOperator = '+' | '-' | '*' | '/';

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
    private hiddenComponent: TEquationElement = 'result';

    private readonly hidableElementMap: {
        [K in TDifficulty]: TEquationElement[];
    } = {
        0: ['result', 'num1', 'num2'],
        1: ['result', 'num1', 'num2'],
        2: ['result', 'num1', 'num2', 'operator'],
        3: ['result', 'num1', 'num2'],
        4: ['result', 'num1', 'num2', 'operator'],
        5: ['result', 'num1', 'num2'],
        6: ['result', 'num1', 'num2', 'operator'],
    };

    private readonly operatorsByDifficulty: Record<number, TOperator[]> = {
        0: ['+'],
        1: ['+', '-'],
        2: ['+', '-'],
        3: ['+', '-', '*'],
        4: ['+', '-', '*'],
        5: ['+', '-', '*', '/'],
        6: ['+', '-', '*', '/'],
    };

    constructor(difficulty: TDifficulty = 0) {
        this.generateEquation(difficulty);
    }

    public getVisibleEquation() {
        return this.visibleString;
    }

    public getInvisibleElement(): number | TOperator {
        return this[this.hiddenComponent].value;
    }

    private generateEquation(difficulty: TDifficulty) {
        const operators = this.operatorsByDifficulty[difficulty];

        while (
            !Number.isInteger(this.num1?.value) ||
            !Number.isInteger(this.num2?.value) ||
            !Number.isInteger(this.result?.value)
        ) {
            this.num1 = {
                value: Math.floor(Math.random() * 100),
                visible: true,
            };
            this.operator = {
                value: operators[Math.floor(Math.random() * operators.length)],
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

        const hidableElements = this.hidableElementMap[difficulty];
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
