
var errors = 0;
var bestScore;

var cardList = [
    "memory/cards/1300gs",
    "memory/cards/cbr1000rr",
    "memory/cards/duke1390r",
    "memory/cards/h2r",
    "memory/cards/1000mxr",
    "memory/cards/mt10sp",
    "memory/cards/r1",
    "memory/cards/s1000rr",
    "memory/cards/1000versys",
    "memory/cards/zx10r"
]

var cardSet;
var board = [];
var rows = 4;
var columns = 5;

var card1Selected;
var card2Selected;


window.onload = function() {
  bestScore = localStorage.getItem("bestScore");
  if (bestScore === null || bestScore === undefined) {
    bestScore = "N/A";
  }  
  document.getElementById("best-score").innerText = bestScore;
  shuffleCards();
  startGame();
  document.getElementById("reset-button").addEventListener("click", resetGame);
  document.getElementById("created-by").addEventListener("click", creator);
  document.getElementById("best-score-delete").addEventListener("click", function() {
    localStorage.removeItem("bestScore");
    bestScore = "N/A";
    document.getElementById("best-score").innerText = bestScore;
    resetGame();
  });

    const themeButton = document.getElementById("theme-button");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        themeButton.innerText = "Light mode";
    }

    themeButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        
        if (body.classList.contains("dark-mode")) {
            themeButton.innerText = "Light mode";
            localStorage.setItem("theme", "dark");
        } else {
            themeButton.innerText = "Dark mode";
            localStorage.setItem("theme", "light");
        }
    });
}

function creator () {
  alert("Created by: Daniel Fulop")
}

function shuffleCards() {
  cardSet = cardList.concat(cardList);
  for(let i = 0; i < cardSet.length; i++) {
    let j = Math.floor(Math.random() * cardSet.length);

    let temp = cardSet[i];
    cardSet[i] = cardSet[j];
    cardSet[j] = temp
  }
}

function startGame() {
  for(let r = 0; r < rows; r++) {
    let row = [];
    for(let c = 0; c < columns; c++){
      let cardImg = cardSet.pop();
      row.push(cardImg);

      let card = document.createElement("img");
      card.id = r.toString() + "-" + c.toString();
      card.src = cardImg + ".jpg";
      card.classList.add("card");
      card.addEventListener("click", selectCard)
      document.getElementById("board").append(card);
    }
    board.push(row);
  }
  setTimeout(hideCards, 3000)
  updateErrorCounter()
}

function hideCards() {
  for(let r = 0; r < rows; r++) {
    for(let c = 0; c < columns; c++){
      let card = document.getElementById(r.toString() + "-" + c.toString());
      card.src = "memory/cards/back.jpg";
    }
  }
}

function selectCard() {
  if(this.src.includes("memory/cards/back")) {
    if(!card1Selected) {
      card1Selected = this;

      let coords = card1Selected.id.split("-");
      let r = parseInt(coords[0]);
      let c = parseInt(coords[1]);

      card1Selected.src = board[r][c] + ".jpg";
    }
    else if (!card2Selected && this != card1Selected) {
      card2Selected = this;

      let coords = card2Selected.id.split("-");
      let r = parseInt(coords[0]);
      let c = parseInt(coords[1]);

      card2Selected.src = board[r][c] + ".jpg";
      setTimeout(update, 1000);
    }
  }
}

function update () {
  if(card1Selected.src != card2Selected.src) {
    card1Selected.src = "memory/cards/back.jpg";
    card2Selected.src = "memory/cards/back.jpg";
    errors += 1;
    document.getElementById("errors").innerText = errors;
  }

  let allCards = document.querySelectorAll(".card");
  let allFlipped = Array.from(allCards).every(card => !card.src.includes("memory/cards/back"));
  
  if (allFlipped) {
    updateBestScore();
    playWinSound();
  }
  
  updateErrorCounter()
  card1Selected = null;
  card2Selected = null;
}

function playWinSound() {
  let audio = new Audio("memory/win.mp3");
  audio.play();
}

function updateErrorCounter() {
  let errorCounter = document.getElementById("errors");
  
  errorCounter.innerText = errors;
  
  if (errors < 5) {
    errorCounter.style.color = "green";
  } else if (errors < 10) {
    errorCounter.style.color = "orange";
  } else {
    errorCounter.style.color = "red";
  }
}

function resetGame() {
  document.getElementById("board").innerHTML = "";
  errors = 0;
  document.getElementById("errors").innerText = errors;
  updateErrorCounter();

  board = [];
  shuffleCards();
  startGame();
}

function updateBestScore() {
  if (bestScore === "N/A" || errors < parseInt(bestScore)) {
    bestScore = errors;
    localStorage.setItem("bestScore", bestScore);
    document.getElementById("best-score").innerText = bestScore;
  }
}
