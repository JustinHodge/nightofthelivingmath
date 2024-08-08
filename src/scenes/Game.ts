import { Scene } from 'phaser';
import { gameSize } from '../main';
import { Enemy } from '../Class/Enemy';
import { Player } from '../Class/Player';
import { Equation, TOperator } from '../Class/Equation';
import { TDifficulty } from './MainMenu';

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
    // private readonly PATH_NODES: IPathNode[] = [];
    private ZOMBIE_SPAWN_BOX: IPathNode;
    private DIFFICULTY: TDifficulty;

    constructor() {
        super('Game');
    }

    create() {
        this.PATH_NODES = this.cache.json.get('mapNodes');
        this.ZOMBIE_SPAWN_BOX = this.PATH_NODES[0];
        this.DIFFICULTY = this.registry.get('difficulty');

        this.camera = this.cameras.main;

        this.background = this.add.image(
            gameSize.middleX,
            gameSize.middleY,
            'background'
        );

        this.createPlayer();
    }

    update() {
        this.checkGameOver();

        this.destroyEnemies();

        this.enemies.forEach((enemy) => {
            enemy.update();
        });

        this.player.update();

        this.moveEnemies();

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

        this.events.on('playerHitEnemy', (enemy: Enemy) => {
            enemy.attemptMarkAsDead(this.currentEquationElement);

            if (enemy.removeIfMarkedDead()) {
                this.player.addScore(enemy.getScoreValue());
                this.deleteCurrentEquationElement();
            }
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

    private moveEnemies() {
        for (const enemy of this.enemies) {
            if (!enemy.removeIfMarkedDead()) {
                continue;
            }

            const { x: targetX, y: targetY } = enemy.getNextPathNode() ?? {
                x: 10,
                y: 10,
            };

            this.physics.moveTo(enemy, targetX, targetY);
            enemy.updateNextPathNode();
        }
    }

    private destroyEnemies() {
        this.enemies = this.enemies.filter((enemy) =>
            enemy.removeIfMarkedDead()
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
            const enemySpawnCoords = {
                x:
                    this.ZOMBIE_SPAWN_BOX.x +
                    Math.floor(Math.random() * this.ZOMBIE_SPAWN_BOX.width),
                y:
                    this.ZOMBIE_SPAWN_BOX.y +
                    Math.floor(Math.random() * this.ZOMBIE_SPAWN_BOX.height),
            };

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

            // const newEnemy = new Enemy({
            //     scene: this,
            //     x: enemySpawnCoords.x,
            //     y: enemySpawnCoords.y,
            //     key: 'atlas',
            //     frame: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_0412',
            //     options: {
            //         equation: enemyEquation,
            //     },
            // });

            // newEnemy.setPath(this.PATH_NODES);

            this.enemies.push(newEnemy);
        }
    }
}
