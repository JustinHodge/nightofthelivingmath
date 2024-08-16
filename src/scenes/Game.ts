import { Scene } from 'phaser';
import { Enemy } from '../Class/Enemy';
import { Player } from '../Class/Player';
import { Equation } from '../Class/Equation';
import { Hud } from '../Class/Hud';
import {
    BACKGROUND_KEY,
    BASE_ENEMY_DAMAGE,
    ENEMY_HIT_PLAYER_EVENT_KEY,
    EQUATION_OPERATOR,
    GAME_CURSOR,
    GAME_MIDDLE_X,
    GAME_MIDDLE_Y,
    GAME_OVER_SCENE_KEY,
    GAME_SCENE_KEY,
    MAP_NODES_KEY,
    MILLIS_IN_SECOND,
    PLAYER_HIT_ENEMY_EVENT_KEY,
    PLAYER_KILLED_ENEMY_EVENT_KEY,
    PLAYER_RELOAD_EVENT_KEY,
    REGISTRY_DIFFICULTY_KEY,
} from '../constants';
import { TDifficulty, IPathNode, IPlayerKilledEventData } from '../vite-env';
import { Drop } from '../Class/EnemyDrops/Drop';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    private enemies: Enemy[] = [];
    private player: Player;
    private invisibleEquationElements: (number | EQUATION_OPERATOR)[] = [];
    private currentEquationElement: number | EQUATION_OPERATOR;
    private difficulty: TDifficulty;
    private lastSpawnTime: number;
    private hud: Hud;
    private currentScore = 0;

    private PATH_NODES: IPathNode[];

    constructor() {
        super(GAME_SCENE_KEY);
    }

    create() {
        this.difficulty = this.registry.get(REGISTRY_DIFFICULTY_KEY);
        this.PATH_NODES = this.cache.json.get(MAP_NODES_KEY);
        this.lastSpawnTime = this.time.now;

        this.camera = this.cameras.main;

        this.background = this.add.image(
            GAME_MIDDLE_X,
            GAME_MIDDLE_Y,
            BACKGROUND_KEY
        );

        this.hud = new Hud(this);

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

        this.handleSpawns();
    }

    private checkGameOver() {
        if (this.player.isDead()) {
            this.enemies = [];
            this.scene.stop(GAME_SCENE_KEY);
            this.scene.start(GAME_OVER_SCENE_KEY);
        }
    }

    private createPlayer() {
        this.player = new Player(this);

        this.input.setDefaultCursor(GAME_CURSOR);

        this.createEventHandlers();
    }

    private addScore(score: number) {
        this.currentScore += score;
        this.hud.setScore(this.currentScore);
    }

    private createEventHandlers() {
        this.events.on(
            ENEMY_HIT_PLAYER_EVENT_KEY,
            (enemyHiddenElement: number | EQUATION_OPERATOR) => {
                this.player.takeDamage(BASE_ENEMY_DAMAGE);
                this.deleteEquationElement(enemyHiddenElement);
            }
        );

        this.events.on(
            PLAYER_KILLED_ENEMY_EVENT_KEY,
            ({ score, killPosition }: IPlayerKilledEventData) => {
                this.addScore(score);
                const drop = new Drop(this, killPosition).generateRandom();
                if (drop) {
                    this.add.existing(drop);
                }
                this.deleteEquationElement(this.currentEquationElement);
            }
        );

        this.events.on(PLAYER_HIT_ENEMY_EVENT_KEY, (enemy: Enemy) => {
            this.player.animateHit();
            enemy.attemptKill(this.currentEquationElement);
        });

        this.events.on(PLAYER_RELOAD_EVENT_KEY, () => {
            this.updateCurrentEquationElement();
        });
    }

    private deleteEquationElement(elementToDelete: number | EQUATION_OPERATOR) {
        for (const element of this.invisibleEquationElements) {
            if (element === elementToDelete) {
                this.invisibleEquationElements.splice(
                    this.invisibleEquationElements.indexOf(element),
                    1
                );
                break;
            }
        }

        this.updateCurrentEquationElement();
    }

    private updateCurrentEquationElement() {
        this.currentEquationElement =
            this.invisibleEquationElements[
                (Math.random() * this.invisibleEquationElements.length) | 0
            ];

        this.hud.setLoadedEquationElement(this.currentEquationElement);
    }

    private handleSpawns(forceSpawn = false) {
        const shouldSpawn = this.shouldSpawn();

        if (forceSpawn || shouldSpawn) {
            const enemyEquation = new Equation(this.difficulty);
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
            this.lastSpawnTime = this.time.now;
        }
    }

    private shouldSpawn() {
        const elapsedMillis = this.time.now - this.lastSpawnTime;
        const secondsSinceLastSpawn = elapsedMillis / MILLIS_IN_SECOND;
        const difficultyModifier = 2 / this.difficulty.difficultyNumber;
        const maxTimeSinceLastSpawn = 3 * difficultyModifier;

        const isNoCurrentEnemies = this.enemies.length < 1;
        const spawnTimerElapsed = secondsSinceLastSpawn > maxTimeSinceLastSpawn;

        if (isNoCurrentEnemies || spawnTimerElapsed) {
            return true;
        }
    }
}
