import Phaser from "phaser";
import Preloader from "../../scenes/Preloader";
import Game from "../../scenes/Game";
import GamePlay from "../../components/game/game-play";
import 'regenerator-runtime'

const Room = () => {
  const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    scale: {
      // Except this should match the ID of your component host element.
      parent: "room-page-wrapper",
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

  return (
    <div id="room-page" className="room-page p-10">
        <div id="room-page-wrapper" className="room-page-wrapepr">
          <GamePlay config={config} />
        </div>
        
    </div>
  )
}

export default Room
