
import { Button } from "@/components/ui/button";
import { TableDemo } from "../MBcomponents/shadcnComps";
import { Deck, Card } from "@/scripts/cardDeck";
import { Game, GameState, Player } from "@/scripts/gameLogic";

let testCard = new Card("A", "Hearts");
let testHand : Card[] = [new Card("K", "Hearts"), new Card("Q", "Hearts"), new Card("J", "Hearts")]

let gameInstance = new Game();
gameInstance.addPlayer(new Player("Player 1", false, false))

export default function page () {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Blackjack Game</h1>
      <p className="text-lg mb-4">A game of Blackjack built with Next.js and Tailwind CSS.</p>
      <p className="text-md mb-8">Hit the 'Start Game' button to start!</p>

      <ControlPanel gameState={gameInstance.gameState}/>

      <div className="flex flex-col items-center space-y-2 mb-4">
        <CardProp card={testCard} />
        <HandProp cards={testHand}/>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Game Stats (Example Table)</h2>
      <TableDemo />
    </div>
  )
}

export function ControlPanel({gameState}: {gameState: GameState}) {

    console.log(gameState)
    let content;

    switch (gameState) {
        case "init": 
            content = 
                <>
                    <Button className="mb-8">Start Game</Button>
                </>;
            break;

        case "playerTurn":
            content =
                <>
                    <Button className="mb-8">Hit</Button>
                    <Button className="mb-8">Stand</Button>
                </>
            break;
        default:
            content = ''
            console.log('not working')
    }

    return (
        <div className="flex flex-row items-center space-x-4">
            {content}
        </div>
    )
}

export function HandProp({ cards }: { cards: Card[] }) {
  return (
    <div className="flex flex-row -space-x-6">
      {cards.map((card, index) => (
        <CardProp key={index} card={card} />
      ))}
    </div>
  );
}

export function CardProp({ card }: { card: Card }) {
    let suit = card.suit;
    let rank = card.rank;

    const cardColor = (suit === "Hearts" || suit === "Diamonds") ? "text-red-600" : "text-black";

  return (
    <div className={`relative flex flex-col items-center justify-center w-20 h-28 border border-gray-400 rounded-md shadow-md bg-white ${cardColor}`}>
      <div className="absolute top-1 left-1 text-xl font-bold">{rank}</div>
      <div className="text-4xl">{getSuitSymbol(suit)}</div>
    </div>
  );
}

function getSuitSymbol(suit: string) {
  switch (suit) {
    case "Hearts":
      return "♥";
    case "Diamonds":
      return "♦";
    case "Clubs":
      return "♣";
    case "Spades":
      return "♠";
    default:
      return "";
  }
}
