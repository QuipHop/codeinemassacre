import * as Phaser from 'phaser'

export class Player extends Phaser.Sprite {
    private cursors;
    private jumpTimer = 0;
    private fireButton;
    private direction: number = 1;
    private weapon;
    public signal;
    private mode;
    private speed: number = 150;
    private bgs;
    public health: number = 3;
    public maxHealth = 3;
    public healthGroup;
    public hitTick = 500;
    public walkAnimation_normal;
    public walkAnimation_trip;
    public hitTween;
    public gameOver: boolean = false;
    public shellEmit;
    public bloodGroup;
    constructor({ game, x, y, asset, bgs }) {
        super(game, x, y, asset)
        this.bgs = bgs;
        this.game = game
        this.anchor.setTo(0.5)
        this.cursors = game.input.keyboard.createCursorKeys();
        this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.signal = new Phaser.Signal();
        let _sprite = this.game.create.texture('bulletTexture', ['0,0,0,0'], 2, 40, 0)
        this.weapon = game.add.weapon(1, _sprite);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        this.weapon.bulletSpeed = 1000;
        this.weapon.fireRate = 800;
        this.weapon.alpha = 0;
        this.weapon.bulletGravity.y = -1000;
        this.weapon.bullets.setAll('alpha', 0);
        this.weapon.onFire.add(() => {
            this.game.camera.shake(0.02, 50);
            this.playAnimation('fire');
            this.game.sound.play('reload');
            setTimeout(()=>{
                this.game.sound.play('reload');
                this.shellEmit.emitParticle(this.body.x, this.body.y);
            }, 500);
        })
        this.animations.add('normal_run');
        this.animations.add('normal_jump');
        this.animations.add('trip_run');
        this.animations.add('trip_jump');
        this.animations.add('trip_fire');
        this.hitTween = this.game.add.tween(this).to({ alpha: 0 }, 100, 'Linear', false, 0, 5, true);
        this.healthGroup = this.game.add.group();
        for (let i = 0; i < this.health; i++) {
            let live = this.healthGroup.create(5 + i * 15, 10, 'syz2');
            live.anchor.setTo(0.5, 0.5);
        }
        this.healthGroup.fixedToCamera = true;
        this.shellEmit = this.game.add.emitter(0, 0, 1);
        this.shellEmit.makeParticles('bloodTexture');
        this.shellEmit.maxParticleSpeed = new Phaser.Point(-10, 5);
        this.shellEmit.minParticleSpeed = new Phaser.Point(10, 5);
        this.shellEmit.lifespan = 500;
        this.bloodGroup = this.game.add.group();
    }

    update() {
        if (!this.gameOver) {
            this.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.sendSignal();
                this.body.velocity.x = -this.speed;
                this.flipSprite(-1);
                // if (!this.game.camera.atLimit.x) {
                //     this.bgs[0].tilePosition.x += 0.3;
                //     this.bgs[1].tilePosition.x += 0.1;
                // }
                this.playAnimation('run');
            }
            else if (this.cursors.right.isDown) {
                this.scale.x = Math.abs(this.scale.x)
                this.sendSignal();
                this.body.velocity.x = +this.speed;
                this.flipSprite(1);
                // if (!this.game.camera.atLimit.x) {
                //     this.bgs[0].tilePosition.x -= 0.3;
                //     this.bgs[1].tilePosition.x -= 0.1;
                // }
                this.playAnimation('run');
            }
            if (this.cursors.up.isDown && this.body.touching.down && this.game.time.now > this.jumpTimer) {
                this.body.velocity.y = -400;
                this.jumpTimer = this.game.time.now + 750;
                this.playAnimation('jump');
            }
            if (this.fireButton.isDown) {
                this.fire(this);
            }
            if (this.cursors.right.isUp && this.cursors.left.isUp && this.cursors.up.isUp && !this.animations.isPlaying && this.key != 'trip_fire') {
                this.animations.frame = 0;
            }
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
    playAnimation(anim: string) {
        switch (anim) {
            case 'run': if (this.mode == 'wave') {
                if (!this.body.touching.down) break;
                if (this.key != 'trip_run') this.loadTexture('trip_run');
                this.animations.play('trip_run', 8);
            } else {
                if (this.key != 'normal_run') this.loadTexture('normal_run');
                this.animations.play('normal_run', 8);
            }
            break;
            case 'jump':
            this.game.sound.play('jump');
            if (this.mode == 'wave') {
                if (this.key != 'trip_jump') this.loadTexture('trip_jump');
                this.animations.play('trip_jump', 8);
            } else {
                if (this.key != 'normal_jump') this.loadTexture('normal_jump');
                this.animations.play('normal_jump', 8);
            }
            break;
            case 'fire':
            this.game.sound.play('shot');
            if (this.key != 'trip_fire') this.loadTexture('trip_fire');
            this.animations.play('trip_fire', 10);
            break;
        }
    }
    onModeChanged(mode) {
        this.mode = mode;
        if(this.mode == 'wave'){
            this.bgs[0].loadTexture('bg2_trip');
            this.bgs[1].loadTexture('bg3_trip');
            this.loadTexture('trip_run');
        } else {
            this.bloodGroup.removeAll();
            this.loadTexture('normal_run');
            this.bgs[0].loadTexture('bg2');
            this.bgs[1].loadTexture('bg3');
        }
        this.game.camera.flash(0x5930ba, 500);
    }

    takeHit(player, monster) {
        if (monster.isAttacking && monster.key != 'mouse' ) {
            return this.hit();
        }
        if(monster.key == 'mouse' && monster.alive){
            if(monster.body.touching.up && player.body.touching.down){
                this.body.velocity.y = -200;
                monster.kill();
                var blood = this.bloodGroup.create(monster.body.x, monster.body.y, 'bloodstain');
                return true;
            }
            if(player.body.touching.left || player.body.touching.right){
                return this.hit();
            }
        }

    }

    heal() {
        this.game.sound.play('pickup');
        if (this.healthGroup.countLiving() >= 3) return false;
        let live = this.healthGroup.getFirstDead().revive();
    }

    hit() {
        if(this.game.time.now - this.hitTick > 2000){
            this.game.sound.play('hitmob');
            this.hitTween.start();
            let live = this.healthGroup.getAt(this.healthGroup.countLiving() - 1);
            this.hitTick = this.game.time.now;
            if (live) {
                live.kill();
            }
            if (this.healthGroup.countLiving() < 1) {
                this.body.velocity.x = 0;
                this.gameOver = true;
                return false;
            }
        }
    }
}
