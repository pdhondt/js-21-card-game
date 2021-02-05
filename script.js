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
            [array[i], array[j]] = [array[j], array[i]];//did you know you can assign multple variables in 1 line? Don't overuse this!
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
                    break;
                case 13:
                    name = 'King';
                    break;
                case 12:
                    name = 'Queen';
                    break;
                case 11:
                    name = 'Jack';
                    break;
            }

            deck.push({'suit': suit.name, 'value': value, 'fullName': name + " of "+ suit.name, 'code': '&#'+ code +';'});
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

// Bank deals 2 cards when Play is clicked
document.querySelector("#play").addEventListener("click", newGame);

// The function for a new card, and the calculation
function newCard() {
    let new_card = confirm("You have " + total + " in total.\n" +
        "The pc has " + pcTotal + ".\n" +
        "Do you want another card?");
    if (new_card === true) {
        pcNewCard();
        let card = deck.pop();
        document.getElementById("player_cards").innerHTML += renderCard(card);
        playerCards.push(card);
        console.log(playerCards);
        playerCardsValues.push(card.value);
        console.log(playerCardsValues);

        cardsTotal();
        console.log(total);

        checkBusted();
    } else if (pcTotal < 15) {
        pcNewCard();
    } else {
        cardsTotal();
        pcCardsTotal();
        checkWinner();
    }
}

// start a new game if player wants to after being busted
function newGame() {
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

    createDeck();
    console.log(deck);

    for (let i = 0; i < 2; i++) {
        let card = deck.pop();
        playerCards.push(card);
        pcCards.push(card);
        document.getElementById("common_cards").innerHTML += renderCard(card);
    }

    playerCards.forEach(card => {
        playerCardsValues.push(card.value);
        console.log(playerCardsValues);
    })

    pcCards.forEach(card => {
        pcCardsValues.push(card.value);
        console.log(pcCardsValues);
    })

    cardsTotal();
    console.log(total);
    pcCardsTotal();
    console.log(pcTotal);

    checkBusted();
}

function checkBusted() {
    if (total > 21 && pcTotal > 21) {
        let busted = confirm("BUSTED!!! Player total is " + total + ".\n" +
            "PC total is " + pcTotal + ".\n" +
            "Do you want to play again?");
        if (busted === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
        }
    } else if (total > 21) {
        let busted = confirm("Player BUSTED!!! PC wins with a score of " + pcTotal + "!!!" +
            "\nDo you want to play again?");
        if (busted === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
        }
    } else if (pcTotal > 21) {
        let busted = confirm("PC BUSTED!!! Player wins with a score of " + total + "!!!" +
            "\nDo you want to play again?");
        if (busted === true) {
            newGame();
        } else {
            alert("Thank you for playing!  Come back soon!");
        }
    } else {
        newCard();
    }
}

function pcNewCard() {
    if (pcTotal < 15) {
        let card = deck.pop();
        document.getElementById("pc_cards").innerHTML += renderCard(card);
        pcCards.push(card);
        console.log(pcCards);
        pcCardsValues.push(card.value);
        console.log(pcCardsValues);

        pcCardsTotal();
        console.log(pcTotal);

        checkBusted();
    }
}

function checkWinner() {
    let replay;
    if (total > pcTotal) {
        replay = confirm("Player wins with a score of " + total + "!!! PC score is " + pcTotal +
            "\nDo you want to play again?");
    } else if (pcTotal > total) {
        replay = confirm("PC wins with a score of " + pcTotal + "!!! Player score is " + total +
            "\nDo you want to play again?");
    } else {
        replay = confirm("NO WINNER!!! Player and pc both have a score of " + total + "!!!" +
            "\nDo you want to play again?");
    }
    if (replay === true) {
        newGame();
    } else {
        alert("Thank you for playing!  Come back soon!");
    }
}