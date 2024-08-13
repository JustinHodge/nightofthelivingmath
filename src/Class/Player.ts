import {
    PLAYER_IDLE_ANIMATION_KEY,
    GAME_OBJECT_DOWN_EVENT_KEY,
    GAME_WIDTH,
    PLAYER_HIT_ENEMY_EVENT_KEY,
    PLAYER_START_X,
    PLAYER_START_Y,
    POINTER_MOVE_EVENT_KEY,
    PLAYER_HIT_ANIMATION_KEY,
    PLAYER_MISS_ANIMATION_KEY,
    PLAYER_MAX_HEALTH,
    PLAYER_SPRITE_DEPTH,
    PLAYER_SPRITE_SCALE,
    PLAYER_HEALTH_ORB_SPRITE_FRAMES,
    PLAYER_HEALTH_ORB_IMAGE_SIZE,
    PLAYER_HEALTH_ORB_DEPTH,
    PLAYER_SPRITE_MISS_FRAME,
    PLAYER_SPRITE_HIT_FRAME,
    PLAYER_SPRITE_FRAME_3,
    PLAYER_SPRITE_FRAME_4,
    PLAYER_SPRITE_FRAME_5,
    PLAYER_SPRITE_ATLAS_KEY,
} from '../constants';
import { Enemy } from './Enemy';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private health = PLAYER_MAX_HEALTH;
    private healthOrbs: Phaser.GameObjects.Image[] = [];

    constructor(scene: Phaser.Scene) {
        super(
            scene,
            PLAYER_START_X,
            PLAYER_START_Y,
            PLAYER_SPRITE_ATLAS_KEY,
            PLAYER_SPRITE_FRAME_3
        );
        scene.physics.world.enableBody(this, 0);
        scene.add.existing(this);
        scene.input.on(
            POINTER_MOVE_EVENT_KEY,
            (pointer: { x: number | undefined; y: number | undefined }) => {
                this.setPosition(pointer.x, pointer.y);
                this.setDepth(PLAYER_SPRITE_DEPTH);
                this.setScale(PLAYER_SPRITE_SCALE);
            }
        );

        this.setHealthOrbs();

        scene.input.on(
            GAME_OBJECT_DOWN_EVENT_KEY,
            (pointer: Phaser.Input.Pointer, gameObject: Enemy) => {
                this.play(PLAYER_HIT_ANIMATION_KEY).chain(
                    PLAYER_IDLE_ANIMATION_KEY
                );
                this.scene.events.emit(PLAYER_HIT_ENEMY_EVENT_KEY, gameObject);
            }
        );

        this.createAnims();
        this.play(PLAYER_IDLE_ANIMATION_KEY);
    }

    public isDead() {
        return this.health <= 0;
    }

    public takeDamage(damage: number) {
        this.health = Math.max(this.health - damage, 0);
        this.setHealthOrbs();
    }

    private setHealthOrbs() {
        for (const healthOrb of this.healthOrbs) {
            healthOrb.destroy();
        }

        this.healthOrbs = [];

        for (let i = 0; i < Math.ceil(PLAYER_MAX_HEALTH / 4); i++) {
            // TODO: This can likely be done smarter
            const healthInThisOrb = this.health - i * 4;
            const imageNumber =
                healthInThisOrb >= 0
                    ? Math.min(
                          healthInThisOrb,
                          Object.keys(PLAYER_HEALTH_ORB_SPRITE_FRAMES).length -
                              1
                      )
                    : 0;
            const healthImage = PLAYER_HEALTH_ORB_SPRITE_FRAMES[imageNumber];
            const healthImageSize = PLAYER_HEALTH_ORB_IMAGE_SIZE;

            const newOrb = this.scene.add
                .sprite(
                    GAME_WIDTH - 75,
                    i * healthImageSize,
                    PLAYER_SPRITE_ATLAS_KEY,
                    healthImage
                )
                .setOrigin(0, 0)
                .setDepth(PLAYER_HEALTH_ORB_DEPTH);

            this.healthOrbs.push(newOrb);
        }
    }

    private createAnims() {
        this.anims.create({
            key: PLAYER_MISS_ANIMATION_KEY,
            frames: [
                {
                    key: PLAYER_SPRITE_ATLAS_KEY,
                    frame: PLAYER_SPRITE_MISS_FRAME,
                },
            ],
            frameRate: 3,
            repeat: 0,
        });

        this.anims.create({
            key: PLAYER_HIT_ANIMATION_KEY,
            frames: [
                {
                    key: PLAYER_SPRITE_ATLAS_KEY,
                    frame: PLAYER_SPRITE_HIT_FRAME,
                },
            ],
            frameRate: 3,
            repeat: 0,
        });

        this.anims.create({
            key: PLAYER_IDLE_ANIMATION_KEY,
            frames: [
                {
                    key: PLAYER_SPRITE_ATLAS_KEY,
                    frame: PLAYER_SPRITE_FRAME_3,
                },
                {
                    key: PLAYER_SPRITE_ATLAS_KEY,
                    frame: PLAYER_SPRITE_FRAME_4,
                },
                {
                    key: PLAYER_SPRITE_ATLAS_KEY,
                    frame: PLAYER_SPRITE_FRAME_5,
                },
            ],
            frameRate: 1,
            repeat: -1,
        });
    }
}
