const stats = [document.getElementById("wins"), document.getElementById("losses"), document.getElementById("draws")];
const history = document.getElementById("history");
const grid = document.getElementById("grid");
const newGame = document.getElementById("restart");
const difficulty = document.getElementById("difficulty");
const symbol = document.getElementById("symbol");

let symbolTurn = 0, round = 0;
let occupied = new Array(9); for (let i = 0; i < 9; i++) occupied[i] = 0;

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
  gameRunning();
  box.removeEventListener("click", box._handleSymbolPlacement); // Removal of the event listener is possible from the reference

  if (symbolTurn < 1) {
    box.innerHTML = "X";
    symbolTurn += 1;
  } else {
    box.innerHTML = "O";
    occupied[box.id] += 2;
    symbolTurn -= 1;
  }

  checkWinner(occupied);
  

  round += 1;
}

function checkWinner(occupied) {

}

function gameRunning() {

}

difficulty.querySelector("#easy").addEventListener("click", () => settingsSelect("difficulty", "easy"));
difficulty.querySelector("#medium").addEventListener("click", () => settingsSelect("difficulty", "medium"));
difficulty.querySelector("#hard").addEventListener("click", () => settingsSelect("difficulty", "hard"));

symbol.querySelector("#first").addEventListener("click", () => settingsSelect("symbol", "first"));
symbol.querySelector("#second").addEventListener("click", () => settingsSelect("symbol", "second"));


initializeGame()