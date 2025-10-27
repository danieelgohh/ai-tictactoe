const stats = [document.getElementById("wins"), document.getElementById("losses"), document.getElementById("draws")];
const history = document.getElementById("history");
const grid = document.getElementById("grid");
const newGame = document.getElementsByClassName("restart");
const difficulty = document.getElementById("difficulty");
const symbol = document.getElementById("symbol");
const modal = document.getElementById("resultModal");
const undo = document.getElementById("undo");
const date = new Date();

difficulty.firstElementChild.classList.add("selected");
symbol.firstElementChild.classList.add("selected");

let occupied = new Array(9); for (let i = 0; i < 9; i++) occupied[i] = '';
let playerSymbol = symbol.querySelector(".selected").id;
let gameDifficulty = difficulty.querySelector(".selected").id;
let aiSymbol;
let playerStats = [0, 0, 0];
let playerHistory = [];
let movesHistory = [];

function initializeGame() {
  const handleSymbolPlacement = (e) => placeSymbol(e.target); // Create the function

  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");
    console.log(box)
    box.classList.add("box");
    box.setAttribute("id", i);
    box._handleSymbolPlacement = handleSymbolPlacement; // Create the reference to the function
    box.addEventListener("click", handleSymbolPlacement) // Attach the function to the click
    grid.append(box);
  }
}

function settingsSelect(setting, mode) {
  if (setting === "difficulty") {
    difficulty.querySelector(".selected").classList.remove("selected");
    difficulty.querySelector(`#${mode}`).classList.add("selected");
  }  else {
    symbol.querySelector(".selected").classList.remove("selected");
    symbol.querySelector(`#${mode}`).classList.add("selected");
  }

  playerSymbol = symbol.querySelector(".selected").id;
  gameDifficulty = difficulty.querySelector(".selected").id;

  restartGame();
}

function placeSymbol(box) {
  let winner;
  box.removeEventListener("click", box._handleSymbolPlacement); // Removal of the event listener is possible from the reference
  box.classList.add("occupied");

  box.innerHTML = playerSymbol;
  occupied[box.id] = playerSymbol;

  movesHistory.push(parseInt(box.id))

  winner = checkFinalWinner();
  if (winner) {
    showWinner(winner);
  } else {
    initiateAIMove();
  }
}

function checkWinnerState(boardState, symbolCheck) { // Board win chance analyse
  const completeSet = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
                      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
                      [0, 4, 8], // Diagonal top left to bottom right
                      [2, 4, 6]]; // Diagonal top right to bottom left
  
  return completeSet.some(set => 
    set.every(cellIndex => boardState[cellIndex] === symbolCheck)
  );
};

function checkFinalWinner() {
  if (occupied.filter(cell => cell === "").length === 0) {
    return "Tie"
  }
  const completeSet = [[0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
                      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
                      [0, 4, 8], // Diagonal top left to bottom right
                      [2, 4, 6]]; // Diagonal top right to bottom left
  
  for (const set of completeSet) {
    const [a, b, c] = set;
    if (occupied[a] && occupied[a] === occupied[b] && occupied[a] === occupied[c]) {
      return set;
    }
  }

  

  return null;
}

function minimax(newBoard, targetSymbol) {
  const emptyCellsIndex = newBoard.map((cell, index) => cell === '' ? index : null)
                                  .filter((cell) => cell !== null)
  if (checkWinnerState(newBoard, aiSymbol)) {
    return { score: 10 };
  } else if (checkWinnerState(newBoard, playerSymbol)) {
    return { score: -10 };
  } else if (emptyCellsIndex.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let i = 0; i < emptyCellsIndex.length; i ++) {
    const move = {};
    move.index = emptyCellsIndex[i];

    newBoard[emptyCellsIndex[i]] = targetSymbol; // Places the target symbol on all available spaces
    if (targetSymbol === aiSymbol) {
      const result = minimax(newBoard, playerSymbol)
      move.score = result.score;
    } else if (targetSymbol === playerSymbol) {
      const result = minimax(newBoard, aiSymbol)
      move.score = result.score;
    }

    newBoard[emptyCellsIndex[i]] = '' // Remove the analysing spot
    moves.push(move);
   }

  let bestPlacement;
  if (targetSymbol === playerSymbol) {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i ++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestPlacement = i; // This part selects which combination in the moves array is right
      }
    }
  } else {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i ++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestPlacement = i; // This part selects which combination in the moves array is right
      }
    }
  }

  return moves[bestPlacement];
}

function initiateAIMove() {
  if (playerSymbol === "X") {
    aiSymbol = "O";
  } else {
    aiSymbol = "X";
  }
  const availableSpaces = [...occupied].map((cell, index) => cell === '' ? index : null)
                                      .filter((cell) => cell !== null)
  const randomMove = availableSpaces[(Math.floor(Math.random() * availableSpaces.length))];
  if (gameDifficulty === "easy") {
    return placeAISymbol(randomMove);
  } else if (gameDifficulty === "medium") {
    return placeAISymbol(Math.random() > 0.7 ? minimax(occupied, aiSymbol).index : randomMove);
  } else {
    placeAISymbol(minimax(occupied, aiSymbol).index);
  }
}

function placeAISymbol(cell) {
  let selectedGrid = grid.querySelectorAll(".box")[cell]
  if (playerSymbol === "X") {
    selectedGrid.innerHTML = "O";
    occupied[cell] = "O";
  } else {
    selectedGrid.innerHTML = "X";
    occupied[cell] = "X";
  }

  selectedGrid.classList.add("occupied");
  movesHistory.push(cell);

  winner = checkFinalWinner();
  if (winner) {
    showWinner(winner);
  }
};

function showWinner(winner) {
  modal.style.display = "block";
  modal.querySelector(".close").addEventListener("click", dismissModal);
  grid.style.pointerEvents = "none"; // Disables the grid to be clicked
  undo.style.pointerEvents = "none";
  winnerSymbol = occupied[winner[0]];
  const completeDate = " " + date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + "," + date.getHours() + ":" + date.getMinutes() + " ";

  const playerHistoryStats = {}

  if (winner === "Tie") {
    modal.querySelector(".modal-body").querySelector("p").innerHTML = `Game is tied!`
    stats[2].innerHTML = playerStats[2] += 1;
    playerHistoryStats.result = "Draw"
  } else {
    for (let i = 0; i < winner.length; i ++) {
      document.getElementById(`${winner[i]}`).classList.add("highlight");
    }
    modal.querySelector(".modal-body").querySelector("p").innerHTML = `${winnerSymbol} wins!`
    if (winnerSymbol === playerSymbol) {
      stats[0].innerHTML = playerStats[0] += 1;
      playerHistoryStats.result = "Win"
    } else {
      stats[1].innerHTML = playerStats[1] += 1;
      playerHistoryStats.result = "Loss"
    }
  }

  playerHistoryStats.date = completeDate;
  playerHistoryStats.level = gameDifficulty;

  if (playerHistory.length > 3) {
    playerHistory[0] = playerHistoryStats;
  } else {
    playerHistory.unshift(playerHistoryStats);
  }

  for (let i = 0; i < playerHistory.length; i ++) {
    let historyDetail = document.createElement("p");
    historyDetail.innerHTML = playerHistory[i].result + playerHistory[i].date + playerHistory[i].level
    history.append(historyDetail);
  }
}

function dismissModal() {
  modal.style.display = "none";
}

function restartGame() {
  grid.innerHTML = "";
  grid.style.pointerEvents = "auto";
  highlight = [];
  movesHistory = [];
  new Array(9); for (let i = 0; i < 9; i++) occupied[i] = '';
  dismissModal();
  initializeGame();

  undo.style.pointerEvents = "auto";

  if (playerSymbol === "O") {
    initiateAIMove();
  }
}

function undoMove() {
  if (movesHistory.length <= 1) {
    return null
  } else {
    const handleSymbolPlacement = (e) => placeSymbol(e.target); // Create the function
    const lastIndex1 = movesHistory.pop();
    const lastIndex2 = movesHistory.pop();
    let removalGrid1 = document.getElementsByClassName("box")[lastIndex1];
    let removalGrid2 = document.getElementsByClassName("box")[lastIndex2];
  
    occupied[lastIndex1] = "";
    occupied[lastIndex2] = "";

    console.log(removalGrid1)
  
    removalGrid1.innerHTML = "";
    removalGrid1.classList.remove("occupied");
    removalGrid1.addEventListener("click", removalGrid1._handleSymbolPlacement) // Attach the function to the click
    removalGrid2.innerHTML = "";
    removalGrid2.classList.remove("occupied");
    removalGrid2.addEventListener("click", removalGrid2._handleSymbolPlacement) // Attach the function to the click

    console.log(occupied)
  }
}

difficulty.querySelector("#easy").addEventListener("click", () => settingsSelect("difficulty", "easy"));
difficulty.querySelector("#medium").addEventListener("click", () => settingsSelect("difficulty", "medium"));
difficulty.querySelector("#hard").addEventListener("click", () => settingsSelect("difficulty", "hard"));

symbol.querySelector("#X").addEventListener("click", () => settingsSelect("symbol", "X"));
symbol.querySelector("#O").addEventListener("click", () => settingsSelect("symbol", "O"));

undo.addEventListener("click", () => undoMove());

for (let i = 0; i < newGame.length; i ++) {
  newGame[i].addEventListener("click", restartGame);
}


initializeGame()