import * as Phaser from 'phaser'

export class Player extends Phaser.Sprite {
    private cursors;
    private jumpTimer = 0;
    private jumpButton;
    private direction;
    private weapon;
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset)

        this.game = game
        this.anchor.setTo(0.5)
        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        this.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.direction = 0;
            this.body.velocity.x = -150;
        }
        if (this.cursors.right.isDown) {
            this.direction = 1;
            this.body.velocity.x = +150;
        }
        if (this.jumpButton.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
            this.body.velocity.y = -400;
            this.jumpTimer = this.game.time.now + 750;
        }
    }

}
