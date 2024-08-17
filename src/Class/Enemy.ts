import {
    ATLAS_KEY,
    ENEMY_DATA,
    REGISTRY_DIFFICULTY_KEY,
    ENEMY_HIT_PLAYER_EVENT_KEY,
    PLAYER_KILLED_ENEMY_EVENT_KEY,
    ENEMY_SPEECH_BUBBLE_TEXT_STYLE,
    ANIMATION_COMPLETED_EVENT_KEY,
    ENEMY_DEATH_ANIMATION_KEY,
    ENEMY_WALK_UP_ANIMATION_KEY,
    ENEMY_WALK_DOWN_ANIMATION_KEY,
    ENEMY_WALK_LEFT_ANIMATION_KEY,
    ENEMY_WALK_RIGHT_ANIMATION_KEY,
    ENEMY_FACING_DIRECTIONS,
    ENEMY_TYPES,
    RIGHT_FACING_ANGLES,
    DOWN_FACING_ANGLES,
    LEFT_FACING_ANGLES,
    UP_FACING_ANGLES,
    ENEMY_ANIMATION_FRAME_RATE,
    ANIMATION_INFINITE_REPEAT,
    POINTER_DOWN_EVENT_KEY,
    PLAYER_HIT_ENEMY_EVENT_KEY,
} from '../constants';

import {
    generateFrameKeys,
    generateFrameObjects,
} from '../utils/frameGenerators';
import { IPathNode, IPlayerKilledEventData } from '../vite-env';

import { Equation } from './Equation';

interface IConfig {
    scene: Phaser.Scene;
    path: IPathNode[];
    equation: Equation;
}

interface ICoordinate {
    x: number;
    y: number;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private path: ICoordinate[] = [];
    private speechBubble: Phaser.GameObjects.Text;
    private facingDirection: ENEMY_FACING_DIRECTIONS =
        ENEMY_FACING_DIRECTIONS.down;
    private equation: Equation | undefined;
    private isDead = false;
    private enemyType: ENEMY_TYPES = ENEMY_TYPES.bigZombie;
    private movementSpeed: number;

    constructor({ scene, path, equation }: IConfig) {
        if (path.length < 1) {
            throw new Error('Path must have at least one node');
        }

        const enemyType = ENEMY_TYPES.bigZombie;

        super(
            scene,
            path[0].x,
            path[0].y,
            ATLAS_KEY,
            generateFrameKeys(
                ENEMY_DATA[enemyType].animationFrameData[
                    ENEMY_FACING_DIRECTIONS.down
                ]
            )[0]
        );

        this.facingDirection = ENEMY_FACING_DIRECTIONS.down;

        scene.physics.world.enableBody(this, 0);

        this.createAnims();

        this.movementSpeed = Math.floor(Math.random() * 25) + 50;

        this.equation = equation;
        this.buildSpeechBubble();

        this.setScale(3);
        this.setPath(path);

        this.setAnimation(this.facingDirection);
        this.setInteractive();

        this.on(POINTER_DOWN_EVENT_KEY, () => {
            this.scene.events.emit(PLAYER_HIT_ENEMY_EVENT_KEY, this);
        });

        scene.add.existing(this);
    }

    public getScoreValue() {
        return (
            ENEMY_DATA[this.enemyType].getScoreMultiplier() *
            this.scene.registry.get(REGISTRY_DIFFICULTY_KEY).difficultyNumber
        );
    }

    public getNextPathNode() {
        return this.path[0];
    }

    public updateNextPathNode() {
        const deltaX = Math.abs(this.path[0].x - this.x);
        const deltaY = Math.abs(this.path[0].y - this.y);

        if (deltaX <= 1 && deltaY <= 1) {
            this.path.shift();
            if (this.path.length > 0) {
                const currentPoint = { x: this.x, y: this.y };
                const FuturePoint = { x: this.path[0].x, y: this.path[0].y };

                this.setFacingDirection(currentPoint, FuturePoint);
            }
        }
    }

    public update() {
        this.move();
        this.speechBubble.x =
            this.x + this.width / 2 - this.speechBubble.width / 2;
        this.speechBubble.y =
            this.y + this.height / 2 + this.speechBubble.height / 2;

        if (this.path.length <= 0 && !this.isDead) {
            this.kill();
            this.scene.events.emit(ENEMY_HIT_PLAYER_EVENT_KEY);
        }
    }

    public getPlayerTarget() {
        return this.equation?.getPlayerString() || null;
    }

    public attemptKill(targetEnemy: Enemy) {
        const killIsSuccessful = this === targetEnemy;

        if (killIsSuccessful) {
            this.kill();
            const eventData: IPlayerKilledEventData = {
                score: this.getScoreValue(),
                killPosition: { x: this.x, y: this.y },
            };

            this.scene.events.emit(PLAYER_KILLED_ENEMY_EVENT_KEY, eventData);
        }

        return killIsSuccessful;
    }

    private buildSpeechBubble() {
        const bubbleX = this.x - this.width / 2;
        const bubbleY = this.y - this.height / 2;

        const enemySpeechBubbleText = this.equation?.getEnemyString() ?? '';

        this.speechBubble = this.scene.add.text(
            bubbleX,
            bubbleY,
            enemySpeechBubbleText ?? 'FREEBIE',
            ENEMY_SPEECH_BUBBLE_TEXT_STYLE
        );
    }

    private setPath(pathNodes: IPathNode[]) {
        this.path = [];

        for (const pathNode of pathNodes) {
            const nextCoord: ICoordinate = {
                x: pathNode.x + Math.floor(Math.random() * pathNode.width),
                y: pathNode.y + Math.floor(Math.random() * pathNode.height),
            };

            this.path.push(nextCoord);
        }
    }

    private move() {
        if (this.isDead) {
            this.setVelocity(0);
            return;
        }

        const { x: targetX, y: targetY } = this.getNextPathNode();
        this.scene.physics.moveTo(this, targetX, targetY, this.movementSpeed);
        this.updateNextPathNode();
    }

    private kill() {
        this.isDead = true;
        this.play(ENEMY_DEATH_ANIMATION_KEY);

        this.on(
            ANIMATION_COMPLETED_EVENT_KEY,
            () => {
                this.speechBubble.destroy();
                this.destroy();
            },
            ENEMY_DEATH_ANIMATION_KEY
        );
    }

    private setFacingDirection(
        currentPoint: { x: number; y: number },
        futurePoint: { x: number; y: number }
    ) {
        const deltaAngle = Phaser.Math.Angle.Normalize(
            Phaser.Math.Angle.BetweenPoints(currentPoint, futurePoint)
        );

        if (
            deltaAngle >= RIGHT_FACING_ANGLES.min ||
            deltaAngle < RIGHT_FACING_ANGLES.max
        ) {
            this.facingDirection = ENEMY_FACING_DIRECTIONS.right;
        }

        if (
            deltaAngle >= DOWN_FACING_ANGLES.min &&
            deltaAngle < DOWN_FACING_ANGLES.max
        ) {
            this.facingDirection = ENEMY_FACING_DIRECTIONS.down;
        }

        if (
            deltaAngle >= LEFT_FACING_ANGLES.min &&
            deltaAngle < LEFT_FACING_ANGLES.max
        ) {
            this.facingDirection = ENEMY_FACING_DIRECTIONS.left;
        }

        if (
            deltaAngle >= UP_FACING_ANGLES.min &&
            deltaAngle < UP_FACING_ANGLES.max
        ) {
            this.facingDirection = ENEMY_FACING_DIRECTIONS.up;
        }

        this.setAnimation(this.facingDirection);
    }

    private setAnimation(direction: ENEMY_FACING_DIRECTIONS) {
        switch (direction) {
            case ENEMY_FACING_DIRECTIONS.up:
                this.play(ENEMY_WALK_UP_ANIMATION_KEY);
                break;
            case ENEMY_FACING_DIRECTIONS.down:
                this.play(ENEMY_WALK_DOWN_ANIMATION_KEY);
                break;
            case ENEMY_FACING_DIRECTIONS.left:
                this.play(ENEMY_WALK_LEFT_ANIMATION_KEY);
                this.flipX = false;
                break;
            case ENEMY_FACING_DIRECTIONS.right:
                this.play(ENEMY_WALK_RIGHT_ANIMATION_KEY);
                this.flipX = true;
                break;
            case ENEMY_FACING_DIRECTIONS.idle:
                this.stop();
                break;
            default:
                this.stop();
        }
    }

    private createAnims() {
        this.anims.create({
            key: ENEMY_WALK_DOWN_ANIMATION_KEY,
            frames: generateFrameObjects(
                ENEMY_DATA[ENEMY_TYPES.bigZombie].animationFrameData[
                    ENEMY_FACING_DIRECTIONS.down
                ]
            ),
            frameRate: ENEMY_ANIMATION_FRAME_RATE,
            repeat: ANIMATION_INFINITE_REPEAT,
        });

        this.anims.create({
            key: ENEMY_WALK_UP_ANIMATION_KEY,
            frames: generateFrameObjects(
                ENEMY_DATA[ENEMY_TYPES.bigZombie].animationFrameData[
                    ENEMY_FACING_DIRECTIONS.up
                ]
            ),
            frameRate: ENEMY_ANIMATION_FRAME_RATE,
            repeat: ANIMATION_INFINITE_REPEAT,
        });

        this.anims.create({
            key: ENEMY_WALK_LEFT_ANIMATION_KEY,
            frames: generateFrameObjects(
                ENEMY_DATA[ENEMY_TYPES.bigZombie].animationFrameData[
                    ENEMY_FACING_DIRECTIONS.left
                ]
            ),
            frameRate: ENEMY_ANIMATION_FRAME_RATE,
            repeat: ANIMATION_INFINITE_REPEAT,
        });

        this.anims.create({
            key: ENEMY_WALK_RIGHT_ANIMATION_KEY,
            frames: generateFrameObjects(
                ENEMY_DATA[ENEMY_TYPES.bigZombie].animationFrameData[
                    ENEMY_FACING_DIRECTIONS.right
                ]
            ),
            frameRate: ENEMY_ANIMATION_FRAME_RATE,
            repeat: ANIMATION_INFINITE_REPEAT,
        });

        this.anims.create({
            key: ENEMY_DEATH_ANIMATION_KEY,
            frames: generateFrameObjects(
                ENEMY_DATA[ENEMY_TYPES.bigZombie].animationFrameData[
                    ENEMY_FACING_DIRECTIONS.death
                ]
            ),
            frameRate: ENEMY_ANIMATION_FRAME_RATE,
            repeat: 0,
        });
    }
}
