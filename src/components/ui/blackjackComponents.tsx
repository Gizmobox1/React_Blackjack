
import { Card } from "@/scripts/cardDeck";
import { Player } from "@/scripts/gameLogic";

export function PlayerProp({player} : {player: Player}) {

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
        <h2 className="text-xl font-semibold">{player.name}</h2>
        <div className="flex flex-row -space-x-6">
            {player.hand.map((card, index) => (
                <CardProp key={index} card={card} />
            ))}
        </div>
        <h3>({player.score}) {player.isBlackjack ? "- Blackjack!" : " "}{player.isBust ? "- Bust!" : " "}</h3>
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
