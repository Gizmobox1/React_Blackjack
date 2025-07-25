
"use client"
import React, { useState } from 'react';
import { TableDemo } from "../MBcomponents/shadcnComps";
import { Card } from "@/scripts/cardDeck";
import { Game, GameState, Player } from "@/scripts/gameLogic";
import { ControlPanel, PlayerProp, HandProp} from "../MBcomponents/blackjackComponents";
import { Button } from '@/components/ui/button';


//let testCard = new Card("A", "Hearts");
//let testHand : Card[] = [new Card("K", "Hearts"), new Card("Q", "Hearts"), new Card("J", "Hearts")]



export default function page () {

  const [game, setGame] = useState<Game>(() => {
    const gameInstance = new Game();
    const thePlayer = new Player("You", false, false);
    gameInstance.addPlayer(thePlayer);
    return gameInstance;
  });

  // Helper to get the main player reference from game state
  const mainPlayer = game.players[0];

  const [gameState, setGameState] = useState<GameState>(game.gameState);
  const [playerHand, setPlayerHand] = useState<Card[]>(mainPlayer.hand);
  const [dealerHand, setDealerHand] = useState<Card[]>(game.dealer.hand);

  function handleStartGame () {
    game.startRound();
    setGameState(game.gameState);
    setPlayerHand(mainPlayer.hand);
  }

  function handleResetGame() {
    game.resetGame();
    setGameState(game.gameState);
    setPlayerHand(mainPlayer.hand);
  }

  function handleHitPlayer() {
    game.hitPlayer(mainPlayer);
    setPlayerHand(mainPlayer.hand);
  }

  function handleStandPlayer() {
    game.standPlayer(mainPlayer);
    setGameState(game.gameState);
    setPlayerHand(mainPlayer.hand);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Blackjack Game</h1>
      <p className="text-lg mb-4">A game of Blackjack built with Next.js and Tailwind CSS.</p>
      <p className="text-md mb-8">Hit the 'Start Game' button to start!</p>

      {game.gameState === "init" && <Button onClick={handleStartGame} className="mb-8">Start Game</Button>}
      {game.gameState !== "init" && <Button onClick={handleResetGame} className="mb-8">Reset Game</Button>}

      <div className="flex flex-row items-center justify-center space-x-8">
        {game.dealer.hand.length > 0 && (
            <PlayerProp player={game.dealer} />
        )}

        {game.players.map((player, index) => (
            <div key={index}>
                {player.hand.length > 0 && (<PlayerProp player={player}/>)}
            </div>
        ))}
      </div>

      <div className="flex flex-row items-center justify-center space-x-8 py-4">
        {game.gameState === "playerTurn" && (
            <>
                <Button onClick={handleHitPlayer} className="mb-8">Hit</Button>
                <Button onClick={handleStandPlayer} className="mb-8">Stand</Button>
            </>
        )}
      </div>

    </div>
  )
}
