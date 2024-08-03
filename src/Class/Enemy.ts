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
    private currentLocation: ICoordinate;
    private readonly MOVE_SPEED = 5;
    private facingDirection: 'up' | 'down' | 'left' | 'right' = 'down';

    constructor({
        scene,
        x,
        y,
        key = 'atlas',
        frame = 'Big Zombie Walking Animation Frames/Zombie-Tileset---_0412',
    }: IConfig) {
        super(scene, x, y, key, frame);

        scene.physics.world.enableBody(this, 0);

        this.currentLocation = { x, y };

        this.createAnims();

        scene.add.existing(this);

        this.speechBubble = scene.add.rectangle(
            x + 30,
            y - 25,
            50,
            30,
            0xffffff,
            0.5
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
        console.log(this.x, this.y);
        const deltaX = Math.abs(this.path[0].x - this.x);
        const deltaY = Math.abs(this.path[0].y - this.y);

        if (deltaX <= 1 && deltaY <= 1) {
            this.path.shift();
        }
    }

    private setFacingDirection({
        deltaX,
        deltaY,
    }: {
        deltaX: number;
        deltaY: number;
    }) {
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY > 0) {
                this.facingDirection = 'down';
            } else {
                this.facingDirection = 'up';
            }
        } else {
            if (deltaX > 0) {
                this.facingDirection = 'right';
            } else {
                this.facingDirection = 'left';
            }
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
    }
}
