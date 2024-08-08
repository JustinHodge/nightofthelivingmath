import { Scene } from 'phaser';
import { gameSize } from '../main';
import { Enemy } from '../Class/Enemy';
import { Player } from '../Class/Player';
import { Equation, TOperator } from '../Class/Equation';

export interface IPathNode {
    x: number;
    y: number;
    width: number;
    height: number;
}
export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    private enemies: Enemy[] = [];
    private player: Player;
    private invisibleEquationElements: (number | TOperator)[] = [];
    private currentEquationElement: number | TOperator;
    private currentEquationElementDisplay: Phaser.GameObjects.Text;

    private PATH_NODES: IPathNode[];

    constructor() {
        super('Game');
    }

    create() {
        this.PATH_NODES = this.cache.json.get('mapNodes');

        this.camera = this.cameras.main;

        this.background = this.add.image(
            gameSize.middleX,
            gameSize.middleY,
            'background'
        );

        this.createPlayer();
    }

    update() {
        this.enemies = this.enemies.filter((enemy) => {
            return enemy.active;
        });

        this.checkGameOver();

        this.enemies.forEach((enemy) => {
            enemy.update();
        });

        this.player.update();

        this.executeSpawn();
    }

    private checkGameOver() {
        if (this.player.isDead()) {
            this.enemies = [];
            this.scene.stop('Game');
            this.scene.start('GameOver');
        }
    }

    private createPlayer() {
        this.player = new Player(this, 300, 300);

        this.input.setDefaultCursor('none');

        this.createEventHandlers();

        this.displayCurrentEquationElement();
    }

    private createEventHandlers() {
        this.events.on('enemyHitPlayer', () => {
            this.player.takeDamage(1);
        });

        this.events.on('playerKilledEnemy', (data: { score: number }) => {
            this.player.addScore(data.score);
            this.deleteCurrentEquationElement();
        });

        this.events.on('playerHitEnemy', (enemy: Enemy) => {
            enemy.attemptKill(this.currentEquationElement);
        });

        this.events.on('playerReload', () => {
            this.updateCurrentEquationElement();
        });
    }

    private deleteCurrentEquationElement() {
        for (const element of this.invisibleEquationElements) {
            if (element === this.currentEquationElement) {
                this.invisibleEquationElements.splice(
                    this.invisibleEquationElements.indexOf(element),
                    1
                );
                break;
            }
        }
    }

    private displayCurrentEquationElement() {
        this.currentEquationElementDisplay = this.add.text(500, 500, '', {
            fontSize: '20px',
            backgroundColor: '#cccccccc',
            padding: {
                x: 10,
                y: 5,
            },
            stroke: '#000000',
            strokeThickness: 4,
        });

        this.updateEquationElementDisplay();
    }

    private updateEquationElementDisplay() {
        this.currentEquationElementDisplay.setText(
            '' + this.currentEquationElement
        );
    }

    private updateCurrentEquationElement() {
        this.currentEquationElement =
            this.invisibleEquationElements[
                (Math.random() * this.invisibleEquationElements.length) | 0
            ];

        if (!this.currentEquationElement) {
            return;
        }

        this.updateEquationElementDisplay();
    }

    private executeSpawn(forceSpawn = false) {
        const shouldSpawn = Math.floor(Math.random() * 100) === 0;

        if (forceSpawn || shouldSpawn) {
            const enemyEquation = new Equation(2);
            this.invisibleEquationElements.push(
                enemyEquation.getInvisibleElement()
            );

            if (!this.currentEquationElement) {
                this.updateCurrentEquationElement();
            }

            const newEnemy = new Enemy({
                scene: this,
                equation: enemyEquation,
                path: this.PATH_NODES,
            });

            this.enemies.push(newEnemy);
        }
    }
}
