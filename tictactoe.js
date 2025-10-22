const stats = [document.getElementById("wins"), document.getElementById("losses"), document.getElementById("draws")];
const history = document.getElementById("history");
const grid = document.getElementById("grid");
const newGame = document.getElementsByClassName("restart");
const difficulty = document.getElementById("difficulty");
const symbol = document.getElementById("symbol");
const modal = document.getElementById("resultModal");

let symbolTurn = 0, round = 0; highlight = []
let occupied = new Array(9); for (let i = 0; i < 9; i++) occupied[i] = '';

function initializeGame() {
  difficulty.firstElementChild.classList.add("selected");
  symbol.firstElementChild.classList.add("selected");

  const handleSymbolPlacement = (e) => placeSymbol(e.target); // Create the function

  for (let i = 0; i < 9; i++) {
    const box = document.createElement("div");
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
}

function placeSymbol(box) {
  let winner;
  gameRunning();
  box.removeEventListener("click", box._handleSymbolPlacement); // Removal of the event listener is possible from the reference
  box.classList.add("occupied");

  if (symbolTurn < 1) {
    box.innerHTML = "X";
    occupied[box.id] = "X";
    symbolTurn += 1;
  } else {
    box.innerHTML = "O";
    occupied[box.id] = "O";
    symbolTurn -= 1;
  }

  winner = checkFinalWinner();
  if (winner) {
    showWinner(winner);
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

function minimax() {

}

function gameRunning() {

}

function showWinner(winner) {
  modal.style.display = "block";
  modal.querySelector(".close").addEventListener("click", dismissModal);
  grid.style.pointerEvents = "none"; // Disables the grid to be clicked

  for (let i = 0; i < winner.length; i ++) {
    console.log(winner)
    document.getElementById(`${winner[i]}`).classList.add("highlight");
  }

  modal.querySelector(".modal-body").querySelector("p").innerHTML = `${occupied[winner[0]]} wins!`
}

function dismissModal() {
  modal.style.display = "none";
}

function restartGame() {
  grid.innerHTML = "";
  grid.style.pointerEvents = "pointer";
  symbolTurn = 0, round = 0; highlight = []
  dismissModal();
  initializeGame();
}

difficulty.querySelector("#easy").addEventListener("click", () => settingsSelect("difficulty", "easy"));
difficulty.querySelector("#medium").addEventListener("click", () => settingsSelect("difficulty", "medium"));
difficulty.querySelector("#hard").addEventListener("click", () => settingsSelect("difficulty", "hard"));

symbol.querySelector("#first").addEventListener("click", () => settingsSelect("symbol", "first"));
symbol.querySelector("#second").addEventListener("click", () => settingsSelect("symbol", "second"));

for (let i = 0; i < newGame.length; i ++) {
  newGame[i].addEventListener("click", restartGame);
}


initializeGame()