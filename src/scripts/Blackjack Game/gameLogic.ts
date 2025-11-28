"use client"

import { Deck, Card } from "./cardDeck";

type winState = 'won' | 'lost' | 'drew' | 'null';
export type GameState = 'init' | 'playerTurn' | 'gameEnd';

export class Player {

    public hand: Card[] = [];
    public score: number = 0;
    public isBust: boolean = false;
    public isBlackjack: boolean = false;
    private winState: winState = 'null';

    public handsWon: number = 0;
    public handsLost: number = 0;
    public handsDrawn: number = 0;

    constructor(public readonly name: string, public readonly isDealer: boolean = false, public readonly isCPU: boolean = true) {
    
    }

    resetHand(): void {
        this.hand = [];
        this.score = 0;
        this.isBust = false;
        this.isBlackjack = false;
        this.winState = 'null';
    }

    drawCards(deck: Deck, numCards: number): void {

        //draw cards from the deck and log them
        let dealtCards = deck.dealCards(numCards);
        
        //Add the cards to the player's hand and check their new score
        this.hand = this.hand.concat(dealtCards);

        //Update the player's score and log if bust or blackjack
        this.checkScore();

    }

    //Calculate the player's hand score
    private checkScore(): void {

        if(this.isBlackjack || this.isBust) {
            return;
        }

        //Reset score to recalculate
        this.score = 0;

        let aceCount = 0;

        for (let i = 0; i < this.hand.length; i++) {

            //Count aces and add score for other cards
            if (this.hand[i].rank === 'A') {
                aceCount++;
            }
            else {
                this.score += this.hand[i].getCardValue();
            }
        }


        //Logic to deal with aces (if any are held)
        if(aceCount > 0) {

            //If theres room for one ace as '11' and all the rest as '1'
            if (11 + aceCount-1 + this.score <= 21) {
                this.score += 11;
                aceCount--;
            }
            //Count all other aces as '1's
            this.score += aceCount;           
        }

        //Check for bust and blackjack once score is set
        if (this.score > 21) {
            this.isBust = true;
        }
        else if (this.score === 21) {
            this.isBlackjack = true;
        }
    }

    public setWinState(state: winState): void {
        
        this.winState = state;

        if(state === 'won') {
            this.handsWon++;
        }
        else if (state === 'lost') {
            this.handsLost++;
        }
        else if (state === 'drew') {
            this.handsDrawn++;
        }
    }

    public getWinState(): winState {
        return this.winState;
    }  
}

export class Game {

    public players: Player[] = [];
    public dealer: Player = new Player('Dealer', true);
    public gameState: GameState = 'init';

    public deck: Deck = new Deck();
    public roundNumber: number = 0;

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    resetGame(hardReset: boolean = false): void {
        this.players.forEach(player => player.resetHand());
        this.dealer.resetHand();
        this.deck = new Deck();
        this.deck.shuffle();
        this.gameState = 'init';

        if(hardReset) {
            this.roundNumber = 0;
            this.players.forEach(player => player.handsWon = 0);
        }
    }

    public hitPlayer(player: Player): void {

        //Technically shouldn't be possible due to button disable but check anyway
        if (player.isBust || player.isBlackjack) {
            return;
        }

        player.drawCards(this.deck,1);

    }

    public standPlayer(player: Player): void {

        this.gameState = 'gameEnd';
        this.dealersTurn();
        this.calculateWinners();
    }

    private dealersTurn(): void {

        while (this.dealer.score < 17) {
            this.dealer.drawCards(this.deck, 1);
        }
    }

    private calculateWinners(): void {

        //When dealer is blackjack
        if (this.dealer.isBlackjack) {
           this.players.forEach(player => {
                if (player.isBlackjack) {
                    player.setWinState('drew');
                }
                else {
                    player.setWinState('lost');
                }
           });
        }
        //when dealer is bust
        else if (this.dealer.isBust) {
            this.players.forEach(player => {
                if (!player.isBust) {
                    player.setWinState('won');
                }
                else {
                    player.setWinState('lost');
                }
            });
        }

        //when dealer is neither blackjack or bust
        else {
            this.players.forEach(player => {
                if (player.isBlackjack) {
                    player.setWinState('won');
                }
                else if (player.isBust) {
                    player.setWinState('lost');
                }
                else if (player.score === this.dealer.score) {
                    player.setWinState('drew');
                }
                else if (player.score > this.dealer.score) {
                    player.setWinState('won');
                }
                else {
                    player.setWinState('lost');
                }
            })
        }

    }
    
}