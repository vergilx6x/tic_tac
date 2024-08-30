const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

let players = {};
let currentTurn = 'X';

io.on('connection', (socket) => {
  console.log('A new player connected');

  socket.on('join', (playerName) => {
    if (!players['X'] || !players['O']) {
      const symbol = players['X'] ? 'O' : 'X';
      players[symbol] = { id: socket.id, name: playerName };
      socket.emit('joined', symbol);
      
      if (Object.keys(players).length === 2) {
        io.emit('gameStarted');
      }
    } else {
      socket.emit('gameFull');
    }
  });

  socket.on('makeMove', (position) => {
    const symbol = players['X'].id === socket.id ? 'X' : 'O';
    
    if (symbol !== currentTurn) return;

    io.emit('updateBoard', { position, symbol });
    currentTurn = currentTurn === 'X' ? 'O' : 'X';
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected');
    delete players['X'];
    delete players['O'];
    io.emit('playerLeft');
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
