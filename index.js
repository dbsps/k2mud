'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname+'/app'));
app.get('/', function(req, res){
    res.sendFile(__dirname+'/app/index.html');
});

var connectedUsers = new Set();


function sendToLoggedIn() {
  var clients = io.of('/').sockets;
  Object.keys(clients).forEach(key => {
    let socket = clients[key];
    if (socket.nick) {
      socket.emit.apply(socket, arguments);
    }
  });
}


io.on('connection', function(socket){
    console.log('a user connected');
    function send(msg) { socket.emit('system message', msg); }
    
    socket.nick = null;
    
    send('Please enter a username. (/nick &lt;name&gt;)');
    socket.on('command', function(msg) {
        if (msg.type === 'nick') {
            var newNick = msg.args[0];
            if (!msg.args || !newNick) {
                send('Error: no nickname given');
            } else if (connectedUsers.has(newNick)) {
                send('Error: nick already taken');
            } else {
                if (socket.nick !== null) {
                    connectedUsers.delete(socket.nick);
                }
                socket.nick = newNick;
                connectedUsers.add(newNick);
                send('Nick set: ' + newNick);
                sendToLoggedIn('nick update', [...connectedUsers]);
            }
        }
    })
    socket.on('disconnect', function(){
        connectedUsers.delete(socket.nick);
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        if (socket.nick === null) {
            socket.emit('system message', 'Please enter a username.');
        } else {
            io.emit('chat message', {
                nick: socket.nick,
                msg: msg
            });
        }
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
