const cellElements = document.querySelectorAll('[data-cell]');
const statusElement = document.querySelector('#status');
const restartButton = document.querySelector('#restart-btn');
let xIsNext = true;
let gameIsLive = true;
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function evaluate(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      if (board[a] === 'O') {
        return 10;
      } else if (board[a] === 'X') {
        return -10;
      }
    }
  }
  return 0;
}

function areMovesLeft(board) {
  return board.includes(null);
}

function minimax(board, depth, isMaximizingPlayer) {
  const score = evaluate(board);
  
  if (score === 10 || score === -10 || !areMovesLeft(board)) {
    return score - depth;
  }
  
  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return bestScore;
  }
}

function computerTurn() {
  const board = [];
  cellElements.forEach(cell => {
    board.push(cell.classList.contains('x') ? 'X' : (cell.classList.contains('o') ? 'O' : null));
  });
  
  let bestScore = -Infinity;
  let bestMove = null;
  
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  cellElements[bestMove].classList.add('o');
  checkGameStatus();
}

  function handleCellClick(e) {
    const cell = e.target;
    const currentClass = xIsNext ? 'x' : 'o';
  
    if (!gameIsLive || cell.classList.contains('x') || cell.classList.contains('o')) {
      return;
    }
  
    cell.classList.add(currentClass);
    checkGameStatus();
  
    if (gameIsLive && !xIsNext) {
      statusElement.innerHTML = "It's the computer's turn";
      setTimeout(computerTurn, 0);
    }
  }
  

function checkGameStatus() {
  const cellElements = document.querySelectorAll('[data-cell]');
  const currentClass = xIsNext ? 'x' : 'o';
  let winner = null;

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    const cell1 = cellElements[a];
    const cell2 = cellElements[b];
    const cell3 = cellElements[c];

    if (cell1.classList.contains(currentClass) && cell2.classList.contains(currentClass) && cell3.classList.contains(currentClass)) {
        winner = currentClass;
        break;
        }
        }
        
        if (winner) {
        statusElement.innerText = `${winner.toUpperCase()} has won!`;
        gameIsLive = false;
} else if (isBoardFull()) {
statusElement.innerText = "Game is tied!";
gameIsLive = false;
} else {
xIsNext = !xIsNext;
statusElement.innerText = `It's ${xIsNext ? 'X' : 'O'}'s turn`;
}
}

function isBoardFull() {
return [...cellElements].every(cell => cell.classList.contains('x') || cell.classList.contains('o'));
}

function handleRestartClick() {
xIsNext = true;
gameIsLive = true;

for (let i = 0; i < cellElements.length; i++) {
const cell = cellElements[i];
cell.classList.remove('x');
cell.classList.remove('o');
}

statusElement.innerText = `It's ${xIsNext ? 'X' : 'O'}'s turn`;
}

cellElements.forEach(cell => {
cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', handleRestartClick);
