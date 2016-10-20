,import * as Phaser from 'phaser'
import {Frameset} from '../frameset.ts';

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
    public health;
    public blow;
    public castTimer;
    public isCasting: boolean = false;
    public castTween;
    private ratEmit;
    public castCompleteInterval;
    private castTimeout: number = 10;
    public blowdust;
    constructor({ game, x, y, asset, speed, health, playerBody}, private assets = Frameset) {
        super(game, x, y, asset)
        this.game = game
        this.health = health || 1;
        this.anchor.setTo(0.5, 0.5)
        this.mode = 'normal';
        this.speed = speed || this.game.rnd.integerInRange(20, 50);
        this.direction = this.game.rnd.integerInRange(0, 1) == 0 ? -1 : 1;
        this.attackTween = this.game.add.tween(this).to({ y: asset == 'boss' ? this.y : this.y + 5 }, 400, Phaser.Easing.Bounce.Out, false, asset == 'boss' ? 600 : 400, 0, true);
        this.attackTween.onStart.add(() => {
            this.isAttacking = true;
            this.animations.play('attack');
        });
        this.attackTween.onComplete.add(() => {
            this.isAttacking = false;
            if (asset == 'boss') {
                this.game.camera.shake(0.05, 400);
            }
        });
        this.animations.add('normal_run', this.assets[asset].run.frames, this.assets[asset].run.fs);
        this.deathAnim = this.animations.add('death', this.assets[asset].death.frames, this.assets[asset].death.fs);
        this.animations.add('attack', this.assets[asset].attack.frames, this.assets[asset].attack.fs);
        if (this.direction == -1) this.flipSprite(1)
        this.dead = false;
        this.deathAnim.onStart.add(() => {
            this.body.velocity.x = -this.direction * 50;
        });
        this.deathAnim.onComplete.add(() => {
            this.body.velocity.x = 0;
            this.body.enable = false;
            if (asset == 'girl') {
            } else if (asset == 'boss'){
                this.angle = this.direction == 1 ? -90 : 90;
                this.anchor.set(0.7);
                this.frame = 22;
                this.ratEmit.destroy();
                this.castTimer.destroy();
                this.game.camera.shake(0.05, 400);
            } else {
                this.angle = this.direction == 1 ? 90 : -90;
                this.frame = (asset == 'punk' ? 10 : 13)
            }
        })
        if (asset == 'boss') {
            this.playerBody = playerBody;
            this.mode = 'wave';
            this.ratEmit = this.game.add.emitter(0, 0, 8);
            this.game.physics.enable(this.ratEmit, Phaser.Physics.ARCADE);
            this.ratEmit.enableBody = true;
            this.ratEmit.makeParticles('mouse', 0, 8, true);
            this.ratEmit.setRotation(0, 0);
            this.ratEmit.children.forEach((c) => {
                c.animations.add('run');
                c.animations.play('run', 15, true);
            });
            this.castTween = this.animations.add('cast', this.assets[asset].cast.frames, this.assets[asset].cast.fs);
            this.castTween.onStart.add(() => {
                this.castTimer.pause();
                let min = -50;
                let max = -100;
                if (this.direction == 1) {
                    min = 50;
                    max = 100;
                    this.ratEmit._maxParticleScale.x = -1;
                    this.ratEmit._minParticleScale.x = -0.99; //a bit hacky :D
                }
                this.ratEmit.forEach((c) => { c.maxParticleScaleX = -1 });
                this.ratEmit.setXSpeed(min, max);
                this.ratEmit.emitX = this.direction == 1 ? -10 : this.game.world.width + 10;
                this.ratEmit.emitY = this.body.y;
                this.ratEmit.minRotation = this.ratEmit.maxRotation = 0;
                this.ratEmit.start(false, 10000, 5);
            });
            this.castTween.onComplete.add(() => {
                this.ratEmit.on = false;
                this.castCompleteInterval = setTimeout(() => {
                    this.isCasting = false;
                    this.body.velocity.x = this.speed;
                    this.castTimer.resume();
                }, 3000);
            }, null, this)
        }
    }

    update() {
        if (!this.dead) {
            switch (this.mode) {
                case 'normal':
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
                    break;
                case 'wave':
                    if (!this.castTimer && this.key == 'boss') {
                        this.initCastTimer();
                    }
                    if (!this.isAttacking && !this.isCasting) {
                        if (this.body.position.x <= this.playerBody.position.x - this.playerBody.halfWidth) {
                            this.body.velocity.x = +this.speed;
                            this.flipSprite(1);
                            this.direction = 1;
                            this.animations.play('normal_run');
                        } else if (this.body.position.x >= this.playerBody.position.x + this.playerBody.halfWidth) {
                            this.body.velocity.x = -this.speed;
                            this.flipSprite(-1);
                            this.direction = -1;
                            this.animations.play('normal_run');
                        } else {
                            this.animations.stop();
                            // if (!this.attackTween.isRunning) {
                            this.attackTween.start();
                            // }
                        }
                    }

                    break;
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
        this.health--;
        if (this.health <= 0) {
            this.animations.stop('attack');
            this.animations.stop('normal_run');
            this.animations.play('death');
            this.dead = true;
            this.speed = 0;
            this.isAttacking = false;
            this.isCasting = false;
            if(this.castCompleteInterval)clearInterval(this.castCompleteInterval);
            // setTimeout(() => {
            //     this.destroy();
            // }, 2000);
        }
    }

    initCastTimer() {
        if(!this.dead){
            this.castTimer = this.game.time.create(false);
            this.castTimer.loop(Phaser.Timer.SECOND * this.castTimeout, () => {
                this.isCasting = true;
                this.body.velocity.x = 0;
                this.animations.play('cast');
            }, this);
            this.castTimer.start();
        }
    }
}
