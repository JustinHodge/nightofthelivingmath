import { Scene } from 'phaser';
import { gameSize } from '../main';
import { Enemy } from '../Class/Enemy';

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

    ZOMBIE_SPAWN_BOX: IPathNode = {
        x: 515,
        y: 0,
        width: 42,
        height: 42,
    };

    ZOMBIE_TARGET_BOX: IPathNode = {
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

        this.DEBUG_MODE && this.debugSetup();
    }

    update(time: number, delta: number) {
        for (const enemy of this.enemies) {
            const { x: targetX, y: targetY } = enemy.getNextPathNode() ?? {
                x: 10,
                y: 10,
            };

            this.physics.moveTo(enemy, targetX, targetY);
            enemy.updateNextPathNode();
        }
        const shouldSpawn = Math.floor(Math.random() * 100) === 0;
        if (shouldSpawn) {
            const enemySpawnCoords = {
                x:
                    this.ZOMBIE_SPAWN_BOX.x +
                    Math.floor(Math.random() * this.ZOMBIE_SPAWN_BOX.width),
                y:
                    this.ZOMBIE_SPAWN_BOX.y +
                    Math.floor(Math.random() * this.ZOMBIE_SPAWN_BOX.height),
            };
            const newEnemy = new Enemy({
                scene: this,
                x: enemySpawnCoords.x,
                y: enemySpawnCoords.y,
                key: 'atlas',
                frame: 'Big Zombie Walking Animation Frames/Zombie-Tileset---_0412',
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

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }
}
