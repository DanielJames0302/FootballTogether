import { Scene } from 'phaser';
import Ball from '../../../public/images/ball_soccer2.png'
import LeftGoal from '/images/left-goal/element (45).png'
import RightGoal from '/images/right-goal/element (41).png'
import Server from "../../services/Server";

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    private server !: Server
    init() {
        this.server = new Server()
      }
      preload() 
      {
        this.load.image('ball', Ball);
        this.load.image('chicken', '../../../public/textures/chicken.png');
        this.load.spritesheet('sokoban','../../../textures/sokoban_tilesheet.png', {
          frameWidth: 64
        })
        this.load.spritesheet('goal','../../../public/images/elements.png', {
          frameWidth: 64
        })
        this.load.image('pitch', '../../../public/images/football-field.jpg');
        this.load.image('leftGoal', LeftGoal);
        this.load.image('rightGoal', RightGoal);
      }
    
      create() 
      {
        this.anims.create({
          key: 'down-idle',
          frames: [{ key: 'sokoban', frame: 52}]
        })
    
        this.anims.create({
          key: 'down-walk',
          frames: this.anims.generateFrameNumbers('sokoban',{start: 52, end: 54}),
          frameRate: 10,
          repeat: -1
        })
    
        this.anims.create({
          key: 'up-idle',
          frames: [{ key: 'sokoban', frame: 55}]
        })
    
        this.anims.create({
          key: 'up-walk',
          frames: this.anims.generateFrameNumbers('sokoban',{start: 55, end: 57}),
          frameRate: 10,
          repeat: -1
        })
    
        this.anims.create({
          key: 'left-idle',
          frames: [{ key: 'sokoban', frame: 81}]
        })
    
        this.anims.create({
          key: 'left-walk',
          frames: this.anims.generateFrameNumbers('sokoban',{start: 81, end: 83}),
          frameRate: 10,
          repeat: -1
        })
    
        this.anims.create({
          key: 'right-idle',
          frames: [{ key: 'sokoban', frame: 78}]
        })
    
        this.anims.create({
          key: 'right-walk',
          frames: this.anims.generateFrameNumbers('sokoban',{start: 78, end: 80}),
          frameRate: 10,
          repeat: -1
        })
        this.scene.start('Game', {
          server: this.server
        })
      }
}