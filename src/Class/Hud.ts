export class Hud extends Phaser.GameObjects.Image {
    private DIGITMAP: Record<string, string> = {
        '0': 'UI Elements/Zombie-Tileset---_0501',
        '1': 'UI Elements/Zombie-Tileset---_0502',
        '2': 'UI Elements/Zombie-Tileset---_0503',
        '3': 'UI Elements/Zombie-Tileset---_0504',
        '4': 'UI Elements/Zombie-Tileset---_0505',
        '5': 'UI Elements/Zombie-Tileset---_0506',
        '6': 'UI Elements/Zombie-Tileset---_0507',
        '7': 'UI Elements/Zombie-Tileset---_0508',
        '8': 'UI Elements/Zombie-Tileset---_0509',
        '9': 'UI Elements/Zombie-Tileset---_0510',
    };

    private score: number = 0;
    private currentItem = null;
    private scoreDisplay: Phaser.GameObjects.Image[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'hud');

        this.setScale(this.scene.sys.canvas.width / this.width);
        this.setY(this.scene.sys.canvas.height - this.height);
        this.setX(this.scene.sys.canvas.width / 2);
        this.setDepth(1500);

        this.initScoreDisplay();

        scene.add.existing(this);
    }

    public setScore(newScore: number) {
        this.score = newScore;
        this.updateScoreDisplay();
    }

    private updateScoreDisplay() {
        for (let i = 0; i < this.scoreDisplay.length; i++) {
            this.scoreDisplay[i].setTexture(
                'atlas',
                this.DIGITMAP[this.score.toString()[i] ?? '0']
            );
        }
    }

    private initScoreDisplay() {
        const baseLocation = 150;

        this.scoreDisplay = [];

        for (let i = 0; i < 6; i++) {
            const newDigit = new Phaser.GameObjects.Image(
                this.scene,
                0,
                0,
                'atlas',
                this.DIGITMAP[0]
            );

            newDigit.setScale(3);
            newDigit.setDepth(1600);
            const newX = baseLocation + i * (newDigit.displayWidth + 10);
            const newY = this.scene.sys.canvas.height - newDigit.displayHeight;

            newDigit.setX(newX);
            newDigit.setY(newY);

            this.scene.add.existing(newDigit);
            this.scoreDisplay.push(newDigit);
        }

        this.updateScoreDisplay();
    }
}
