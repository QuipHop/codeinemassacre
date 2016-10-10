import * as Phaser from 'phaser'

export class Enemy extends Phaser.Sprite {
    private direction;
    private mode;
    private speed = 0;
    private playerBody;
    public attack: boolean = false;
    public attackSpeed = 1000;
    private attackTimer;
    public attackTween;
    public isAttacking: boolean = false;
    public dead;
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset)

        this.game = game
        this.anchor.setTo(0.5, 0.5)
        this.speed = this.game.rnd.integerInRange(20, 50);
        this.direction = this.game.rnd.integerInRange(0, 1) == 0 ? -1 : 1;
        this.attackTween = this.game.add.tween(this).to({ y: this.y + 5 }, 400, 'Linear', false, 400, 0, true);
        this.attackTween.onStart.add(() => { this.isAttacking = true });
        this.attackTween.onComplete.add(() => { this.isAttacking = false });
        this.animations.add('normal_run', [3, 4, 5, 6, 7], 5);
        this.animations.add('death', [8, 9, 10], 6);
        if (this.direction == -1) this.flipSprite(1)
        this.dead = false;
    }

    update() {
        if (!this.dead) {

            this.animations.play('normal_run');
            if (this.direction == -1) {
                this.body.velocity.x = -this.speed;
                if (this.body.x < 0) {
                    this.flipSprite(1);
                    this.direction = 1;
                }
            } else {
                this.body.velocity.x = +this.speed;
                if (this.body.x >= this.game.world.width) {
                    this.flipSprite(-1);
                    this.direction = -1;
                }
            }
            if (this.playerBody && this.mode == 'wave') {
                if (this.body.position.x <= this.playerBody.position.x - 10) {
                    this.body.velocity.x = +this.speed;
                    this.flipSprite(1);
                    this.direction = 1;
                } else if (this.body.position.x >= this.playerBody.position.x + 10) {
                    this.body.velocity.x = -this.speed;
                    this.flipSprite(-1);
                    this.direction = -1;
                } else {
                    if (!this.attackTween.isRunning) {
                        this.attackTween.start();
                    }
                }
            }
        }
    }
    followPlayer(body) {
        this.playerBody = body;
    }

    activate(mode) {
        this.mode = mode;
    }

    flipSprite(dir: number) {
        if (dir != this.direction) {
            this.scale.x *= -1;
        }
    }

    killMe() {
        if(this.dead)return false;
        this.body.enable = false;
        this.dead = true;
        console.log("KILL");
        this.speed = 0;
        this.body.velocity.x = 0;
        this.animations.play('death');
        setTimeout(()=>{
            this.kill();
        }, 2000);
    }
}
