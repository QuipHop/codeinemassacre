import * as Phaser from 'phaser'
import { Player } from '../sprites/player.ts'
import { Enemy } from '../sprites/enemy.ts'
// import {setResponsiveWidth} from '../utils.ts'

export class GameState extends Phaser.State {
    public player: Player;
    public bg;
    public ground;
    public enemies;
    public mode: string;
    public modeBtn;
    public modeSignal;
    public label;
    public syzItems;
    public wave: number;
    public gameEnded: boolean;
    public tripTheme;
    public normalTheme;
    public gameOverMenu;
    public bloodEmit;
    init() {
        this.wave = 1;
        this.mode = 'normal';
        this.gameEnded = false;
    }
    preload() { }

    create() {
        this.normalTheme = this.game.add.sound('normal_theme', 0.3, true)
        this.tripTheme = this.game.add.sound('trip_theme', 0, true)
        this.normalTheme.play();
        this.tripTheme.play();
        this.modeSignal = new Phaser.Signal();
        this.modeBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
        this.modeBtn.onDown.add(() => {
            window['__DEV__'] == undefined ? window['__DEV__'] = true : window['__DEV__'] = undefined;
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
        this.game.create.texture('bloodTexture', ['5930ba'], 1, 1, 1)
        this.ground = this.game.add.sprite(-400, this.game.world.height - 10, 'endTexture');
        this.ground.width = this.game.world.width + 400
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
            asset: 'normal_run',
            bgs: [bg2, bg3]
        })
        this.modeSignal.add(this.player.onModeChanged, this.player);
        this.player.anchor.setTo(0.5, 0.5)
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.maxVelocity.y = 500;
        this.game.add.existing(this.player)
        this.game.camera.follow(this.player, Phaser.Camera.SHAKE_BOTH)

        this.enemies = this.game.add.group()
        this.enemies.enableBody = true;
        this.spawnMobs(5, false);
        this.game.physics.arcade.gravity.y = 1000;
        this.label = this.game.add.text(this.game.world.centerX, 80, ' GRAB SIZZURP ! ', { font: "12px 'gameboy'", fill: '#5930ba', align: 'center', backgroundColor: "#faa8d0" })
        this.label.anchor.setTo(0.5);
        this.label._pulseTween = this.game.add.tween(this.label).to({ fontSize: 13 }, 600, Phaser.Easing.Quadratic.In, true, 0, -1);
        this.syzItems = this.game.add.group();
        this.syzItems.enableBody = true;
        this.spawnItem();

        this.bloodEmit = this.game.add.emitter(0, 0, 100);
        this.bloodEmit.makeParticles('bloodTexture');
        this.bloodEmit.maxParticleSpeed = new Phaser.Point(50, 25);
        this.bloodEmit.minParticleSpeed = new Phaser.Point(-50, 25);
        this.bloodEmit.lifespan = 1000;
    }

    update() {
        this.game.physics.arcade.collide(this.player, this.ground);
        this.game.physics.arcade.collide(this.enemies, this.ground);
        this.game.physics.arcade.collide(this.syzItems, this.ground);
        if (!this.gameEnded) {
            if (this.mode == 'wave') {
                this.label.text = " WAVE " + this.wave
                this.game.physics.arcade.overlap(this.player, this.enemies, this.hitPlayer, null, this);
                this.game.physics.arcade.overlap(this.enemies, this.player.weapon.bullets, (enemy, bullet) => {
                    this.game.sound.play('hitmob');
                    enemy.body.touching.left ? this.bloodEmit.setXSpeed(10, 150) : this.bloodEmit.setXSpeed(-10, -150);
                    this.bloodEmit.setYSpeed(10, 50)
                    this.bloodEmit.emitX = enemy.body.x;
                    this.bloodEmit.emitY = enemy.body.y + 15;
                    this.bloodEmit.explode(1000, 10)
                    enemy.killMe()
                    bullet.kill();
                    this.checkAlive();
                }, null, this);

            } else {
                this.label.text = " GRAB SIZZURP ! "
                this.game.physics.arcade.overlap(this.player, this.syzItems, (player, item) => {
                    item.kill();
                    this.player.heal();
                    this.mode = 'wave';
                    this.modeSignal.dispatch(this.mode);
                    this.normalTheme.volume = 0;
                    this.tripTheme.volume = 0.6
                });
            }
        } else {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.game.sound.stopAll();
                this.game.state.start('Menu', true);
            }
        }
    }

    spawnMobs(value: number, res: boolean) {
        this.enemies.removeAll();
        for (let i = 0; i < value; i++) {
            let enemy = this.enemies.add(new Enemy({
                game: this.game,
                x: this.game.rnd.integerInRange(0, this.game.world.width - 20),
                y: this.game.world.height - 40,
                asset: 'punk'
            }));
            this.player.signal.add(enemy.followPlayer, enemy);
            this.modeSignal.add(enemy.activate, enemy);
            this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
        }
    }


    hitPlayer(player, monster) {
        if (player.takeHit(player, monster) == false) {
            this.gameEnded = true;
            this.renderMenu();
            if (!localStorage.getItem('highscore') || localStorage.getItem('highscore') < this.wave) {
                localStorage.setItem('highscore', this.wave)
            }

        }
    }

    spawnItem() {
        let _item = this.syzItems.create(this.game.rnd.integerInRange(0, this.world.width), 0, 'syz2');
        _item.body.bounce.set(0.3);
        _item.anchor.setTo(0.5);
    }

    checkAlive() {
        if (this.countLiving() == 0) {
            this.mode = 'normal';
            this.modeSignal.dispatch(this.mode);
            this.wave++;
            this.spawnMobs(3 * this.wave, true);
            this.spawnItem();
            this.normalTheme.volume = 0.3;
            this.tripTheme.volume = 0;
        }
    }

    renderMenu() {
        this.gameOverMenu = this.game.add.group();
        let gameOverText = this.game.add.text(this.game.camera.width / 2, this.game.camera.height / 2, 'GAME OVER\nSCORE: ' + this.wave + '\n press start', { font: "12px 'gameboy'", fill: '#5930ba', align: 'center', backgroundColor: "#faa8d0" })
        gameOverText.anchor.setTo(0.5)
        this.gameOverMenu.add(gameOverText);
        this.gameOverMenu.fixedToCamera = true;
    }

    render() {
        if (window['__DEV__']) {
            this.game.debug.body(this.player);
            this.enemies.forEach((e) => {
                this.game.debug.body(e);
            });
            this.player.weapon.debug(-100, 1000, true);
        }
    }
    countLiving() {
        let living = 0;
        this.enemies.forEach((e) => {
            if (!e.dead) living++;
        })
        return living;
    }
}
