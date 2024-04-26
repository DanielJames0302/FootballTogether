import Phaser from "phaser";
import * as Colyseus from  'colyseus.js'
import { Room } from "colyseus.js";


export default class Game extends Phaser.Scene {
  private client?: Colyseus.Client
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private player?: Phaser.Physics.Arcade.Sprite;
  private background?: Phaser.GameObjects.Image;
  private platformTopLeft?: Phaser.Physics.Arcade.StaticGroup;
  private platformTopRight?: Phaser.Physics.Arcade.StaticGroup;
  private platformBottomLeft?: Phaser.Physics.Arcade.StaticGroup;
  private platformBottomRight?: Phaser.Physics.Arcade.StaticGroup;
  private platformTop?: Phaser.Physics.Arcade.StaticGroup;
  private platformBottom?: Phaser.Physics.Arcade.StaticGroup;
  private leftGoal?: Phaser.Physics.Arcade.StaticGroup;
  private rightGoal?: Phaser.Physics.Arcade.StaticGroup;
  private ball?: Phaser.Physics.Arcade.Sprite;
  private homeScore: number = 0;
  private opponentScore: number = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private isGoal: boolean = false;
  private width = 0
  private height = 0
  ball_clientID = ''
  x: number = 500;
  y: number= 300
  currentBall?: Phaser.Physics.Arcade.Sprite;
  key?: string = 'down';
  room?: Room;
  playerEntities: {[sessionId: string]: any} = {};
  currentPlayer?:  Phaser.Physics.Arcade.Sprite;
  remoteRef?: Phaser.GameObjects.Rectangle;
  isHavingBall: boolean = false;
  clientID: string = ''
  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    direction: 'down',
    isCollide: false,
    x: 0,
    y: 0, 
    ball_x: 500,
    ball_y: 300,
};
  ball_x: number = 500;
  ball_y: number = 300;
  isChange?: boolean = false;

  constructor() {
    super("game");
  }
  init() {
    this.client = new Colyseus.Client('http://localhost:2567 ')
    this.cursors = this.input.keyboard?.createCursorKeys();
  }

  async create() {
    try {
      this.room = await this.client?.joinOrCreate("my_room");
      console.log("Joined successfully!");

    } catch (e) {
      console.error(e);
    }
    const { width, height } = this.scale;
   
    this.room?.state.ball.onChange(() => {
        this.ball_x = this.room?.state.ball.x
        this.ball_y = this.room?.state.ball.y
        this.ball_clientID = this.room?.state.ball.clientID
    })
    this.room?.state?.reset?.onChange(() => {
      this.player!.x = 700;
      this.player!.y = 300;
      this.ball?.setVelocity(0,0)
    })
    

    this.room?.state.players.onAdd((player:any, sessionId:any) => {
      
      if (sessionId === this.room?.sessionId) {
        this.clientID = sessionId
    
        // remoteRef is being used for debug only
     /*   this.remoteRef = this.add.rectangle(0, 0, this.player?.width, this.player?.height);
        this.remoteRef.setStrokeStyle(1, 0xff0000); */

    /*    player.onChange(() => {
            this.ball_x = player.ball_x;
            this.ball_y = player.ball_y;
         //   entity.setData('serverX', player.x);
          //  entity.setData('serverY', player.y);
          // entity.setData('direction', player.direction);
        }); */
       // this.ball_x = player.ball_x;
       // this.ball_y = player.ball_y;

    } else {
        const entity = this.physics.add.sprite(player.x, player.y, 'sokoban').play('down-idle');
        // keep a reference of it on `playerEntities`
        this.playerEntities[sessionId] = entity;
        // all remote players are here!
        // (same as before, we are going to interpolate remote players)
        player.onChange(() => {
     
            entity.setData('serverX', player.x);
            entity.setData('serverY', player.y);
            entity.setData('direction', player.direction);
        });
    }
    });
    
    this.room?.state.players.onRemove((player: any, sessionId: any) => {
      const entity = this.playerEntities[sessionId];
      if (entity) {
          // destroy entity
          entity.destroy();

          // clear local reference
          delete this.playerEntities[sessionId];
      }
  });
    this.width = width
    this.height = height
    
    this.background = this.add.image(500, 300, "pitch").setScale(0.55);
    this.leftGoal = this.physics.add.staticGroup({
      key: "leftGoal",
      repeat: 1,
      setXY: { x: 40, y: 270, stepY: 60 },
    });
    this.leftGoal.scaleXY(0.5);
    this.rightGoal = this.physics.add.staticGroup({
      key: "rightGoal",
      repeat: 1,
      setXY: { x: 950, y: 270, stepY: 60 },
    });
    this.rightGoal.scaleXY(0.5);
    this.platformBottom = this.physics.add.staticGroup({
      key: "sokoban",
      repeat: 17,
      frame: 1,
      setXY: { x: 10, y: 10, stepX: 55 },
    });
    this.ball = this.physics.add.sprite(this.ball_x, this.ball_y, 'ball').setCollideWorldBounds(true).setBounce(1,1)
    this.ball.setScale(2)
    this.player = this.physics.add.sprite(width * 0.5 + 400, height * 0.5, 'sokoban').setCollideWorldBounds(true).play('down-idle');
    this.createPlatforms(this.player,this.ball)
    this.isHavingBall = false;
    this.physics.add.collider(this.player, this.ball,this.handleCollectBall, undefined, this)

   

    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
    });
    
    this.physics.add.overlap(
      this.ball,
      this.leftGoal,
      this.handleScoreGoalOpponent,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.ball,
      this.rightGoal,
      this.handleScoreGoalHome,
      undefined,
      this
    );
  }

  update() {
 
    const speed = 200;
    if (!this.room || !this.cursors) { return; }
    this.inputPayload.direction = 'down'
    this.inputPayload.direction = this.cursors.left.isDown? 'left' : this.inputPayload.direction;
    this.inputPayload.direction = this.cursors.right.isDown ? 'right' : this.inputPayload.direction;
    this.inputPayload.direction =this.cursors.up.isDown ? 'up' : this.inputPayload.direction;
    this.inputPayload.direction =this.cursors.down.isDown ? 'down' : this.inputPayload.direction;
    if (!this.cursors?.left.isDown && !this.cursors?.right.isDown && !this.cursors?.up.isDown && !this.cursors?.down.isDown) {
      this.inputPayload.direction = `${this.key}-idle`
      this.player?.setVelocity(0,0)
      this.player?.play(`${this.key}-idle`)
    }
   
    if (this.cursors?.left.isDown) {
      this.key ='left';
      this.player?.setVelocityX(-speed)
      this.player?.play("left-walk", true);

    } else if (this.cursors?.right.isDown) {
      this.key = 'right'
      this.player?.setVelocityX(+speed)
      this.player?.play("right-walk", true);
  
    }
    if (this.cursors?.up.isDown) {
      this.key = 'up';
      this.player?.setVelocityY(-speed)
      this.player?.play("up-walk", true);

    } else if (this.cursors?.down.isDown) {
      this.key = 'down'
      this.player?.setVelocityY(+speed)
      this.player?.play("down-walk", true);
 
    } 
  
    this.inputPayload.x = this.player!.x;
    this.inputPayload.y = this.player!.y;
    this.room.send(0, this.inputPayload);
    this.room?.send(1, {ball_x: this.ball!.x, ball_y: this.ball!.y, clientID: ''})
    
   

      for (let sessionId in this.playerEntities) {
        // interpolate all player entities
        if (sessionId === this.room.sessionId) {
          continue;
        }
        const entity = this.playerEntities[sessionId];
        const { serverX, serverY, direction } = entity.data.values;
    
        if(direction !== 'up' && direction !== 'down' && direction !== 'left' && direction !== 'right') {
          entity.play(`${direction}`, true)
        } else {
          entity.play(`${direction}-walk`, true)
        } 
       
        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
      }
      if (this.ball_clientID !== this.clientID) {
        this.ball!.x = Phaser.Math.Linear(this.ball!.x, this.ball_x, 0.2);
        this.ball!.y = Phaser.Math.Linear(this.ball!.y, this.ball_y, 0.2);

      }
   
      
  
    
    }
    handleCollectBall(player: any, ball: any) {

    if (player && this.room && this.cursors) {

    
      if (this.cursors?.left.isDown) {
        ball.setVelocityX(-200)
      } else if (this.cursors?.right.isDown) {
        ball.setVelocityX(200);
      } else if (this.cursors?.up.isDown) {
        ball.setVelocityY(-200);
      } else if (this.cursors?.down.isDown) {
        ball.setVelocityY(200);
      } 
     

      this.room?.send(1, {ball_x: ball!.x, ball_y: ball!.y, clientID: this.clientID})
    }

   
  }
  private createPlatforms(player: any, ball: any) {
    if (player && ball) {
      console.log('kaka')
      this.platformTopLeft = this.physics.add.staticGroup({
        key: "sokoban",
        repeat: 3,
        frame: 1,
        setXY: { x: 15, y: 25, stepY: 55 },
      });
      this.platformBottomLeft = this.physics.add.staticGroup({
        key: "sokoban",
        repeat: 3,
        frame: 1,
        setXY: { x: 15, y: 410, stepY: 55 },
      });
  
      this.platformBottomRight = this.physics.add.staticGroup({
        key: "sokoban",
        repeat: 3,
        frame: 1,
        setXY: { x: 980, y: 410, stepY: 55 },
      });
      this.platformTopRight = this.physics.add.staticGroup({
        key: "sokoban",
        repeat: 3,
        frame: 1,
        setXY: { x: 980, y: 25, stepY: 55 },
      });
  
      this.platformBottom = this.physics.add.staticGroup({
        key: "sokoban",
        repeat: 17,
        frame: 1,
        setXY: { x: 10, y: 10, stepX: 55 },
      });
      this.platformTop = this.physics.add.staticGroup({
        key: "sokoban",
        repeat: 17,
        frame: 1,
        setXY: { x: 10, y: 590, stepX: 55 },
      });
      this.physics.add.collider(player, this.platformBottom);
      this.physics.add.collider(ball, this.platformBottom);
      this.physics.add.collider(player, this.platformTop);
      this.physics.add.collider(ball, this.platformTop);
      this.physics.add.collider(player, this.platformBottomLeft);
      this.physics.add.collider(ball, this.platformBottomLeft);
      this.physics.add.collider(player, this.platformBottomRight);
      this.physics.add.collider(ball, this.platformBottomRight);
      this.physics.add.collider(player, this.platformTopLeft);
      this.physics.add.collider(ball, this.platformTopLeft);
      this.physics.add.collider(player, this.platformTopRight);
      this.physics.add.collider(ball, this.platformTopRight);
    }
   
   
  }
  private handleScoreGoalOpponent(ball: any, s: any) {
    if (!this.isGoal && ball.x < 40) {
      this.isGoal = true
      this.homeScore += 1;
      this.resetMatch()
    }

    this.scoreText?.setText("Score: " + this.homeScore)
  }
  private handleScoreGoalHome(ball: any, s: any) {
    if (!this.isGoal && ball.x > 950) {
      this.isGoal = true
      this.opponentScore += 1
      this.resetMatch()
    }

    this.scoreText?.setText("Score: " + this.homeScore)
  }
  private resetMatch() {
    this.ball?.setVelocity(0,0)
    this.ball!.setX(this.width * 0.5) 
    this.ball!.setY(this.height * 0.5) 
    this.isGoal = false
  }
}
