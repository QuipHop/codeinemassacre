import * as Phaser from 'phaser'
import { Player } from '../sprites/player.ts'
import { Enemy } from '../sprites/enemy.ts'
// import {setResponsiveWidth} from '../utils.ts'

export class GameState extends Phaser.State {
    player: Player;
    bg;
    ground;
    enemies;
    mode: string = 'normal';
    modeBtn;
    modeSignal;
    label;
    syzItems;
    wave: number = 1;
    init() { }
    preload() { }

    create() {
        this.modeSignal = new Phaser.Signal();
        this.modeBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.modeBtn.onDown.add(() => {
            window['__DEV__'] == undefined ? window['__DEV__'] = true : window['__DEV__'] = undefined;
            // this.mode == 'normal' ? this.mode = 'wave' : this.mode = 'normal';
            // this.modeSignal.dispatch(this.mode);
        });

        this.game.world.setBounds(0, 0, 500, 180)
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        let bg4 = this.game.add.tileSprite(0, 0, 500, 180, 'bg4')
        bg4.fixedToCamera = true;
        let bg3 = this.game.add.tileSprite(0, 0, 500, 180, 'bg3')
        let bg2 = this.game.add.tileSprite(-20, 0, 500, 180, 'bg2')
        let bg1 = this.game.add.tileSprite(0, 0, 500, 180, 'bg1')
        //ground
        this.game.create.texture('endTexture', ['000'], 1, 1, 1)
        this.ground = this.game.add.sprite(-100, this.game.world.height - 10, 'endTexture');
        this.ground.width = this.game.world.width + 100
        this.ground.height = 20;
        this.ground.alpha = 0;
        this.game.physics.enable(this.ground, Phaser.Physics.ARCADE);
        this.ground.enableBody = true;
        this.ground.body.allowGravity = false;
        this.ground.body.immovable = true;
        this.player = new Player({
            game: this.game,
            x: this.game.world.centerX,
            y: this.game.world.centerY,
            asset: 'guy',
            bgs: [bg2, bg3]
        })
        this.modeSignal.add(this.player.onModeChanged, this.player);
        this.player.anchor.setTo(0.5, 0.5)
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        // this.player.body.gravity.y = 1000;
        this.player.body.maxVelocity.y = 500;
        // this.player.body.setSize(20, 32, 5, 16);
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.SHAKE_BOTH)

        this.enemies = this.game.add.group()
        this.enemies.enableBody = true;
        this.spawnMobs(1, false);
        this.game.physics.arcade.gravity.y = 1000;
        this.label = this.game.add.text(this.game.world.centerX, 80, ' GRAB SIZZURP ! ', { font: "12px 'gameboy'", fill: '#5930ba', align: 'center', backgroundColor: "#faa8d0" })
        this.label.anchor.setTo(0.5);
        this.label._pulseTween = this.game.add.tween(this.label).to({ fontSize: 13 }, 600, Phaser.Easing.Quadratic.In, true, 0, -1);
        this.syzItems = this.game.add.group();
        this.syzItems.enableBody = true;
        this.spawnItem();
    }

    update() {
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.enemies, this.ground);
        this.game.physics.arcade.collide(this.syzItems, this.ground);
        if (this.mode == 'wave') {
            this.label.text = " WAVE " + this.wave
            this.game.physics.arcade.overlap(this.player, this.enemies, this.hitPlayer);
            this.game.physics.arcade.overlap(this.enemies, this.player.weapon.bullets, (enemy, bullet) => {
                enemy.kill();
                bullet.kill();
                this.checkAlive();
            }, null, this);
        } else {
            this.game.physics.arcade.overlap(this.player, this.syzItems, (player, item) => {
                item.kill();
                this.mode = 'wave';
                this.modeSignal.dispatch(this.mode);
            });
        }

    }

    spawnMobs(value: number, res: boolean) {
        this.enemies.removeAll();
        for (let i = 0; i < value; i++) {
            let enemy = this.enemies.add(new Enemy({
                game: this.game,
                x: this.game.rnd.integerInRange(0, this.game.world.width),
                y: this.game.world.height - 40,
                asset: 'player'
            }));
            this.player.signal.add(enemy.followPlayer, enemy);
            this.modeSignal.add(enemy.activate, enemy);
            this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        }
    }

    sendMode() {

    }

    render() {
        if (window['__DEV__']) {
            this.game.debug.body(this.player);
            this.player.weapon.debug(-100, 1000, true);
        }
    }

    hitPlayer(player, monster) {
        if(monster.attack){
            console.log("HIT");
        }
    }

    spawnItem() {
        let _item = this.syzItems.create(this.game.rnd.integerInRange(0, this.world.width), 0, 'syz');
        _item.body.bounce.set(0.3);
        _item.anchor.setTo(0.5);
    }

    checkAlive() {
        if (this.enemies.countLiving() == 0) {
            this.mode = 'normal';
            this.modeSignal.dispatch(this.mode);
            this.wave++;
            this.spawnMobs(7 * this.wave, true);
            this.spawnItem();
        }
    }
}
