const container = document.querySelector(".container");
const playerField = document.querySelector(".player");
const resetBtn = document.querySelector(".reset");

const gameBoardModule = (() => {
  let board = [];

  for (let i = 0; i < 9; i++) {
    board[i] = "";
  }

  const resetBoard = () => {
    board = [];

    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
  };

  const getBoard = () => board;

  const addSymbol = (index, symbol) => {
    if (board[index] !== "") return false;
    board[index] = symbol;
    return true;
  };

  return { getBoard, addSymbol, resetBoard };
})();

const playerFactory = (name, symbol) => {
  return { name, symbol };
};

const gameController = (() => {
  const player1 = playerFactory("Player 1", "X");
  const player2 = playerFactory("Player 2", "O");

  let activePlayer = player1;
  let otherPlayer = player2;

  const switchPlayer = () => {
    activePlayer = activePlayer !== player1 ? player1 : player2;
    otherPlayer = otherPlayer !== player1 ? player1 : player2;
  };

  const getActivePlayer = () => activePlayer;
  const setPlayers = () => {
    activePlayer = player1;
    otherPlayer = player2;
  };

  const getOtherPlayer = () => otherPlayer;

  const playRound = (index) => {
    if (gameBoardModule.addSymbol(index, getActivePlayer().symbol)) {
      switchPlayer();
    }
  };

  const checkWinner = (board, symbol) => {
    // Check rows, columns, and diagonals for three in a row
    const rows = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    const columns = [
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];
    const diagonals = [
      [0, 4, 8],
      [2, 4, 6],
    ];
    const lines = [...rows, ...columns, ...diagonals];

    for (const line of lines) {
      if (line.every((cell) => board[cell] === symbol)) {
        return true;
      }
    }

    return false;
  };

  const checkTie = (board) => {
    const availableCells = board.filter((cell) => cell === "").length;
    if (availableCells === 0) return true;
    return false;
  };

  return {
    playRound,
    getActivePlayer,
    getOtherPlayer,
    getBoard: gameBoardModule.getBoard,
    resetBoard: gameBoardModule.resetBoard,
    checkTie,
    checkWinner,
    setPlayers,
  };
})();

const screenControllerModule = (() => {
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const restart = () => {
    gameController.setPlayers();
    gameController.resetBoard();
    updateScreen();
    const buttons = document.querySelectorAll(".field");
    buttons.forEach((btn) => (btn.disabled = false));

    const activePlayer = gameController.getActivePlayer();
    const otherPlayer = gameController.getOtherPlayer();
    playerTurnDiv.textContent = `${activePlayer.name} - it's your turn`;
  };
  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = gameController.getBoard();
    const activePlayer = gameController.getActivePlayer();
    const otherPlayer = gameController.getOtherPlayer();
    const winner = gameController.checkWinner(board, otherPlayer.symbol);
    const tie = gameController.checkTie(board);

    if (winner) {
      playerTurnDiv.textContent = `${otherPlayer.name} has won!`;
    } else if (tie) {
      playerTurnDiv.textContent = `It's a tie!`;
    } else {
      playerTurnDiv.textContent = `${activePlayer.name} - it's your turn`;
    }

    board.forEach((field, index) => {
      const fieldBtn = document.createElement("button");
      fieldBtn.classList.add("field");
      fieldBtn.dataset.id = index;
      fieldBtn.textContent = field;
      boardDiv.appendChild(fieldBtn);
    });

    if (winner || tie) {
      const buttons = document.querySelectorAll(".field");
      buttons.forEach((btn) => (btn.disabled = true));
    }
  };

  const clickHandlerBoard = (e) => {
    const selectedField = e.target.dataset.id;
    gameController.playRound(selectedField);
    updateScreen();
  };

  boardDiv.addEventListener("click", clickHandlerBoard);
  resetBtn.addEventListener("click", restart);
  updateScreen();
})();
