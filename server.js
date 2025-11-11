const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: '*' } });

app.use(express.static('public'));

let users = {};

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('set username', username => {
    users[socket.id] = username;
    io.emit('user list', Object.values(users));
  });

  socket.on('chat message', msg => {
    const username = users[socket.id] || 'Anonymous';
    io.emit('chat message', { user: username, msg });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('user list', Object.values(users));
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));

