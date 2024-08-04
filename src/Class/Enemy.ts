import { IPathNode } from '../scenes/Game';
import { Equation } from './Equation';

interface IOptions extends Phaser.Types.Physics.Matter.MatterBodyConfig {
    equation: Equation;
}

interface IConfig {
    scene: Phaser.Scene;
    x: number;
    y: number;
    key?: string;
    frame?: string | number;
    options?: IOptions;
}

interface ICoordinate {
    x: number;
    y: number;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private path: ICoordinate[] = [];
    private speechBubble;
    private facingDirection: 'up' | 'down' | 'left' | 'right' = 'down';
    private isDead = false;

    constructor({
        scene,
        x,
        y,
        key = 'atlas',
        frame = 'Big Zombie Walking Animation Frames/Zombie-Tileset---_0412',
        options,
    }: IConfig) {
        super(scene, x, y, key, frame);

        scene.physics.world.enableBody(this, 0);

        this.createAnims();

        scene.add.existing(this);

        const bubbleXPadding = 1;
        const bubbleYPadding = 1;
        const bubbleX = x - this.width / 2;
        const bubbleY = y - this.height / 2;
        const bubbleColor = '#ffffff';
        const bubbleAlpha = '99';

        const enemySpeechBubbleText = options?.equation.getVisibleEquation();
        this.speechBubble = scene.add.text(
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

        this.setScale(3);

        this.setAnimation(this.facingDirection);
        this.setInteractive();
    }

    public setPath(pathNodes: IPathNode[]) {
        this.path = [];

        for (const pathNode of pathNodes) {
            const nextCoord: ICoordinate = {
                x: pathNode.x + Math.floor(Math.random() * pathNode.width),
                y: pathNode.y + Math.floor(Math.random() * pathNode.height),
            };

            this.path.push(nextCoord);
        }
    }

    public markAsDead() {
        this.isDead = true;
    }

    public isAlive() {
        if (this.isDead) {
            this.speechBubble.destroy();
            this.play('death');
            this.on(
                'animationcomplete',
                () => {
                    this.destroy();
                },
                'death'
            );
        }

        return !this.isDead;
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
        this.speechBubble.x =
            this.x + this.width / 2 - this.speechBubble.width / 2;
        this.speechBubble.y =
            this.y + this.height / 2 + this.speechBubble.height / 2;

        if (this.path.length <= 0) {
            this.markAsDead();
            this.scene.events.emit('enemyHitPlayer');
        }
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
