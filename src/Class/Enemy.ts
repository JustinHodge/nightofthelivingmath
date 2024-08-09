import { IPathNode } from '../scenes/Game';
import { TOperator } from '../scenes/MainMenu';
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
    private facingDirection: 'up' | 'down' | 'left' | 'right' = 'down';
    private equation: Equation | undefined;
    private isDead = false;

    constructor({ scene, path, equation }: IConfig) {
        if (path.length < 1) {
            throw new Error('Path must have at least one node');
        }

        const key = 'atlas';
        const framePrefix =
            'Big Zombie Walking Animation Frames/Zombie-Tileset---_';
        const frame = framePrefix + '0412';

        super(scene, path[0].x, path[0].y, key, frame);

        scene.physics.world.enableBody(this, 0);

        this.createAnims();

        this.equation = equation;
        this.buildSpeechBubble();

        this.setScale(3);
        this.setPath(path);

        this.setAnimation(this.facingDirection);
        this.setInteractive();

        scene.add.existing(this);
    }

    public getScoreValue() {
        return 100;
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
                const deltaAngle = Phaser.Math.Angle.BetweenPoints(
                    { x: this.x, y: this.y },
                    { x: this.path[0].x, y: this.path[0].y }
                );

                this.setFacingDirection(
                    Phaser.Math.RadToDeg(
                        Phaser.Math.Angle.Normalize(deltaAngle)
                    )
                );
            }
        }
    }

    public update() {
        this.move();
        this.speechBubble.x =
            this.x + this.width / 2 - this.speechBubble.width / 2;
        this.speechBubble.y =
            this.y + this.height / 2 + this.speechBubble.height / 2;

        if (this.path.length <= 0) {
            this.kill();
            this.scene.events.emit('enemyHitPlayer');
        }
    }

    public attemptKill(equationComponent: number | TOperator | undefined) {
        if (
            !this.equation ||
            this.equation?.getInvisibleElement() === equationComponent
        ) {
            this.kill();
            this.scene.events.emit('playerKilledEnemy', {
                score: this.getScoreValue(),
            });
        }

        return false;
    }

    private buildSpeechBubble() {
        const bubbleXPadding = 1;
        const bubbleYPadding = 1;
        const bubbleX = this.x - this.width / 2;
        const bubbleY = this.y - this.height / 2;
        const bubbleColor = '#ffffff';
        const bubbleAlpha = '99';

        const enemySpeechBubbleText = this.equation?.getVisibleEquation() ?? '';

        this.speechBubble = this.scene.add.text(
            bubbleX,
            bubbleY,
            enemySpeechBubbleText ?? 'FREEBIE',
            {
                padding: {
                    x: bubbleXPadding,
                    y: bubbleYPadding,
                },
                backgroundColor: bubbleColor + bubbleAlpha,
                color: '#000000',
                fontSize: '1.5rem',
                align: 'center',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    blur: 2,
                    color: '#000000',
                    fill: true,
                    stroke: true,
                },
            }
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
            this.setVelocity(0, 0);
            return;
        }

        const { x: targetX, y: targetY } = this.getNextPathNode() ?? {
            x: 10,
            y: 10,
        };
        this.scene.physics.moveTo(this, targetX, targetY);
        this.updateNextPathNode();
    }

    private kill() {
        this.isDead = true;
        this.play('death');
        this.on(
            'animationcomplete',
            () => {
                this.speechBubble.destroy();
                this.destroy();
            },
            'death'
        );
    }

    private setFacingDirection(deltaAngle: number) {
        if (deltaAngle > 315 || deltaAngle < 45) {
            this.facingDirection = 'right';
        }

        if (deltaAngle > 45 && deltaAngle < 135) {
            this.facingDirection = 'down';
        }

        if (deltaAngle > 135 && deltaAngle < 225) {
            this.facingDirection = 'left';
        }

        if (deltaAngle > 225 && deltaAngle < 315) {
            this.facingDirection = 'up';
        }

        this.setAnimation(this.facingDirection);
    }

    private setAnimation(direction: 'up' | 'down' | 'left' | 'right' | 'idle') {
        switch (direction) {
            case 'up':
                this.play('walkup');
                break;
            case 'down':
                this.play('walkdown');
                break;
            case 'left':
                this.play('walkleft');
                this.flipX = false;
                break;
            case 'right':
                this.play('walkleft');
                this.flipX = true;
                break;
            case 'idle':
                this.stop();
                break;
            default:
                this.stop();
        }
    }

    private createAnims() {
        const PREFIX = 'Big Zombie Walking Animation Frames/Zombie-Tileset---_';
        this.anims.create({
            key: 'walkdown',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: PREFIX,
                start: 412,
                end: 414,
                zeroPad: 4,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'walkup',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: PREFIX,
                zeroPad: 4,
                frames: [418, 419, 420],
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'walkleft',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: PREFIX,
                zeroPad: 4,
                frames: [415, 416, 417],
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNames('atlas', {
                prefix: 'Damaged Big Zombie Animation Frames/Zombie-Tileset---_',
                zeroPad: 4,
                frames: [421, 422, 421, 422, 421, 422, 423],
            }),
            frameRate: 5,
            repeat: 0,
        });
    }
}
