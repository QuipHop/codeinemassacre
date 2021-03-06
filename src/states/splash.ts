import * as Phaser from 'phaser'

export class SplashState extends Phaser.State {

    preload() {

        //
        // load your assets
        //
        this.load.image('player', 'assets/images/player.png');
        this.load.image('loaderBg', './assets/images/loader-bg.png')
        this.load.image('loaderBar', './assets/images/loader-bar.png')
        this.load.spritesheet('punk', './assets/images/punk.png', 30, 39)
        this.load.spritesheet('baby', './assets/images/baby.png', 21, 24)
        this.load.spritesheet('girl', './assets/images/girl.png', 27, 37)
        this.load.spritesheet('boss', './assets/images/boss.png', 69, 89)
        this.load.spritesheet('mouse', './assets/images/mouse.png', 23, 11)
        this.load.spritesheet('blow', './assets/images/blow.png', 70, 40)
        this.load.image('syz', './assets/images/syz.png')
        this.load.image('syz2', './assets/images/syz2.png')
        this.load.image('bloodstain', './assets/images/bloodstain.png')
        this.load.spritesheet('bg1', './assets/images/bg_sprite.png', 500, 180)
        this.load.image('bg2', './assets/images/bg2.png')
        this.load.image('bg2_trip', './assets/images/bg2_trip.png')
        this.load.image('bg3', './assets/images/bg3.png')
        this.load.image('bg3_trip', './assets/images/bg3_trip.png')
        this.load.image('bg4', './assets/images/bg4.png')
        this.load.image('babyhead', './assets/images/babyhead.png')
        this.load.image('bosshead', './assets/images/rathead.png')
        this.load.image('road', './assets/images/road.png')
        this.load.spritesheet('ptero', './assets/images/ptero.png', 48, 33)
        this.load.spritesheet('tenticle', './assets/images/tenticle.png', 50, 60)
        this.load.spritesheet('trip_fire', './assets/images/trip_fire.png', 35, 40)
        this.load.spritesheet('trip_run', './assets/images/trip_run.png', 27, 42)
        this.load.spritesheet('trip_jump', './assets/images/trip_jump.png', 26, 46)
        this.load.spritesheet('normal_jump', './assets/images/normal_jump.png', 23, 46)
        this.load.spritesheet('normal_run', './assets/images/normal_run.png', 29, 41)
        this.load.audio('hitmob', './assets/sounds/hitmob.mp3')
        this.load.audio('pickup', './assets/sounds/pickup.mp3')
        this.load.audio('reload', './assets/sounds/reload.mp3')
        this.load.audio('shot', './assets/sounds/shot.mp3')
        this.load.audio('jump', './assets/sounds/jump.mp3')
        this.load.audio('menu_theme', './assets/sounds/menu_theme.mp3')
        this.load.audio('normal_theme', './assets/sounds/normal_theme.mp3')
        this.load.audio('trip_theme', './assets/sounds/trip_theme.mp3')
    }

    create() {
        this.game.state.start('Menu');
    }

}
