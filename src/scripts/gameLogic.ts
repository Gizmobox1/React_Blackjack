import { error } from "console";
import { Deck, Card } from "./cardDeck";
//const prompt = require("prompt-sync")();

type winState = 'won' | 'lost' | 'drew' | 'null';
export type GameState = 'init' | 'playerTurn' | 'gameEnd';

export class Player {

    public hand: Card[] = [];
    public score: number = 0;
    public isBust: boolean = false;
    public isBlackjack: boolean = false;
    private winState: winState = 'null';

    public handsWon: number = 0;

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

        dealtCards.forEach(card => {
            console.log(this.name + ' drew a ' + card.toString());
        });
        
        //Add the cards to the player's hand and check their new score
        this.hand = this.hand.concat(dealtCards);

        //Update the player's score and log if bust or blackjack
        this.checkScore();

        if (this.isBust) {
            console.log(this.name + ' is bust!');
        }

        if (this.isBlackjack) {
            console.log(this.name + ' is blackjack!');
        }

    }

    //Calculate the player's hand score
    //TO DO: Write Unit Test
    private checkScore(): void {

        if(this.isBlackjack || this.isBust) {
            return;
        }

        //Reset score to recalculate
        this.score = 0;

        let aceCount = 0;

        for (let i = 0; i < this.hand.length; i++) {

            //Count aces and add score for other cards
            if (this.hand[i].rank === 'Ace') {
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
                this.score += 11 + aceCount-1;
            }
            //Otherwise count all aces as '1's
            else {
                this.score += aceCount;
            }         
        }

        //Check for bust and blackjack once score is set
        if (this.score > 21) {
            this.isBust = true;
        }
        else if (this.score === 21) {
            this.isBlackjack = true;
        }

        console.log('   = ' + this.score + ' (' + this.name + ')')
    }

    public setWinState(state: winState): void {
        
        this.winState = state;

        if(state === 'won') {
            this.handsWon++;
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

    constructor() {
    }

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    resetGame(): void {
        this.players.forEach(player => player.resetHand());
        this.dealer.resetHand();
        this.deck = new Deck();
        this.deck.shuffle();
        this.gameState = 'init';
    }

    roundScoreboard(): void {
        console.log('--- ROUND ' + this.roundNumber + ' SCORES ---')
        console.log('Dealer: ' + this.dealer.score);
        this.players.forEach(player => console.log(player.name + ': ' + player.score + ' (' + player.getWinState() + ')'));
    }

    gameScoreboard(): void {
    
        console.log('--- GAME SCORES ---')
        this.players.forEach(player => console.log(player.name + ' has won ' + player.handsWon + ' hands.'))
        console.log('----------');
    
    }

    public startRound(): void {


        this.resetGame();
        this.roundNumber++;

        //Round starts by dealing two cards to each player and dealer
        this.players.forEach(player => player.drawCards(this.deck,2));
        this.dealer.drawCards(this.deck,2);

        this.gameState = 'playerTurn';
    }

    public playRound(): void {
        
        this.resetGame();
        this.roundNumber++;

        console.log('----------');
        console.log('**Round ' + this.roundNumber + '**');

        //Round starts by dealing two cards to each player and dealer
        console.log('--- INITIAL DRAW ---');
        this.players.forEach(player => player.drawCards(this.deck,2));
        this.dealer.drawCards(this.deck,2);

        //Players' turns
        console.log('--- PLAYER TURNS ---');
        this.players.forEach(player =>{
            this.playerTurn(player);
            //Only add spacer if it's not the last player
            if(!(this.players.findIndex(p => p === player)+1 === this.players.length)) {
                console.log('--');
            }
        })

        //Dealer's Turn
        console.log("--- DEALER'S TURN ---");
        this.dealersTurn();

        this.calculateWinners();
        this.roundScoreboard();

        console.log('----------');

    }

    private playerTurn(player: Player): void {

        if(player.isCPU) {
            while(player.score < 17){
                player.drawCards(this.deck,1);
            }
            if (!player.isBust && !player.isBlackjack) {
                console.log(player.name + ' Stands on ' + player.score + '.');
            }      
        }

        else {

            let continueTurn = true;

            console.log('Your turn (' + player.name + ')' + ' - ' + player.score + '.')

            while (continueTurn) {

                //Ask player to hit or stand
                if (prompt('Hit (y) or Stand?: ') === 'y') {
                    player.drawCards(this.deck, 1);
                }
                else {
                    continueTurn = false;
                }

                //If player is bust or has blackjack auto-end their turn.
                if(player.isBust || player.isBlackjack) {
                    continueTurn = false;
                }

            }

            //Log 'stands' if turn ends without bust or blackjack.
            if (!player.isBust && !player.isBlackjack) {
                console.log(player.name + ' stands on ' + player.score + '.');
            }
        }      
    }

    private dealersTurn(): void {

        //In case dealer gets blackjack on the first cards (note bust is not possible)
        if (this.dealer.isBlackjack) {
            console.log('Dealer is blackjack!')
            return;
        }

        while (this.dealer.score < 17) {
            this.dealer.drawCards(this.deck, 1);
        }
        if (!this.dealer.isBust && !this.dealer.isBlackjack) {
            console.log('Dealer Stands on ' + this.dealer.score + '.')
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