import { IPathNode } from '../scenes/Game';

interface IOptions extends Phaser.Types.Physics.Matter.MatterBodyConfig {}
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
    private readonly SPEECH_BUBBLE_OFFSET = { x: 30, y: -25 };

    constructor({
        scene,
        x,
        y,
        key = 'atlas',
        frame = 'Big Zombie Walking Animation Frames/Zombie-Tileset---_0412',
    }: IConfig) {
        super(scene, x, y, key, frame);

        scene.physics.world.enableBody(this, 0);

        this.createAnims();

        scene.add.existing(this);

        const bubbleWidth = 50;
        const bubbleHeight = 30;
        const bubbleX = x + this.SPEECH_BUBBLE_OFFSET.x;
        const bubbleY = y + this.SPEECH_BUBBLE_OFFSET.y;
        const bubbleColor = 0xffffff;
        const bubbleAlpha = 0.5;

        this.speechBubble = scene.add.rectangle(
            bubbleX,
            bubbleY,
            bubbleWidth,
            bubbleHeight,
            bubbleColor,
            bubbleAlpha
        );
        this.speechBubble.isStroked = true;
        this.speechBubble.strokeColor = 0x000000;
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

    public getNextPathNode() {
        return this.path[0];
    }

    public updateNextPathNode() {
        const deltaX = Math.abs(this.path[0].x - this.x);
        const deltaY = Math.abs(this.path[0].y - this.y);

        if (deltaX <= 1 && deltaY <= 1) {
            this.path.shift();
        }

        if (this.path.length > 0) {
            const deltaAngle = Phaser.Math.Angle.BetweenPoints(
                { x: this.x, y: this.y },
                { x: this.path[0].x, y: this.path[0].y }
            );

            this.setFacingDirection(
                Phaser.Math.RadToDeg(Phaser.Math.Angle.Normalize(deltaAngle))
            );
        }
    }

    public update() {
        this.speechBubble.x = this.x + this.SPEECH_BUBBLE_OFFSET.x;
        this.speechBubble.y = this.y + this.SPEECH_BUBBLE_OFFSET.y;
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

        console.log(deltaAngle, ':', this.facingDirection);

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
    }
}
