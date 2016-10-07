import * as Phaser from 'phaser'

export class Player extends Phaser.Sprite {
    private cursors;
    private jumpTimer = 0;
    private fireButton;
    private direction: number = 1;
    private weapon;
    public signal;
    private mode;
    private speed = 150;
    private bgs;
    public health = 3;
    constructor({ game, x, y, asset, bgs }) {
        super(game, x, y, asset)
        this.bgs = bgs;
        this.game = game
        this.anchor.setTo(0.5)
        this.cursors = game.input.keyboard.createCursorKeys();
        this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.signal = new Phaser.Signal();
        let _sprite = this.game.create.texture('bulletTexture', ['0,0,0,0'], 2, 40, 0)
        // _sprite.alpha = 0;
        console.log(_sprite);
        this.weapon = game.add.weapon(1, _sprite);
        // this.weapon.setBulletFrames(0, 80, true);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        this.weapon.bulletSpeed = 1000;
        this.weapon.fireRate = 1000;
        this.weapon.alpha = 0;
        this.weapon.bulletGravity.y = -1000;
        this.weapon.bullets.setAll('alpha', 0);
        this.weapon.onFire.add(() => {
            this.game.camera.shake(0.02, 50);
        })
    }

    update() {
        this.body.velocity.x = 0;
        if (this.cursors.left.isDown) {
            this.sendSignal();
            this.body.velocity.x = -this.speed;
            this.flipSprite(-1);
            if (!this.game.camera.atLimit.x) {
                this.bgs[0].tilePosition.x += 0.3;
                this.bgs[1].tilePosition.x += 0.1;
            }

        }
        if (this.cursors.right.isDown) {
            this.scale.x = Math.abs(this.scale.x)
            this.sendSignal();
            this.body.velocity.x = +this.speed;
            this.flipSprite(1);
            if (!this.game.camera.atLimit.x) {
                this.bgs[0].tilePosition.x -= 0.3;
                this.bgs[1].tilePosition.x -= 0.1;
            }
        }
        if (this.cursors.up.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
            this.body.velocity.y = -400;
            this.jumpTimer = this.game.time.now + 750;
        }
        if (this.fireButton.isDown) {
            this.fire(this);
        }

    }

    fire() {
        if (this.mode == 'wave') {
            this.weapon.fireAngle = this.direction == -1 ? Phaser.ANGLE_LEFT : Phaser.ANGLE_RIGHT;
            this.weapon.fire(this);
        }
    }

    sendSignal() {
        this.signal.dispatch(this.body);
    }

    flipSprite(dir: number) {
        if (dir != this.direction) {
            this.scale.x *= -1;
            this.direction *= -1;
        }
    }

    onModeChanged(mode) {
        this.mode = mode;
    }
}
