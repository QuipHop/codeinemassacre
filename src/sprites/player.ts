import * as Phaser from 'phaser'

export class Player extends Phaser.Sprite {
    private cursors;
    private jumpTimer = 0;
    private jumpButton;
    private direction: number = 1;
    private weapon;
    public signal;
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset)

        this.game = game
        this.anchor.setTo(0.5)
        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.signal = new Phaser.Signal();
    }

    update() {
        this.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.sendSignal();
            this.body.velocity.x = -150;
            this.flipSprite(-1);
        }
        if (this.cursors.right.isDown) {
            this.scale.x = Math.abs(this.scale.x)
            this.sendSignal();
            this.body.velocity.x = +150;
            this.flipSprite(1);
        }
        if (this.jumpButton.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
            this.body.velocity.y = -400;
            this.jumpTimer = this.game.time.now + 750;
        }

    }

    fire() { }

    sendSignal() {
        this.signal.dispatch(this.body);
    }

    flipSprite(dir: number) {
        if (dir != this.direction) {
            console.log("SWITCH");
            this.scale.x *= -1;
            this.direction *= -1;
        }
    }
}
