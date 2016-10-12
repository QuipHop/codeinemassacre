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
    public deathAnim;
    private assets = {
        punk: {
            run: {
                frames: [4, 5, 6, 7],
                fs: 6
            },
            death: {
                frames: [8, 9],
                fs: 6
            },
            attack: {
                frames: [2, 3],
                fs: 4
            }
        },
        baby: {
            run: {
                frames: [0, 1, 2, 3, 4],
                fs: 6
            },
            death: {
                frames: [10, 11, 12],
                fs: 6
            },
            attack: {
                frames: [6, 7, 9, 9, 10],
                fs: 5
            }
        }
    };
    constructor({ game, x, y, asset}) {
        super(game, x, y, asset)
        this.game = game
        this.anchor.setTo(0.5, 0.5)
        this.speed = this.game.rnd.integerInRange(20, 50);
        this.direction = this.game.rnd.integerInRange(0, 1) == 0 ? -1 : 1;
        this.attackTween = this.game.add.tween(this).to({ y: this.y + 5 }, 400, 'Linear', false, 400, 0, true);
        this.attackTween.onStart.add(() => {
            this.animations.stop('normal_run');
            this.isAttacking = true;
            this.animations.play('attack');
        });
        this.attackTween.onComplete.add(() => { this.isAttacking = false });
        this.animations.add('normal_run', this.assets[asset].run.frames, this.assets[asset].run.fs);
        this.deathAnim = this.animations.add('death', this.assets[asset].death.frames, this.assets[asset].death.fs);
        this.animations.add('attack', this.assets[asset].attack.frames, this.assets[asset].attack.fs);
        if (this.direction == -1) this.flipSprite(1)
        this.dead = false;
        this.deathAnim.onComplete.add(() => {
            this.angle = this.direction == 1 ? 90 : -90;
            this.frame = (asset == 'punk' ? 10 : 13)
        })
    }

    update() {
        if (!this.dead) {
            if (!this.isAttacking) this.animations.play('normal_run');
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
        if (this.dead) return false;
        this.body.enable = false;
        this.dead = true;
        this.speed = 0;
        this.body.velocity.x = 0;
        this.animations.play('death');
        setTimeout(() => {
            this.destroy();
        }, 2000);
    }
}
