'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var midgaard = require('./areas/midgaard.js');

app.use(express.static(__dirname+'/app'));
app.get('/', function(req, res){
    res.sendFile(__dirname+'/app/index.html');
});

var connectedUsers = new Set();

const COMMANDS = {
    global: require('./commands/global'),
    room: require('./commands/room')
};

const WORLD = {
    send: function() {
        var clients = io.of('/').sockets;
        Object.keys(clients).forEach(key => {
            let socket = clients[key];
            if (socket.player.nick) {
                socket.emit.apply(socket, arguments);
            }
        });
    },
    players: {
        get: () => connectedUsers,
        getArray: () => [...connectedUsers],
        add: player => connectedUsers.add(player),
        delete: player => connectedUsers.delete(player)
    },
    areas: { midgaard },
    util: require('./lib/util')
};

function execCommand(player, type, args) {
    // find the command
    var cmd = [COMMANDS.global, COMMANDS.room]
        .find(commands => type in commands)[type];
    
    // run the command!
    cmd.apply(null, [WORLD, player].concat(args));
}

function createPlayer(socket) {
    var player = {
        nick: null,
        room: midgaard.v001,
        send: msg => socket.emit('system message', msg),
        call: (cmd, args) => execCommand(player, cmd, args), // curry this later?
        move: room => player.room = room
    };
    return player;
}

io.on('connection', function (socket) {
    var player = socket.player = createPlayer(socket);
    
    player.send('Please enter a username. (/nick &lt;name&gt;)');
    
    socket.on('command', function (msg) {
        execCommand(socket.player, msg.type, msg.args);
    });
    socket.on('disconnect', function () {
        if (socket.player.nick !== null) {
            WORLD.send('system message', "* " + socket.player.nick + " has left the realm.");
        }
        
        var playerData = socket.player;
        WORLD.players.delete(socket.player);
        
        WORLD.util.save(playerData).catch(err =>
          console.error(`Failed to save player on disconnect: ${err.stack}`)
        );
    });
    socket.on('chat message', function (msg) {
        var player = socket.player;
        
        if (player.nick === null) {
            socket.emit('system message', 'Please enter a username.');
        } else {
            io.emit('chat message', {
                nick: player.nick,
                msg: msg
            });
        }
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
