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

    // there are 4 suits in a deck
    let suits = ["spades", "hearts", "diamonds", "clubs"];

// fill the deck array with 13 cards of each suit
    suits.forEach(suit => {
        for (let i = 1; i <= 13; i++) {
            deck.push({"suit": suit, "value": i, "fullName": i + " of " + suit});
        }
    })

// shuffle the deck
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    return shuffle(deck);
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
        document.getElementById("player_cards").innerHTML += card.fullName + "<br>";
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
        document.getElementById("common_cards").innerHTML += card.fullName + "<br>";
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
        document.getElementById("pc_cards").innerHTML += card.fullName + "<br>";
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