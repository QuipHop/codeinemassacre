import * as Phaser from 'phaser'

export class Enemy extends Phaser.Sprite {
    private destination;
    private mode;
    private speed = 0;
    private playerBody;
    constructor({ game, x, y, asset }) {
        super(game, x, y, asset)

        this.game = game
        this.anchor.setTo(0.5)
        this.speed = this.game.rnd.integerInRange(20,50);
        this.destination = this.game.rnd.integerInRange(0,1);
        this.tint = Math.random() * 0xffffff;
    }

    update() {
        if(this.destination == 0){
            this.body.velocity.x = -this.speed;
            if(this.body.x < 0)this.destination = 1;
        } else {
            this.body.velocity.x = +this.speed;
            if(this.body.x > this.game.world.width)this.destination = 0;
        }
        if(this.playerBody && this.mode == 'wave'){
            if(this.body.x <= this.playerBody.x)this.body.velocity.x = +this.speed;
            else if(this.body.x >= this.playerBody.x)this.body.velocity.x = -this.speed;
            else {

            }
        }
    }

    followPlayer(body){
        this.playerBody = body;
    }

    activate(mode){
        this.mode = mode;
        console.log(this.mode);
    }

}