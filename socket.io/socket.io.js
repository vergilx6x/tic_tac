const socket = io();

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
let roomId = prompt("Enter room ID (create a new one or join an existing):");
let gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    isGameActive: true
};

socket.emit('joinGame', roomId);

socket.on('gameState', (state) => {
    gameState = state;
    updateBoard();
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', () => {
    socket.emit('resetGame', roomId);
});

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameState.board[index] !== '' || !gameState.isGameActive) return;
    socket.emit('makeMove', { roomId, index });
}

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.innerText = gameState.board[index];
    });
}
