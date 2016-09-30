/// <reference path="../typings/browser.d.ts"/>
/// <reference path="../lib/phaser.d.ts"/>
import * as Phaser from 'phaser'

import {BootState} from './states/boot.ts'
import {SplashState} from './states/splash.ts'
import {GameState} from './states/game.ts'

class Game extends Phaser.Game {

  constructor () {
    let width = 160;
    let height = 144;

    super(width, height, Phaser.AUTO, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Boot')
  }
}

new Game()
