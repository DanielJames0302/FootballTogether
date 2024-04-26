import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") direction: string = 'down';
  @type("number") teamNumber: number = 0;
  constructor () {
    super()
  }

}
export class Ball extends Schema {
  @type("number") x: number = 500;
  @type("number") y: number = 300;
  @type("number") velocityX: number = 0;
  @type("number") velocityY: number = 0;
  @type("string") clientID: string = "";

  constructor() {
    super()
    this.velocityX = 0;
    this.velocityY = 0;
  }
}


export class MyRoomState extends Schema {

  @type({ map: Player }) players = new MapSchema<Player>();
  @type(Ball) ball: Ball = new Ball()
  @type("number") reset = 0;
  constructor() {
    super()
    this.reset = 0;
  }


}
