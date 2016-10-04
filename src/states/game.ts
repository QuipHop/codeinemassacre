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
    init() { }
    preload() { }

    create() {
        this.modeSignal = new Phaser.Signal();
        this.modeBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.modeBtn.onDown.add(() => {
            this.mode == 'normal' ? this.mode = 'wave' : this.mode = 'normal';
            this.modeSignal.dispatch(this.mode);
        });

        this.game.world.setBounds(0, 0, 500, 180)
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
        this.bg = this.game.add.tileSprite(0, 0, 500, 180, 'bg')
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
            asset: 'guy'
        })
        this.player.anchor.setTo(0.5)
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        // this.player.body.gravity.y = 1000;
        this.player.body.maxVelocity.y = 500;
        // this.player.body.setSize(20, 32, 5, 16);
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER)

        this.enemies = this.game.add.group()
        this.enemies.enableBody = true;
        this.spawnMobs();
        this.game.physics.arcade.gravity.y = 1000;



    }

    render() {
        this.game.debug.body(this.player);
        // if (window['__DEV__']) {
        //     this.game.debug.spriteInfo(this.player, 32, 32)
        // }
    }

    update() {
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.enemies, this.ground);
    }

    spawnMobs() {
        for (let i = 0; i < 10; i++) {
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

    sendMode(){

    }
}
