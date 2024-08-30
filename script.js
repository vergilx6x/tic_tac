const board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isPlayerVsComputer = false;

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

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const modeButtons = document.querySelectorAll('input[name="mode"]');

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');

    if (board[index] !== '' || !isGameActive) return;

    // Place the current player's mark
    board[index] = currentPlayer;
    e.target.innerText = currentPlayer;

    // Check if the current player has won
    if (checkWinner()) {
        alert(`${currentPlayer} wins!`);
        isGameActive = false;
        return;
    }

    // Check if the game is a draw
    if (board.every(cell => cell !== '')) {
        alert('Draw!');
        isGameActive = false;
        return;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // If Player vs Computer mode and it's 'O's turn, let the computer play
    if (isPlayerVsComputer && currentPlayer === 'O') {
        computerMove();
    }
}

function computerMove() {
    let emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = 'O';
    cells[randomIndex].innerText = 'O';

    // Check if the computer has won
    if (checkWinner()) {
        alert('O wins!');
        isGameActive = false;
        return;
    }

    currentPlayer = 'X';
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function resetGame() {
    board.fill('');
    cells.forEach(cell => cell.innerText = '');
    currentPlayer = 'X';
    isGameActive = true;
}

function updateGameMode() {
    isPlayerVsComputer = document.querySelector('input[name="mode"]:checked').value === 'pvc';
    resetGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
modeButtons.forEach(button => button.addEventListener('change', updateGameMode));
