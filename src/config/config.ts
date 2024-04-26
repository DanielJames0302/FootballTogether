import Phaser from "phaser";
import Preloader from "../scenes/Preloader";
import Game from "../scenes/Game";

export const config = {
  type: Phaser.AUTO,
  parent: 'home-page',
  width: 500,
  height: 500,
  scale: {
    // Except this should match the ID of your component host element.
    parent: "home-page",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },

  scene: [Preloader, Game],
};