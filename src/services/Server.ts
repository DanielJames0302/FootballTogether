import { Client } from "colyseus.js";

export default class Server {
  private client: Client;

  constructor() {
    this.client = new Client(' http://localhost:2567')
  }
  async join() {
     const room = await this.client?.joinOrCreate("my_room");
     console.log(room)
  }
}