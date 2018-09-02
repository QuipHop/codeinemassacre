// import * as WebFont from 'webfontloader'

export class BootState extends Phaser.State {
    stage: Phaser.Stage

    init() {
        this.stage.backgroundColor = '#faa8d0'
        this.game.stage.smoothed = false
    }

    preload() {
        let text = this.add.text(this.world.centerX, this.world.centerY, 'LOADING', { font: "16px 'gameboy'", fill: '#5930ba', align: 'center' })
        text.anchor.setTo(0.5, 0.5)
    }

    render() {
        // if (this.fontsReady) {
            this.game.state.start('Splash')
        // }
    }
}
