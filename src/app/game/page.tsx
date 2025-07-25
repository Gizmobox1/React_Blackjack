
"use client"
import React, { useState } from 'react';
import { TableDemo } from "../MBcomponents/shadcnComps";
import { Game, GameState, Player } from "@/scripts/gameLogic";
import { ControlPanel, HandProp} from "../MBcomponents/blackjackComponents";
import { Button } from '@/components/ui/button';


//let testCard = new Card("A", "Hearts");
//let testHand : Card[] = [new Card("K", "Hearts"), new Card("Q", "Hearts"), new Card("J", "Hearts")]

let gameInstance = new Game();
gameInstance.addPlayer(new Player("Player 1", false, false))


export default function page () {
  const [game, setGame] = useState<Game>(gameInstance);
  const [gameState, setGameState] = useState<GameState>(game.gameState);

  function handleStartGame () {
    game.startRound();
    setGameState(game.gameState);
  }

  function handleResetGame() {
    game.resetGame();
    setGameState(game.gameState);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Blackjack Game</h1>
      <p className="text-lg mb-4">A game of Blackjack built with Next.js and Tailwind CSS.</p>
      <p className="text-md mb-8">Hit the 'Start Game' button to start!</p>

{/*       <ControlPanel gameState={gameState} onStartGame={handleStartGame} /> */}

      {game.gameState === "init" && <Button onClick={handleStartGame} className="mb-8">Start Game</Button>}
      {game.gameState !== "init" && <Button onClick={handleResetGame} className="mb-8">Reset Game</Button>}

      <div className="flex flex-row items-center justify-center space-x-8">

        {game.dealer.hand.length > 0 && (
            <HandProp player={game.dealer} />
        )}

        {game.players.map((player, index) => (
            <div key={index}>
                {player.hand.length > 0 && (<HandProp player={player}/>)}
            </div>
        ))}

      </div>

    </div>
  )
}
