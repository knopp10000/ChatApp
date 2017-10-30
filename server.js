const express = require('express');
const socket = require('socket.io');

let app = express();
server = app.listen(3000);
io = socket(server);

app.use(express.static('public'));

console.log("Server is running!")

users = new Map();

io.sockets.on('connection', (socket) => {
  //Give ID and add to Users
  console.info(`Client connected [id=${socket.id}]`);
  io.sockets.connected[socket.id].emit('giveID', socket.id);
  users.set(socket.id, '');
  //Give UserMap to new user
  io.sockets.emit('updateUserMap', Array.from(users));

  //on disconnect
  socket.on('disconnect', () => {
    console.info(`Client gone [id=${socket.id}]`)
    users.delete(socket.id);
    //update userlist
    io.sockets.emit('updateUserMap', Array.from(users));
  });

  socket.on('message', (messageObj) => {
    console.log('broadcasting: ' + messageObj.msg);
    //socket.broadcast.emit('message', data);
    io.sockets.emit('printMsg', messageObj); //To All the sockets
  });

  socket.on('usernameSubmit', (newUsername) => {
    users.set(socket.id, newUsername);
    io.sockets.emit('updateUserMap', Array.from(users));
    //io.sockets.emit('updateUserMap', users);
   })

})
