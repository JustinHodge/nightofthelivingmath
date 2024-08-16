import { Tweens } from 'phaser';
import {
    ATLAS_KEY,
    DROP_BOMB_IMAGE,
    DROP_HEALTH_KIT_IMAGE,
    PLAYER_PICKED_UP_DROP_EVENT_KEY,
    POINTER_DOWN_EVENT_KEY,
} from '../../constants';
import { ICoordinate } from '../../vite-env';

export class Drop {
    private scene: Phaser.Scene;
    private position: ICoordinate;
    private POSSIBLE_DROPS: {
        [key: string]: { imageFile: string; weight: number };
    } = {
        HEALTH_KIT: {
            imageFile: DROP_HEALTH_KIT_IMAGE,
            weight: 2,
        },
        DROP_BOMB: {
            imageFile: DROP_BOMB_IMAGE,
            weight: 1,
        },
    };
    private dropKeyOptions: string[] = [];

    constructor(scene: Phaser.Scene, position: ICoordinate) {
        this.scene = scene;
        this.position = position;

        this.dropKeyOptions = Object.keys(this.POSSIBLE_DROPS).reduce(
            (acc, key) => {
                for (let i = 0; i < this.POSSIBLE_DROPS[key].weight; i++) {
                    acc.push(key);
                }
                return acc;
            },
            [] as string[]
        );
    }

    public generateRandom() {
        const shouldGenerate = Math.random() < 0.5;
        if (!shouldGenerate) {
            return;
        }

        const dropKey = Phaser.Utils.Array.GetRandom(this.dropKeyOptions);

        const drop = new Phaser.GameObjects.Sprite(
            this.scene,
            this.position.x,
            this.position.y,
            ATLAS_KEY,
            this.POSSIBLE_DROPS[dropKey].imageFile
        );

        drop.setScale(3);

        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                this.scene.add.tween({
                    targets: drop,
                    alpha: 0,
                    duration: 400,
                    repeat: 5,
                    onComplete: () => {
                        drop.destroy();
                    },
                });
            },
            loop: false,
        });

        drop.setInteractive();
        drop.addListener(POINTER_DOWN_EVENT_KEY, () => {
            this.scene.events.emit(PLAYER_PICKED_UP_DROP_EVENT_KEY, {
                drop: dropKey,
            });
            drop.destroy();
        });

        return drop;
    }
}
