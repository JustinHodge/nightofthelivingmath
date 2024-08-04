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

    private readonly ZOMBIE_SPAWN_BOX: IPathNode = {
        x: 515,
        y: 0,
        width: 42,
        height: 42,
    };

    private readonly ZOMBIE_TARGET_BOX: IPathNode = {
        x: 515,
        y: gameSize.height - 42,
        width: 42,
        height: 42,
    };

    PATH_NODES: IPathNode[] = [
        {
            x: 515,
            y: 115,
            width: 42,
            height: 42,
        },
        {
            x: 82,
            y: 115,
            width: 42,
            height: 42,
        },
        {
            x: 82,
            y: 212,
            width: 42,
            height: 42,
        },
        {
            x: 898,
            y: 212,
            width: 42,
            height: 42,
        },
        {
            x: 898,
            y: 307,
            width: 42,
            height: 42,
        },
        {
            x: 82,
            y: 307,
            width: 42,
            height: 42,
        },
        {
            x: 82,
            y: 403,
            width: 42,
            height: 42,
        },
        {
            x: 898,
            y: 403,
            width: 42,
            height: 42,
        },
        {
            x: 898,
            y: 500,
            width: 42,
            height: 42,
        },
        {
            x: 82,
            y: 500,
            width: 42,
            height: 42,
        },
        {
            x: 82,
            y: 596,
            width: 42,
            height: 42,
        },
        {
            x: 515,
            y: 596,
            width: 42,
            height: 42,
        },
        this.ZOMBIE_TARGET_BOX,
    ];

    DEBUG_MODE = false;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;

        this.background = this.add.image(
            gameSize.middleX,
            gameSize.middleY,
            'background'
        );

        this.events.on('playerHitEnemy', (enemy: Enemy) => {
            enemy.markAsDead();
            this.player.addScore(enemy.getScoreValue());
        });

        this.events.on('enemyHitPlayer', () => {
            this.player.takeDamage(1);
        });

        this.input.setDefaultCursor('none');

        this.createPlayer();

        this.DEBUG_MODE && this.debugSetup();
    }

    update() {
        this.checkGameOver();

        this.destroyEnemies();

        this.enemies.forEach((enemy) => {
            enemy.update();
        });

        this.moveEnemies();

        this.executeSpawn();
    }

    private checkGameOver() {
        if (this.player.isDead()) {
            this.scene.stop();
            this.scene.start('GameOver');
        }
    }

    private createPlayer() {
        this.player = new Player(this, 300, 300);
    }

    private moveEnemies() {
        for (const enemy of this.enemies) {
            if (!enemy.isAlive()) {
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
        this.enemies = this.enemies.filter((enemy) => enemy.isAlive());
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

            const newEnemy = new Enemy({
                scene: this,
                x: enemySpawnCoords.x,
                y: enemySpawnCoords.y,
                key: 'atlas',
                frame: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_0412',
                options: {
                    equation: enemyEquation,
                },
            });

            newEnemy.setPath(this.PATH_NODES);

            this.enemies.push(newEnemy);
        }
    }

    private debugSetup() {
        if (!this.DEBUG_MODE) {
            return;
        }

        let i = 0;
        for (const node of this.PATH_NODES) {
            this.add
                .rectangle(node.x, node.y, node.width, node.height, 0x00ff00)
                .setOrigin(0, 0);
            this.add.text(node.x, node.y, `${i}: (${node.x}, ${node.y})`, {
                color: 'black',
            });
            i++;
        }
    }
}
