// create an array to store the player's cards
let playerCards = [];

// create an array to store the pc's cards
let pcCards = [];

// create an array for the card deck
let deck = [];

// create an array to store the values of the player's cards
let playerCardsValues = [];

// create an array to store the values of the pc's cards
let pcCardsValues = [];

// create a variable to store the total value of the player's cards
let total = 0;

// create a variable to store the total value of the pc's cards
let pcTotal = 0;

// variable to count the current Round
let round = 0;

// create variables to count the number of player and pc wins
let playerWins = 0;
let pcWins = 0;

// create the gambling variables
let bankChips = 0;
let playerChips = 50;
let pcChips = 50;
let playerBet = 0;

// create a function to make the card deck
function createDeck() {
    const CARDS_IN_SUIT = 13;
    const SKIP_KNIGHT_CARD = 12;

    /** @description My original shuffle code using Math.random() - Math.random() was too naive
     * You can read more about the algorithm I use on https://javascript.info/array-methods#shuffle-an-array
     * I did not know this :-) PHP has at least a build in shuffle function. :-P
     * */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];//did you know you can assign multiple variables in 1 line? Don't overuse this!
        }
        return array;
    }

    /** @description
     * Changed the array<string> to an array of objects to contain the start value of the unicode.
     * Very often I find myself changing simple arrays to more complex arrays with object in it to contain multiple data points. */
    let suits = [
        {'code': 127136, 'name': 'spades'},
        {'code': 127152, 'name': 'hearts'},
        {'code': 127168, 'name': 'diamonds'},
        {'code': 127184, 'name': 'clubs'}
    ];

    // let deck = [];

    suits.forEach(function (suit) {
        for (let i = 1; i <= CARDS_IN_SUIT; i++) {
            let points = i;
            let code = suit.code+i;
            /** @description In italian & spanish decks there is a knight card, this card normally appears between jack and queen.
             * We don't need it for Poker, so we are going to skip it by increasing the Unicode by 1 starting from the queen.
             * */
            let value = i;
            if(i >= SKIP_KNIGHT_CARD) {
                code++;
            }
            if(i === 1) {
                value = 14;
            }

            let name = value;
            switch(value) {
                case 14:
                    name = 'Ace';
                    points = 11;
                    break;
                case 13:
                    name = 'King';
                    points = 10;
                    break;
                case 12:
                    name = 'Queen';
                    points = 10;
                    break;
                case 11:
                    name = 'Jack';
                    points = 10;
                    break;
            }

            deck.push({'suit': suit.name, 'value': value, 'points': points, 'fullName': name + " of "+ suit.name, 'code': '&#'+ code +';'});
        }
    });

    //this line renders the entire deck
    //deck.forEach(card => document.getElementById('public-area').innerHTML += renderCard(card));

    return shuffle(deck);
}

/** @description In order to render the cards I am using the unicode code, in combination with a little bit of CSS to color the cards red/black.
 * More info on https://en.wikipedia.org/wiki/Playing_cards_in_Unicode
 *
 * I will always reuse this function to render a card on the board
 * */
function renderCard(card) {
    return '<span class="card '+ card.suit +'">'+ card.code +'</span>';
}

// function to calculate the total of the player's cards
function cardsTotal() {
    total = playerCardsValues.reduce(playerCardsTotal);

    function playerCardsTotal(sum, card) {
        return sum + card;
    }
    return total;
}

// function to calculate the total of the pc's cards
function pcCardsTotal() {
    pcTotal = pcCardsValues.reduce(pcPlayerCardsTotal);

    function pcPlayerCardsTotal(sum, card) {
        return sum + card;
    }
    return pcTotal;
}

// Bank deals 2 cards when Play is clicked
document.querySelector("#play").addEventListener("click", newGame);

// start a new game if player wants to after being busted
function newGame() {
    if (playerChips > 0) {
        clear();

        newRound();

        createDeck();
        console.log(deck);

        placeBet();

        for (let i = 0; i < 2; i++) {
            let card = deck.pop();
            playerCards.push(card);
            pcCards.push(card);
            document.getElementById("common_cards").innerHTML += renderCard(card);
        }

        playerCards.forEach(card => {
            playerCardsValues.push(card.points);
            console.log(playerCardsValues);
        })

        pcCards.forEach(card => {
            pcCardsValues.push(card.points);
            console.log(pcCardsValues);
        })

        cardsTotal();
        console.log(total);
        pcCardsTotal();
        console.log(pcTotal);

        checkBusted();
    } else {
        alert("No more chips!  Please start a new game!");
    }
}

function placeBet() {
    playerBet = Number(prompt("How many chips do you want to bet?"));
    if (0 < playerBet < playerChips) {  
        document.querySelector(".player_bet").innerHTML = `Bet: ${playerBet}`;
        playerChips -= playerBet;
        document.querySelector(".player_chips").innerHTML = `Player: ${playerChips} chips`;
    } else if (playerBet >= playerChips) {
        alert("Your bet has to be smaller than  " + playerChips + " chips!");
        placeBet();
    } else if (playerBet < 0) {
        alert("You cannot place a negative bet!");
        placeBet();
    } else {
        alert("You have to bet at least 1 chip!");
        placeBet();
    }
}

// The function for a new card, and the calculation
function newCard() {
    let new_card = confirm("You have " + total + " in total.\n" +
        "The pc has " + pcTotal + ".\n" +
        "Do you want another card?");
    if (new_card === true) {
        let card = deck.pop();
        document.getElementById("player_cards").innerHTML += renderCard(card);
        playerCards.push(card);
        console.log(playerCards);
        playerCardsValues.push(card.points);
        console.log(playerCardsValues);

        cardsTotal();
        console.log(total);

        pcNewCard();

        checkBusted();
    } else if (pcTotal < 15) {   // LOOK FOR SOLUTION TO LET PC CONTINUE WHILE pcTotal < 15
        pcNewCard();
        checkWinner();
    } else {
        cardsTotal();
        pcCardsTotal();
        checkWinner();
    }
}

function pcNewCard() {
    if (pcTotal < 15) {
        let card = deck.pop();
        document.getElementById("pc_cards").innerHTML += renderCard(card);
        pcCards.push(card);
        console.log(pcCards);
        pcCardsValues.push(card.points);
        console.log(pcCardsValues);

        pcCardsTotal();
        console.log(pcTotal);

        //checkBusted();
    }
}

function checkBusted() {
    if (total > 21 && pcTotal > 21) {
        bankChips += playerBet;
        document.querySelector(".bank_chips").innerHTML = `Bank: ${playerBet} chips`;
        let busted = confirm("BUSTED!!! The bank takes all your money! \n" +
            "Player total is " + total + ". PC total is " + pcTotal + ".\n" +
            "Do you want to play again?");
        if (busted === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
            reset();
            clear();
        }
    } else if (total > 21) {
        pcWins++;
        document.querySelector(".pc_wins").innerHTML = `PC wins: ${pcWins}`;
        pcChips += playerBet;
        document.querySelector(".pc_chips").innerHTML = `PC: ${pcChips} chips`;
        let busted = confirm("Player BUSTED!!! PC wins with a score of " + pcTotal + "!!!" +
            "\nDo you want to play again?");
        if (busted === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
            reset();
            clear();
        }
    } else if (pcTotal > 21) {
        playerWins++;
        document.querySelector(".player_wins").innerHTML = `Player wins: ${playerWins}`;
        playerChips += playerBet * 2;
        document.querySelector(".player_chips").innerHTML = `Player: ${playerChips} chips`;
        let busted = confirm("PC BUSTED!!! Player wins with a score of " + total + "!!!" +
            "\nDo you want to play again?");
        if (busted === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
            reset();
            clear();
        }
    } else {
        newCard();
    }
}

function checkWinner() {
    let replay;
    if (total > pcTotal && total < 22) {
        playerWins++;
        document.querySelector(".player_wins").innerHTML = `Player wins: ${playerWins}`;
        playerChips += playerBet * 2;
        document.querySelector(".player_chips").innerHTML = `Player: ${playerChips} chips`;
        replay = confirm("Player wins with a score of " + total + "!!! PC score is " + pcTotal +
            "\nDo you want to play again?");
        if (replay === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
            reset();
            clear();
        }
    } else if (pcTotal > total && pcTotal < 22) {
        pcWins++;
        document.querySelector(".pc_wins").innerHTML = `PC wins: ${pcWins}`;
        pcChips += playerBet;
        document.querySelector(".pc_chips").innerHTML = `PC: ${pcChips} chips`;
        replay = confirm("PC wins with a score of " + pcTotal + "!!! Player score is " + total +
            "\nDo you want to play again?");
        if (replay === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
            reset();
            clear();
        }
    } else if (total === pcTotal && total < 22) {
        playerChips += playerBet;
        document.querySelector(".player_chips").innerHTML = `Player: ${playerChips} chips`;
        replay = confirm("NO WINNER!!! Player and pc both have a score of " + total + "!!!" +
            "\nDo you want to play again?");
        if (replay === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
            reset();
            clear();
        }
    } else {
        checkBusted();
    }
}

function clear() {
    document.getElementById("common_cards").innerHTML = "";
    document.getElementById("player_cards").innerHTML = "";
    document.getElementById("pc_cards").innerHTML = "";
    playerCards = [];
    pcCards = [];
    deck = [];
    playerCardsValues = [];
    pcCardsValues = [];
    total = 0;
    pcTotal = 0;
    playerBet = 0;
    document.querySelector(".player_bet").innerHTML = `Bet: ${playerBet}`;
}

function newRound() {
    round++;
    console.log(round);
    document.querySelector(".round_counter").innerHTML = `Round: ${round}`;
}

function reset() {
    round = 0;
    playerWins = 0;
    pcWins = 0;
    bankChips = 0;
    playerChips = 50;
    pcChips = 50;
    playerBet = 0;
    document.querySelector(".round_counter").innerHTML = `Round: ${round}`;
    document.querySelector(".player_wins").innerHTML = `Player wins: ${playerWins}`;
    document.querySelector(".pc_wins").innerHTML = `PC wins: ${pcWins}`;
    document.querySelector(".player_bet").innerHTML = `Bet: ${playerBet}`;
    document.querySelector(".player_chips").innerHTML = `Player: ${playerChips} chips`;
    document.querySelector(".pc_chips").innerHTML = `PC: ${pcChips} chips`;
    document.querySelector(".bank_chips").innerHTML = `Bank: ${bankChips} chips`;
}