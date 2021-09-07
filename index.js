"use strict";

const screenWord = document.querySelector("#word");
const difficulty = document.querySelector("#difficulty");
const nameScreen = document.querySelector("#nameScreen");
const gameScreen = document.querySelector("#gameScreen");
const difficultyForm = document.querySelector("#difficultyForm");
const gameForm = document.querySelector("#gameForm");
const gameInput = document.querySelector("#gameInput");
const gameInputLabel = document.querySelector("#gameInputLabel");
const scoreboardDiv = document.querySelector('#scoreboardDiv');
const resetButton = document.querySelector('#resetButton');
const guessButton = document.querySelector("#guessButton");
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let guessWord = "";
let playerWord = "";
let playerGuesses = [];


class Hangman {
    round;

    constructor() {
        this.round = 0;
        ctx.strokeStyle = "#fff";
        ctx.fillStyle = "#fff";
        ctx.lineWidth = 3;
        this.drawPole();
    }

    reset() {
        this.round = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawPole();
    }

    //Drawing functions
    drawPole() {
        ctx.beginPath();
        ctx.moveTo(50, 250);
        ctx.lineTo(200, 250);
        ctx.stroke();
        ctx.moveTo(125, 250);
        ctx.lineTo(125, 50);
        ctx.stroke();
        ctx.moveTo(75, 50);
        ctx.lineTo(350, 50);
        ctx.lineTo(350, 75);
        ctx.stroke();
    }
    drawHead() {
        ctx.beginPath();
        ctx.arc(350, 100, 25, 0, 2 * Math.PI, true);
        ctx.fill();
    }
    drawTorso() {
        ctx.beginPath();
        ctx.moveTo(350, 125);
        ctx.lineTo(350, 190);
        ctx.stroke();
    }
    drawLeftLeg() {
        ctx.beginPath();
        ctx.moveTo(350, 190);
        ctx.lineTo(325, 215);
        ctx.stroke();
    }
    drawRightLeg() {
        ctx.beginPath();
        ctx.moveTo(350, 190);
        ctx.lineTo(375, 215);
        ctx.stroke();
    }
    drawLeftArm() {
        ctx.beginPath();
        ctx.moveTo(350, 145);
        ctx.lineTo(325, 155);
        ctx.stroke();
    }

    drawRightArm() {
        ctx.beginPath();
        ctx.moveTo(350, 145);
        ctx.lineTo(375, 155);
        ctx.stroke();
    }
    draw() {
        if (this.round >= 1) {
            this.drawHead();
        }
        if (this.round >= 2) {
            this.drawTorso();
        }
        if (this.round >= 3) {
            this.drawLeftArm();
        }
        if (this.round >= 4) {
            this.drawRightArm();
        }
        if (this.round >= 5) {
            this.drawLeftLeg();
        }
        if (this.round >= 6) {
            this.drawRightLeg();
        }
    }
}

function main() {
    //Initial screen form event listener
    difficultyForm.addEventListener("submit", function (event) {
        let wordsPool = []
        if (difficulty.value === "Short") {
            wordsPool = words.filter(word => word.length < 6)
        }
        if (difficulty.value === "Medium") {
            wordsPool = words.filter(word => word.length >= 6 && word.length < 10)
        }
        if (difficulty.value === "Long") {
            wordsPool = words.filter(word => word.length >= 10)
        }

        guessWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];

        guessWord = guessWord.toUpperCase();
        guessWord = guessWord.split("");
        playerWord = guessWord.map(x => x);


        nameScreen.classList.add("notActive");
        gameScreen.classList.remove("notActive");

        //Hiding the result from the player
        playerWord.forEach((element, i) => playerWord[i] = "_");
        screenWord.innerHTML = playerWord.join("");
        gameInput.focus();
    });

    //Creating the game object
    const hangman = new Hangman();

    //Game event listener
    gameForm.addEventListener("submit", function (event) {
        event.preventDefault;

        playerGuesses.push(gameInput.value);
        playerGuesses.forEach((element, i) => playerGuesses[i] = playerGuesses[i].toUpperCase());

        //Check if it is a character
        if (playerGuesses[playerGuesses.length - 1].length != 1) {
            alert('Please enter a character instead!');
            playerGuesses.pop();
            gameInput.value = "";
            return;
        }

        //Check if already guessed the word
        let alreadyGuessed = false;
        playerGuesses.forEach((element, i) => {
            if (playerGuesses[i] === playerGuesses[playerGuesses.length - 1] && i != playerGuesses.length - 1) {
                alert('Already guessed that word!');
                playerGuesses.pop();
                gameInput.value = "";
                alreadyGuessed = true;
                return;
            }
        });
        if (alreadyGuessed) return;

        //Check if the character is correct
        let trueGuess = false;
        guessWord.forEach((element, i) => {
            if (guessWord[i] === playerGuesses[playerGuesses.length - 1]) {
                gameInput.value = "";
                trueGuess = true;
                playerWord[i] = guessWord[i];
            }
        });

        //Adding the result to the scoreboard
        const li = document.createElement('li');
        li.innerText = playerGuesses[playerGuesses.length - 1];
        if (!trueGuess) {
            hangman.round++;
            hangman.draw();
        }
        scoreboardDiv.appendChild(li);
        gameInput.value = "";
        screenWord.innerHTML = playerWord.join("");

        //Check end game            
        if (hangman.round > 5) {
            setTimeout(() => {
                alert(`The word was ${guessWord}`)
                document.querySelector('#youLose').classList.remove("notActive");
                guessButton.classList.add("notActive");
                gameInputLabel.classList.add("notActive");
            }, 300);
        }

        let gameWon = true;
        guessWord.forEach((element, i) => {
            if (guessWord[i] !== playerWord[i]) {
                gameWon = false;
            }
        });
        if (gameWon) {
            setTimeout(() => {
                document.querySelector('#youWin').classList.remove("notActive");
                guessButton.classList.add("notActive");
                gameInputLabel.classList.add("notActive");
            }, 300);
        }
        gameInput.focus();
    });

    resetButton.addEventListener('click', () => {
        gameScreen.classList.add("notActive");
        nameScreen.classList.remove("notActive");
        document.querySelector('#youWin').classList.add("notActive");
        document.querySelector('#youLose').classList.add("notActive");
        guessButton.classList.remove("notActive");
        gameInputLabel.classList.remove("notActive");

        //Resetting the values
        hangman.reset();
        for (let i = scoreboardDiv.childElementCount; i > 1; i--) scoreboardDiv.removeChild(scoreboardDiv.lastChild);
        word.value = "";
        gameInput.value = "";
        playerGuesses = [];
    });

}

main();