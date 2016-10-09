/// <reference path="../typings/browser.d.ts"/>
/// <reference path="../lib/phaser.d.ts"/>
import * as Phaser from 'phaser'

import {BootState} from './states/boot.ts'
import {MenuState} from './states/menu.ts'
import {SplashState} from './states/splash.ts'
import {GameState} from './states/game.ts'

class Game extends Phaser.Game {

    constructor() {
        let width = 160;
        let height = 144;

        super(width, height, Phaser.CANVAS, 'content', null)
        this.state.add('Boot', BootState)
        this.state.add('Splash', SplashState)
        this.state.add('Menu', MenuState)
        this.state.add('Game', GameState)

        this.state.start('Boot')
    }

}

new Game()
