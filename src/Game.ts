import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;

    // dimentions of tetris game
    
    constructor ()
    {
        super('Game');
    }


    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x88A4A8);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

}
