import React, { useEffect } from 'react'
import Phaser from 'phaser';


const GamePlay:React.FC<{config:any}> = ({config}) => {
  useEffect(() => {
    const game = new Phaser.Game(config);
    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <div className='m-10'>
      
    </div>
  )
}

export default GamePlay
