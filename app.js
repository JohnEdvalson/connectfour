let players = [
  {
    name: "Player 1",
    score: 0,
    color: "red",
    type: "human",
  },
  {
    name: "Player 2",
    score: 0,
    color: "gold",
    type: "human",
  },
];

let gameState = {
  board: [],
  currentPlayer: players[0],
};

const grid = document.querySelector(".grid");
let numRows = 6;
let numColumns = 7;
let victory = false;
let timeoutId;

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", startGame);

function startGame() {
  const setup = document.querySelector(".setup");
  const game = document.querySelector(".game");
  const rowInput = document.querySelector("#row-input");
  const colInput = document.querySelector("#col-input");
  const playerOneInput = document.querySelector("#player-one-input");
  const playerTwoInput = document.querySelector("#player-two-input");
  const playerOneType = document.querySelector("#player-one-type");
  const playerTwoType = document.querySelector("#player-two-type");

  setup.style.display = "none";
  game.style.display = "flex";
  grid.style.display = "grid";

  setNames(playerOneInput.value, playerTwoInput.value);
  setTypes(playerOneType.value, playerTwoType.value);
  setGridDimensions(rowInput.value, colInput.value);
  makeGrid(numRows, numColumns);
  makeBoard(numRows, numColumns);
  coinToss();
}

const newGameButton = document.querySelector("#new-game-button");
newGameButton.addEventListener("click", newGame);

function newGame() {
  cleanUp();

  players[0].score = 0;
  players[1].score = 0;
  const playerOneScore = document.querySelector("#player-one-score");
  playerOneScore.innerText = gameState.currentPlayer.score;
  const playerTwoScore = document.querySelector("#player-two-score");
  playerTwoScore.innerText = gameState.currentPlayer.score;

  const setup = document.querySelector(".setup");
  const game = document.querySelector(".game");
  setup.style.display = "flex";
  game.style.display = "none";
  grid.innerText = "";
}

function coinToss() {
  gameState.currentPlayer = players[Math.floor(Math.random() * 2)];
  const playerTurn = document.querySelector("#current-player-name");
  playerTurn.innerText = `${gameState.currentPlayer.name}`;
  playerTurn.style.color = `${gameState.currentPlayer.color}`;
  if (gameState.currentPlayer.type === "computer") {
    timeoutId = window.setTimeout(computerTakeTurn, 1000);
  }
}

function setNames(nameOne, nameTwo) {
  const playerOneName = document.querySelector("#player-one-name");
  const playerTwoName = document.querySelector("#player-two-name");
  if (!nameOne || !nameOne.split(" ").join("")) {
    nameOne = "Player 1";
  }
  if (!nameTwo || !nameTwo.split(" ").join("")) {
    nameTwo = "Player 2";
  }
  playerOneName.innerText = `${nameOne}: `;
  playerTwoName.innerText = `${nameTwo}: `;

  players[0].name = nameOne;
  players[1].name = nameTwo;
}

function setTypes(typeOne, typeTwo) {
  players[0].type = typeOne;
  players[1].type = typeTwo;
}

function setGridDimensions(rows, columns) {
  numRows = Math.round(rows);
  if (numRows < 4) {
    numRows = 4;
  } else if (numRows > 20) {
    numRows = 20;
  }

  numColumns = Math.round(columns);
  if (numColumns < 4) {
    numColumns = 4;
  } else if (numColumns > 20) {
    numColumns = 20;
  }

  let height = numRows * 10;
  let width = numColumns * 10;
  while (height > 100 && width > 100) {
    height = height / 2;
    width = width / 2;
  }
  grid.style.height = `${height}vh`;
  grid.style.width = `${width}vh`;
}

function makeBoard(rows, columns) {
  for (let i = 0; i < rows; i++) {
    gameState.board.push([]);
    for (let j = 0; j < columns; j++) {
      gameState.board[i].push(null);
    }
  }
}

function makeGrid(rows, columns) {
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
      let circle = document.createElement("div");
      circle.classList.add("circle");
      circle.id = `${i},${j}`;
      cell.appendChild(circle);
    }
  }
}

function toCoordinates(id) {
  const coords = id.split(",");
  const numCoords = coords.map((coord) => {
    return Number(coord);
  });
  return numCoords;
}

function toId(coords) {
  let id = coords.join();
  return id;
}

function switchPlayer() {
  if (gameState.currentPlayer === players[0]) {
    gameState.currentPlayer = players[1];
  } else {
    gameState.currentPlayer = players[0];
  }
  const playerTurn = document.querySelector("#current-player-name");
  playerTurn.innerText = `${gameState.currentPlayer.name}`;
  playerTurn.style.color = `${gameState.currentPlayer.color}`;
  if (gameState.currentPlayer.type === "computer") {
    timeoutId = window.setTimeout(computerTakeTurn, 1000);
  }
}

function findSpace(coords) {
  let space = [];
  for (let i = numRows - 1; i >= 0; i--) {
    if (gameState.board[i][coords[1]] === null) {
      space.push(i);
      space.push(coords[1]);
      return space;
    }
  }
  return false;
}

function placeChip(coords) {
  gameState.board[coords[0]][coords[1]] = gameState.currentPlayer.color;
  const circle = document.getElementById(`${toId(coords)}`);
  circle.style.backgroundColor = gameState.currentPlayer.color;
}

function testChip(coords, color = gameState.currentPlayer.color) {
  let isWinning = false;
  let storage = gameState.board[coords[0]][coords[1]];
  if (!storage) {
    storage = null;
  }
  gameState.board[coords[0]][coords[1]] = color;
  if (isWinningMove(coords, color)) {
    isWinning = true;
  }
  gameState.board[coords[0]][coords[1]] = storage;
  return isWinning;
}

const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", reset);

function reset() {
  cleanUp();
  coinToss();
}

function cleanUp() {
  clearTimeout(timeoutId);
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      const circle = document.getElementById(`${toId([i, j])}`);
      circle.style.backgroundColor = "rgb(50,50,50)";
      gameState.board[i][j] = null;
    }
  }
  victory = false;
  const turnMessage = document.querySelector("#turn-or-winner");
  turnMessage.innerText = "Current Turn:";
}

function checkVertical(coords, color) {
  if (coords[0] < numRows - 3) {
    let count = 0;
    for (let i = coords[0]; i < coords[0] + 4; i++) {
      if (gameState.board[i][coords[1]] === color) {
        count++;
      }
    }
    if (count === 4) {
      return true;
    }
  }
  return false;
}

function checkHorizontal(coords, color) {
  if (coords[1] > 2) {
    let count = 0;
    for (let i = coords[1]; i > coords[1] - 4; i--) {
      if (gameState.board[coords[0]][i] === color) {
        count++;
      }
    }
    if (count === 4) {
      return true;
    }
  }

  if (coords[1] < numColumns - 3) {
    let count = 0;
    for (let i = coords[1]; i < coords[1] + 4; i++) {
      if (gameState.board[coords[0]][i] === color) {
        count++;
      }
    }
    if (count === 4) {
      return true;
    }
  }

  if (coords[1] < numColumns - 1 && coords[1] > 1) {
    let count = 0;
    for (let i = coords[1] - 2; i < coords[1] + 2; i++) {
      if (gameState.board[coords[0]][i] === color) {
        count++;
      }
    }
    if (count === 4) {
      return true;
    }
  }

  if (coords[1] < numColumns - 2 && coords[1] > 0) {
    let count = 0;
    for (let i = coords[1] - 1; i < coords[1] + 3; i++) {
      if (gameState.board[coords[0]][i] === color) {
        count++;
      }
    }
    if (count === 4) {
      return true;
    }
  }

  return false;
}

function checkDiagonal(coords, color) {
  if (coords[1] > 2 && coords[0] > 2) {
    let count = 0;
    let rowIdx = coords[0];
    for (let i = coords[1]; i > coords[1] - 4; i--) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx--;
    }
    if (count === 4) {
      return true;
    }
  }

  if (coords[1] < numColumns - 3 && coords[0] > 2) {
    let count = 0;
    let rowIdx = coords[0];
    for (let i = coords[1]; i < coords[1] + 4; i++) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx--;
    }
    if (count === 4) {
      return true;
    }
  }

  if (coords[1] > 2 && coords[0] < numRows - 3) {
    let count = 0;
    let rowIdx = coords[0];
    for (let i = coords[1]; i > coords[1] - 4; i--) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx++;
    }
    if (count === 4) {
      return true;
    }
  }

  if (coords[1] < numColumns - 3 && coords[0] < numRows - 3) {
    let count = 0;
    let rowIdx = coords[0];
    for (let i = coords[1]; i < coords[1] + 4; i++) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx++;
    }
    if (count === 4) {
      return true;
    }
  }

  if (
    coords[1] > 1 &&
    coords[1] < numColumns - 1 &&
    coords[0] < numRows - 1 &&
    coords[0] > 1
  ) {
    let count = 0;
    let rowIdx = coords[0] + 1;
    for (let i = coords[1] + 1; i > coords[1] - 3; i--) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx--;
    }
    if (count === 4) {
      return true;
    }
  }

  if (
    coords[1] > 0 &&
    coords[1] < numColumns - 2 &&
    coords[0] < numRows - 1 &&
    coords[0] > 1
  ) {
    let count = 0;
    let rowIdx = coords[0] + 1;
    for (let i = coords[1] - 1; i < coords[1] + 3; i++) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx--;
    }
    if (count === 4) {
      return true;
    }
  }

  if (
    coords[1] > 1 &&
    coords[1] < numColumns - 1 &&
    coords[0] < numRows - 2 &&
    coords[0] > 0
  ) {
    let count = 0;
    let rowIdx = coords[0] - 1;
    for (let i = coords[1] + 1; i > coords[1] - 3; i--) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx++;
    }
    if (count === 4) {
      return true;
    }
  }

  if (
    coords[1] > 0 &&
    coords[1] < numColumns - 2 &&
    coords[0] < numRows - 2 &&
    coords[0] > 0
  ) {
    let count = 0;
    let rowIdx = coords[0] - 1;
    for (let i = coords[1] - 1; i < coords[1] + 3; i++) {
      if (gameState.board[rowIdx][i] === color) {
        count++;
      }
      rowIdx++;
    }
    if (count === 4) {
      return true;
    }
  }

  return false;
}

function isWinningMove(coords, color = gameState.currentPlayer.color) {
  if (checkVertical(coords, color)) {
    return true;
  } else if (checkHorizontal(coords, color)) {
    return true;
  } else if (checkDiagonal(coords, color)) {
    return true;
  } else {
    return false;
  }
}

function isDraw() {
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numColumns; j++) {
      if (gameState.board[i][j] === null) {
        return false;
      }
    }
  }
  return true;
}

function endGame() {
  victory = true;
  const victoryMessage = document.querySelector("#turn-or-winner");
  victoryMessage.innerText = "Winner!";
  gameState.currentPlayer.score++;
  if (gameState.currentPlayer === players[0]) {
    const playerOneScore = document.querySelector("#player-one-score");
    playerOneScore.innerText = gameState.currentPlayer.score;
  } else if (gameState.currentPlayer === players[1]) {
    const playerTwoScore = document.querySelector("#player-two-score");
    playerTwoScore.innerText = gameState.currentPlayer.score;
  }
}

function drawGame() {
  victory = true;
  const drawMessage = document.querySelector("#turn-or-winner");
  drawMessage.innerText = "Draw!";
}

function computerTakeTurn() {
  let computerMove = [];
  let validMoves = [];

  let opponentColor = "";
  if (gameState.currentPlayer === players[0]) {
    opponentColor = players[1].color;
  } else {
    opponentColor = players[0].color;
  }

  for (let i = 0; i < numColumns; i++) {
    computerMove = findSpace([0, i]);
    if (!computerMove) {
      continue;
    } else if (testChip(computerMove)) {
      console.log(`${gameState.currentPlayer.name} is going for the win!`);
      placeChip(computerMove);
      endGame();
      return;
    } else if (testChip(computerMove, opponentColor)) {
      console.log(`${gameState.currentPlayer.name} is moving to block.`);
      placeChip(computerMove);
      if (isDraw()) {
        drawGame();
      } else {
        switchPlayer();
      }
      return;
    } else {
      validMoves.push(computerMove);
    }
  }

  computerMove = findSpace(
    validMoves[Math.floor(Math.random() * validMoves.length)]
  );
  console.log(`${gameState.currentPlayer.name} is making a random move.`);
  placeChip(computerMove);
  if (isDraw()) {
    drawGame();
  } else {
    switchPlayer();
  }
}

grid.addEventListener("click", function (event) {
  if (!event.target.id || victory === true) {
    return;
  }
  let targetMove = toCoordinates(event.target.id);
  let finalMove = findSpace(targetMove);
  if (!finalMove) {
    console.log("Column is full!");
  } else {
    placeChip(finalMove);
    if (isWinningMove(finalMove)) {
      endGame();
    } else if (isDraw()) {
      drawGame();
    } else {
      switchPlayer();
    }
  }
});
