import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate () {
    this.setState(new MyRoomState());

    this.onMessage(0, (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (data!.isCollide) return; 
      player!.direction = data.direction;
      player!.x = data.x;
      player!.y = data.y;
    });
    this.onMessage(1, (client, data) => {
      console.log(client)
      const ball = this.state.ball;
      ball!.x = data.ball_x;
      ball!.y = data.ball_y;
      ball!.clientID = data.clientID !== '' ? data.clientID : ball!.clientID
    })
    this.onMessage(3, () => {
      this.state!.reset = 1 - this.state!.reset;
  
    })
  }

  onJoin (client: Client) {
    

    const mapWidth = 1000;
    const mapHeight = 600;

    const player = new Player();
 
   

    player.x = (Math.random() * mapWidth);
    player.y = (Math.random() * mapHeight);
  

    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client) {
    console.log(client.sessionId, "left!");

    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
