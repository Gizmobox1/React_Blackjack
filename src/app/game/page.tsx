
import { Button } from "@/components/ui/button";
import { TableDemo } from "../MBcomponents/shadcnComps";

export default function page () {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Game Page!</h1>
      <p className="text-lg mb-4">This is a placeholder for your game content.</p>
      <p className="text-md mb-8">Feel free to add interactive elements, game logic, or anything else you need here.</p>
      <Button className="mb-8">Start Game</Button>
      <Card suit="Hearts" rank="A"></Card>
      <h2 className="text-2xl font-semibold mb-4">Game Stats (Example Table)</h2>
      <TableDemo />
    </div>
  )
}

interface CardProps {
  suit: string;
  rank: string;
}

export function Card({ suit, rank }: CardProps) {
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
