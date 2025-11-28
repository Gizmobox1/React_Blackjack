"use client"

import { Card } from "@/scripts/Blackjack Game/cardDeck";
import { Player } from "@/scripts/Blackjack Game/gameLogic";
import { motion } from "motion/react"

export function PlayerProp({player} : {player: Player}) {

  const cardAnimVariants ={
    initial: { opacity: 0, scale: 2, x: 100 },
    animate: { opacity: 1, scale: 1, x: 0,},
  }

  const handAnimVariants ={
    animate: { transition: { staggerChildren: 0.2 } }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
        <h2 className="text-xl font-semibold">{player.name}</h2>
      
        <motion.div
          className="flex flex-row -space-x-6"
          variants={handAnimVariants}
        >
          {player.hand.map((card, index) => (
            <motion.div
              key={index}
              variants={cardAnimVariants}
              transition={{
                duration: 0.4,
                scale: { type: "tween", visualDuration: 0.4 }
              }}
            >
              <CardProp card={card} />
            </motion.div>
          ))}
        </motion.div>

        <h3>({player.score}) {player.isBlackjack ? "- Blackjack!" : " "}{player.isBust ? "- Bust!" : " "}</h3>
    </div>
  );
}

export function CardProp({ card }: { card: Card }) {
    let suit = card.suit;
    let rank = card.rank;

    const cardColor = (suit === "Hearts" || suit === "Diamonds") ? "text-red-600" : "text-black";

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-20 h-28 border border-gray-400 rounded-md shadow-md bg-white ${cardColor}`}>
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
