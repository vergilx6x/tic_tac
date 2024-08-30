const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store game states and player data
let games = {}; // Object to store game states by room ID

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', (roomId) => {
        socket.join(roomId);

        if (!games[roomId]) {
            games[roomId] = {
                board: ['', '', '', '', '', '', '', '', ''],
                currentPlayer: 'X',
                isGameActive: true
            };
        }

        socket.emit('gameState', games[roomId]);
    });

    socket.on('makeMove', ({ roomId, index }) => {
        let game = games[roomId];
        if (game.board[index] !== '' || !game.isGameActive) return;

        game.board[index] = game.currentPlayer;
        game.isGameActive = !checkWinner(game.board, game.currentPlayer);
        
        if (game.isGameActive && !game.board.includes('')) {
            game.isGameActive = false; // Draw
        }

        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';

        io.to(roomId).emit('gameState', game);
    });

    socket.on('resetGame', (roomId) => {
        if (games[roomId]) {
            games[roomId] = {
                board: ['', '', '', '', '', '', '', '', ''],
                currentPlayer: 'X',
                isGameActive: true
            };
            io.to(roomId).emit('gameState', games[roomId]);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

function checkWinner(board, player) {
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

    return winningConditions.some(condition =>
        condition.every(index => board[index] === player)
    );
}

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
