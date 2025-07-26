"use client"

import React, { useState } from 'react';
import { Card } from "@/scripts/cardDeck";
import { Game, GameState, Player } from "@/scripts/gameLogic";
import { PlayerProp} from "../components/ui/blackjackComponents";
import Button from '@mui/material/Button';

import { motion } from "motion/react"
import { ClassNames } from '@emotion/react';

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
    game.resetGame(true);
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
  }

  //HTML Output
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-y-2">
      <h1 className="text-4xl font-bold">React Blackjack</h1>
      <p className="text-lg mb-4">A game of Blackjack built with Next.js, React, and Tailwind CSS.</p>

      {game.gameState === "init" && <Button variant='contained' onClick={handleStartGame} className="mb-8">Start Game</Button>}

      {game.gameState !== "init" && <h3 className='font-bold underline'>Round {game.roundNumber}</h3>}  

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

      {message()}

      <div className="flex flex-row items-center justify-center gap-x-4">
        {game.gameState === "playerTurn" && (
            <>
                {mainPlayer.isBust || mainPlayer.isBlackjack ? 
                <Button variant='contained' disabled>Hit</Button> :
                <Button variant='contained' onClick={handleHitPlayer} className="mb-8">Hit</Button>
                }
                <Button variant='contained'onClick={handleStandPlayer} className="mb-8">Stand</Button>
            </>
        )}
        {game.gameState === "gameEnd" && (
          <div className='flex flex-col items-center justify-center gap-y-2'>
          <p className='italic text-mb'>Rounds Won: {mainPlayer.handsWon}/{game.roundNumber}</p>          
          <Button variant='contained' onClick={handleStartGame} className="">Play Again</Button>
          </div>
        )}

      </div>

      {game.gameState !== "init" && <Button onClick={handleResetGame} className="">Reset</Button>}


    </div>
  )

  function message() {

    function formMessage(msg : string, css: string = "text-mb italic") {

      return <p className={css}>{msg}</p>

    }

    switch(game.gameState) {

      case "init":
        return formMessage("");
 
      case "playerTurn":

        if(mainPlayer.isBlackjack) {
          return formMessage("Blackjack! Well done!", "text-mb italic font-bold")
        }
        else if (mainPlayer.isBust) {
          return formMessage("Bust! Too bad.", "text-mb italic font-bold")
        }
        else {
          return formMessage("Your Turn! Hit or Stand?")
        }
        
      default:
        let winState = mainPlayer.getWinState().toUpperCase();
        return formMessage(mainPlayer.name + ' ' + winState as string + '!', "text-mb italic font-bold")

    }

  }

}






