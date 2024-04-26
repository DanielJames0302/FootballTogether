import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import GameMatch from './scenes/GameMatch'
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader'
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    scale: {
      // Except this should match the ID of your component host element.
      parent: "game-container",
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: {x: 0, y: 0 },
        debug: false,
      },
    },
  
    scene: [
        Preloader,
        MainMenu,
        GameMatch
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
