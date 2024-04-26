import { useCallback, useEffect, useRef, useState } from "react";
import { IRefPhaserGame, PhaserGame } from "../../game/PhaserGame";
import { MainMenu } from "../../game/scenes/MainMenu";
import * as Colyseus from  'colyseus.js'

const RoomPlay = () => {

    const client = new Colyseus.Client('http://localhost:2567')
    const room =  client?.join("my_room");
  
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);
    const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

    const changeScene = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;

            if (scene) {
                scene.changeScene();
            }
        }
    };

    const moveSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;

            if (scene && scene.scene.key === "MainMenu") {
                // Get the update logo position
                scene.moveLogo(({ x, y }) => {
                    setSpritePosition({ x, y });
                });
            }
        }
    };

    const addSprite = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene;

            if (scene) {
                // Add more stars
                const x = Phaser.Math.Between(64, scene.scale.width - 64);
                const y = Phaser.Math.Between(64, scene.scale.height - 64);

                //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
                const star = scene.add.sprite(x, y, "star");

                //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
                //  You could, of course, do this from within the Phaser Scene code, but this is just an example
                //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
                scene.add.tween({
                    targets: star,
                    duration: 500 + Math.random() * 1000,
                    alpha: 0,
                    yoyo: true,
                    repeat: -1,
                });
            }
        }
    };
    const currentScene = (scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    };
    const getRoom = useCallback(async () => {
        const room =  await client?.join("my_room");
        set
    }, [])
    useEffect(() => {
        console.log(room.state)
    }, [getRoom])
    return (
        <div id="room-play" className="">
            <div className="m-8 p-8 flex flex-row">
                <div className="mr-auto">
                    <p className="text-2xl">1</p>
                </div>
                <div>
                    <p className="text-2xl">2</p>
                </div>
            </div>
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
        </div>
    );
};

export default RoomPlay;