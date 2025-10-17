const stats = [document.getElementById("wins"), document.getElementById("losses"), document.getElementById("draws")];
const history = document.getElementById("history");
const grid = document.getElementById("grid");
const newGame = document.getElementsByClassName("restart");
const difficulty = document.getElementById("difficulty");
const symbol = document.getElementById("symbol");
const modal = document.getElementById("resultModal");

let symbolTurn = 0, round = 0; highlight = []
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
  let winner = 0;
  gameRunning();
  box.removeEventListener("click", box._handleSymbolPlacement); // Removal of the event listener is possible from the reference
  box.classList.add("occupied");

  if (symbolTurn < 1) {
    box.innerHTML = "X";
    occupied[box.id] += 1;
    symbolTurn += 1;
  } else {
    box.innerHTML = "O";
    occupied[box.id] += 10;
    symbolTurn -= 1;
  }

  winner = checkWinner(occupied);
  if (winner > 0) {
    showWinner(winner);
  }
}

function checkWinner(occupied) {
  for (let i = 0; i < 3; i ++) {
    if (i === 0) {
      if (occupied[i] + occupied[i + 1] + occupied[i + 2] === 3 || occupied[i] + occupied[i + 1] + occupied[i + 2] === 30) { // Horizontal
        highlight = [i, i + 1, i + 2];
        return occupied[i] + occupied[i + 1] + occupied[i + 2];
      } else if (occupied[i + 3] + occupied[i + 4] + occupied[i + 5] === 3 || occupied[i + 3] + occupied[i + 4] + occupied[i + 5] === 30) { // Horizontal
        highlight = [i + 3, i + 4, i + 5];
        return occupied[i + 3] + occupied[i + 4] + occupied[i + 5];
      } else if (occupied[i + 6] + occupied[i + 7] + occupied[i + 8] === 3 || occupied[i + 6] + occupied[i + 7] + occupied[i + 8] === 30) { // Horizontal
        highlight = [i + 6, i + 7, i + 8];
        return occupied[i + 6] + occupied[i + 7] + occupied[i + 8];
      } else if (occupied[i] + occupied[i + 4] + occupied[i + 8] === 3 || occupied[i] + occupied[i + 4] + occupied[i + 8] === 30) { // Diagonal
        highlight = [i, i + 4, i + 8];
        return occupied[i] + occupied[i + 4] + occupied[i + 8];
      }
    };

    if (i === 2) {
      if (occupied[i] + occupied[i + 2] + occupied[i + 4] === 3 || occupied[i] + occupied[i + 2] + occupied[i + 4] === 30) { // Diagonal 
        highlight = [i, i + 2, i + 4];
        return occupied[i] + occupied[i + 2] + occupied[i + 4];
      }
    };

    if (occupied[i] + occupied[i + 3] + occupied[i + 6] === 3 || occupied[i] + occupied[i + 3] + occupied[i + 6] === 30) { // Vertical for 0, 1, 2
      highlight = [i, i + 3, i + 6];
      return occupied[i] + occupied[i + 3] + occupied[i + 6];
    };
  };
};

function gameRunning() {

}

function showWinner(winner) {
  modal.style.display = "block";
  modal.querySelector(".close").addEventListener("click", dismissModal);
  grid.style.pointerEvents = "none"; // Disables the grid to be clicked
  console.log(highlight);

  for (let i = 0; i < highlight.length; i ++) {
    let bruh = document.getElementById(`${highlight[i]}`).classList.add("highlight");
    console.log(bruh);
  }

  if (winner === 3) {
    modal.querySelector(".modal-body").querySelector("p").innerHTML = "X wins!"
  } else {
    modal.querySelector(".modal-body").querySelector("p").innerHTML = "O wins!"
  }
}

function dismissModal() {
  modal.style.display = "none";
}

function restartGame() {

}

difficulty.querySelector("#easy").addEventListener("click", () => settingsSelect("difficulty", "easy"));
difficulty.querySelector("#medium").addEventListener("click", () => settingsSelect("difficulty", "medium"));
difficulty.querySelector("#hard").addEventListener("click", () => settingsSelect("difficulty", "hard"));

symbol.querySelector("#first").addEventListener("click", () => settingsSelect("symbol", "first"));
symbol.querySelector("#second").addEventListener("click", () => settingsSelect("symbol", "second"));

for (let i = 0; i < newGame.length; i ++) {
  newGame[i].addEventListener("click", initializeGame);
}


initializeGame()