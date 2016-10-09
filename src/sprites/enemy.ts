import * as Phaser from 'phaser'

export class Enemy extends Phaser.Sprite {
    private destination;
    private mode;
    private speed = 0;
    private playerBody;
    public attack: boolean = false;
    public attackSpeed = 1000;
    private attackTimer;
    public attackTween;
    public isAttacking: bool = false;
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset)

        this.game = game
        this.anchor.setTo(0.5, 0.5)
        this.speed = this.game.rnd.integerInRange(20, 50);
        this.destination = this.game.rnd.integerInRange(0, 1);
        this.tint = Math.random() * 0xffffff;
        this.attackTween = this.game.add.tween(this).to({ y: this.y + 5 }, 500, Phaser.Easing.Quadratic.In, false, 400, 0, true);
        this.attackTween.onStart.add(() => { this.isAttacking = true });
        this.attackTween.onComplete.add(() => { this.isAttacking = false });
        // this.attackTimer = this.game.time.create(false);
        // this.attackTimer.loop(Phaser.Timer.SECOND * 1, () => {
        //     console.log("ATTACK");
        //     this.attack = true;
        //     this.attackTimer.stop();
        // }, this);
    }

    update() {
        if (this.destination == 0) {
            this.body.velocity.x = -this.speed;
            if (this.body.x < 0) this.destination = 1;
        } else {
            this.body.velocity.x = +this.speed;
            if (this.body.x > this.game.world.width) this.destination = 0;
        }
        if (this.playerBody && this.mode == 'wave') {
            if (this.body.position.x <= this.playerBody.position.x - 10) {
                this.body.velocity.x = +this.speed;
            } else if (this.body.position.x >= this.playerBody.position.x + 10) {
                this.body.velocity.x = -this.speed;
            } else {
                if (!this.attackTween.isRunning) {
                    this.attackTween.start();
                }
                // if (!this.attackTimer.running) {
                //     this.attackTimer.start();
                // } else {
                //     this.attack = false;
                // }
            }
        }
    }
    followPlayer(body) {
        this.playerBody = body;
    }

    activate(mode) {
        this.mode = mode;
        console.log(this.mode);
    }

}
