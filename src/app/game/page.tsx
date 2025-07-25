
"use client"
import React, { useState } from 'react';
import { TableDemo } from "../MBcomponents/shadcnComps";
import { Card } from "@/scripts/cardDeck";
import { Game, GameState, Player } from "@/scripts/gameLogic";
import { PlayerProp, HandProp} from "../MBcomponents/blackjackComponents";
import Button from '@mui/material/Button';


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
      <h1 className="text-4xl font-bold mb-8">Blackjack Game</h1>
      <p className="text-lg mb-4">A game of Blackjack built with Next.js and Tailwind CSS.</p>

      {game.gameState === "init" && <Button variant='contained' onClick={handleStartGame} className="mb-8">Start Game</Button>}

      {game.gameState !== "init" && <h3 className='font-bold underline'>Round {game.roundNumber}</h3>}  
      {message()}

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

      <div className="flex items-center justify-center mt-2 gap-x-4">
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
          <Button variant='contained' onClick={handleStartGame} className="mb-8">Play Again</Button>
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
        //return <p className="text-mb italic">Hit the 'Start Game' button to start!</p>
        return formMessage("Hit the 'Start Game' button to start!");
 
      case "playerTurn":
        return formMessage("Your Turn! Hit or Stand?")
        
      default:
        let winState = mainPlayer.getWinState().toUpperCase();
        return formMessage(mainPlayer.name + ' ' + winState as string + '!', "text-mb italic font-bold")

    }

  }

}
