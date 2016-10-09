import * as Phaser from 'phaser'

export class MenuState extends Phaser.State {
    playText;
    label;
    startBtn;
    bg;
    texture;
    highscore;
    highscoreLabel;
    init() {
        this.highscore = localStorage.getItem('highscore')
    }

    preload() {

    }

    create() {
        this.game.world.setBounds(0, 0, 160, 144)
        this.bg = this.game.make.sprite(0, 0, 'syz');
        this.bg.alpha = 0.3;
        this.texture = this.game.add.renderTexture(44, 40);
        this.texture.renderXY(this.bg, 0, 0, false);
        this.game.cache.addImage('tsTexture', '', this.texture.getImage());
        let ts = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'tsTexture');
        ts.autoScroll(0, 20);
        this.playText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 40, 'PRESS START', { font: "8px 'gameboy'", fill: '#5930ba', align: 'center' });
        this.playText.anchor.setTo(0.5);
        this.label = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 10, 'CODEINE\nMASSACRE', { font: "12px 'gameboy'", fill: '#5930ba', align: 'center', boundsAlignH: "center", boundsAlignV: "middle" });
        this.label.anchor.setTo(0.5);
        this.playText._tween = this.game.add.tween(this.playText).to({ alpha: 0 }, 600, Phaser.Easing.Linear.In, true, 0, -1, true);
        this.startBtn = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.highscoreLabel = this.game.add.text(this.game.world.centerX, this.game.world.height - 20, 'HIGHSCORE ' + this.highscore, { font: "7px 'gameboy'", fill: '#5930ba', align: 'center', boundsAlignH: "center", boundsAlignV: "middle" });
        this.highscoreLabel.anchor.setTo(0.5)
        if(!this.highscore)this.highscoreLabel.visible = false;
        this.startBtn.onDown.add(() => {
            this.game.state.start('Game', true);
        }, this);
    }
}
