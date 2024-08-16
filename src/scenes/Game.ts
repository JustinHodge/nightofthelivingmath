import { Scene } from 'phaser';
import { Enemy } from '../Class/Enemy';
import { Player } from '../Class/Player';
import { Equation } from '../Class/Equation';
import { Hud } from '../Class/Hud';
import {
    BACKGROUND_KEY,
    BASE_ENEMY_DAMAGE,
    ENEMY_HIT_PLAYER_EVENT_KEY,
    GAME_CURSOR,
    GAME_MIDDLE_X,
    GAME_MIDDLE_Y,
    GAME_OVER_SCENE_KEY,
    GAME_SCENE_KEY,
    MAP_NODES_KEY,
    MILLIS_IN_SECOND,
    PLAYER_BOMB_EVENT_KEY,
    PLAYER_HEAL_EVENT_KEY,
    PLAYER_HIT_ENEMY_EVENT_KEY,
    PLAYER_KILLED_ENEMY_EVENT_KEY,
    PLAYER_PICKED_UP_DROP_EVENT_KEY,
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
    private difficulty: TDifficulty;
    private lastSpawnTime: number;
    private hud: Hud;
    private currentScore = 0;
    private targetEnemy: Enemy;

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

        this.startCountdown();
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
            this.registry.set('finalScore', this.currentScore);
            this.scene.stop(GAME_SCENE_KEY);
            this.scene.start(GAME_OVER_SCENE_KEY);
        }
    }

    private startCountdown() {
        const gameStartingText = this.add.text(
            GAME_MIDDLE_X,
            GAME_MIDDLE_Y,
            '',
            {
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            }
        );

        gameStartingText.setOrigin(0.5, 0.5);

        this.player.setActive(false);
        this.player.setVisible(false);

        const countdownSeconds = 3;
        for (let i = 0; i <= countdownSeconds; i++) {
            if (i >= countdownSeconds) {
                this.time.addEvent({
                    delay: i * MILLIS_IN_SECOND,
                    callback: () => {
                        gameStartingText.destroy();
                        this.player.setActive(true);
                        this.player.setVisible(true);
                    },
                });

                break;
            }

            this.time.addEvent({
                delay: i * MILLIS_IN_SECOND,
                callback: () => {
                    gameStartingText.setText(
                        `GET READY... ${countdownSeconds - i}`
                    );
                },
            });
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
        this.events.on(ENEMY_HIT_PLAYER_EVENT_KEY, () => {
            this.player.takeDamage(BASE_ENEMY_DAMAGE);
        });

        this.events.on(
            PLAYER_KILLED_ENEMY_EVENT_KEY,
            ({ score, killPosition }: IPlayerKilledEventData) => {
                this.addScore(score);
                const drop = new Drop(this, killPosition).generateRandom();
                if (drop) {
                    this.add.existing(drop);
                }

                this.updateTargetEnemy();
            }
        );

        this.events.on(PLAYER_HIT_ENEMY_EVENT_KEY, (enemy: Enemy) => {
            this.player.animateHit();
            const wasSuccess = enemy.attemptKill(this.targetEnemy);
            if (!wasSuccess) {
                this.player.takeDamage(
                    this.registry.get(REGISTRY_DIFFICULTY_KEY).difficultyNumber
                );
            }
        });

        this.events.on(PLAYER_RELOAD_EVENT_KEY, () => {
            this.updateTargetEnemy();
        });

        this.events.on(
            PLAYER_PICKED_UP_DROP_EVENT_KEY,
            ({ drop }: { drop: string }) => {
                this.hud.setCurrentItem(drop);
            }
        );

        this.events.on(PLAYER_HEAL_EVENT_KEY, () => {
            this.player.heal(4);
            this.hud.setCurrentItem(null);
        });

        this.events.on(PLAYER_BOMB_EVENT_KEY, () => {
            for (const enemy of this.enemies) {
                enemy.attemptKill(enemy);
            }
            this.hud.setCurrentItem(null);
        });
    }

    private updateTargetEnemy() {
        this.targetEnemy =
            this.enemies[Math.floor(Math.random() * this.enemies.length)];

        this.hud.setLoadedEquationElement(this.targetEnemy.getPlayerTarget());
    }

    private handleSpawns(forceSpawn = false) {
        const shouldSpawn = this.shouldSpawn(forceSpawn);

        if (forceSpawn || shouldSpawn) {
            const enemyEquation = new Equation(this.difficulty);

            if (!this.targetEnemy) {
                this.targetEnemy =
                    this.enemies[
                        Math.floor(Math.random() * this.enemies.length)
                    ];
            }

            const newEnemy = new Enemy({
                scene: this,
                equation: enemyEquation,
                path: this.PATH_NODES,
            });

            this.enemies.push(newEnemy);
            this.lastSpawnTime = this.time.now;
            if (this.enemies.length <= 1) {
                this.updateTargetEnemy();
            }
        }
    }

    private shouldSpawn(forceSpawn = false) {
        const totalGameTime = this.time.now - this.time.startTime;
        const secondsSinceStart = totalGameTime / MILLIS_IN_SECOND;

        const elapsedMillis = this.time.now - this.lastSpawnTime;
        const secondsSinceLastSpawn = elapsedMillis / MILLIS_IN_SECOND;
        const difficultyModifier = 2 / this.difficulty.difficultyNumber;
        const maxTimeSinceLastSpawn = Math.max(
            3 * difficultyModifier - secondsSinceStart / 20,
            1
        );

        const isNoCurrentEnemies = this.enemies.length < 1;
        const spawnTimerElapsed = secondsSinceLastSpawn > maxTimeSinceLastSpawn;

        if (forceSpawn || isNoCurrentEnemies || spawnTimerElapsed) {
            return true;
        }
    }
}
