let socket;
let playerSymbol;

document.addEventListener('DOMContentLoaded', function() {
  socket = io();

  const cells = document.querySelectorAll('.cell');
  const resetButton = document.getElementById('reset');
  const modeButtons = document.querySelectorAll('input[name="mode"]');

  socket.on('joined', (symbol) => {
    playerSymbol = symbol;
    document.getElementById("game-mode").style.display = "none";
    document.getElementById("reset").style.display = "block";
  });

  socket.on('gameStarted', () => {
    document.getElementById("loading").style.display = "none";
  });

  socket.on('gameFull', () => {
    alert("Game is full. Please try again later.");
    location.reload();
  });

  socket.on('playerLeft', () => {
    alert("Your opponent left the game. Game over.");
    location.reload();
  });

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  resetButton.addEventListener('click', resetGame);

  modeButtons.forEach(button => button.addEventListener('change', updateGameMode));

  function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    if (e.target.innerText !== '' || !playerSymbol) return;

    socket.emit("makeMove", index);
  }

  function resetGame() {
    cells.forEach(cell => cell.innerText = '');
    socket.emit('reset');
  }

  function updateGameMode() {
    location.reload();
  }

  socket.on('updateBoard', ({ position, symbol }) => {
    const cell = cells[position];
    cell.innerText = symbol;

    // Check if the game has ended
    checkGameStatus(symbol);
  });

  function checkGameStatus(symbol) {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    let board = Array.from(cells).map(cell => cell.innerText);

    if (winningConditions.some(condition => condition.every(index => board[index] === symbol))) {
      alert(`${symbol} wins!`);
      resetGame();
    }

    if (!board.includes('')) {
      alert('Draw!');
      resetGame();
    }
  }
});


cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
modeButtons.forEach(button => button.addEventListener('change', updateGameMode));
