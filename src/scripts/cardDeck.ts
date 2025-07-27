"use client"

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

type Rank = typeof ranks[number];
type Suit = typeof suits[number];

export class Card {

     orderNum: number;

    constructor(public readonly rank: Rank, public readonly suit: Suit) {
        this.orderNum = this.getOrderNum();
    }

    toString(): string {
        return `${this.rank} of ${this.suit}`;
    }

    getOrderNum(): number {

        const rankIndex = ranks.indexOf(this.rank);
        const suitIndex = suits.indexOf(this.suit);

        return suitIndex * ranks.length + rankIndex;
    }

    getCardValue(): number {

        const faceCards = ['J', 'Q', 'K'];

        if(faceCards.includes(this.rank)) {
            return 10;
        }
        else if (this.rank === 'A') {
            return 11;
        }
        else {
            return parseInt(this.rank);
        }
    }

}

export class Deck {

    private cards: Card[] = [];

    constructor() {
        this.initializeDeck();
    }

    private initializeDeck(): void {
        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push(new Card(rank, suit));
            }
        }
    }

    //Fisher-Yates shuffle of the deck (repeatedly swaps cards in deck)
    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCards(num : number): Card [] {

        let dealtCards: Card[] = [];

        for (let i = 0; i < num; i++) {

            if (this.cards.length === 0) {
                throw new Error("Cannot deal from an empty deck.");
            }
            dealtCards.push(this.cards.pop()!);
        }

        return dealtCards;
    }

}
