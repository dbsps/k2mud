'use strict';

function roomSend(WORLD, player, room, str) {
            WORLD.players.getArray()
                 .filter(x => x != player)
                 .filter(x => x.room === WORLD.areas.midgaard[room])
                 .forEach(x => x.send(str));
    }
    
function moveAnnounce(WORLD, player, enter, depart) {
    var directions = {n:'north',e:'east',s:'south',w:'west'};
    var enterStr = player.nick + " wanders in from the " + directions[String(Object.keys(WORLD.areas.midgaard[enter].exits).filter(x => WORLD.areas.midgaard[enter].exits[x] === depart))] + '.';
    var depStr = player.nick + " leaves to the " +  directions[String(Object.keys(WORLD.areas.midgaard[depart].exits).filter(x => WORLD.areas.midgaard[depart].exits[x] === enter))] + '.';
    console.log(depStr);
    console.log(enterStr);
    roomSend(WORLD, player,  depart, depStr);
    roomSend(WORLD, player,  enter, enterStr);    
}

function move(dir) {
    return function (WORLD, player) {
        if (player.room.exits[dir]) {
            var depart = player.room.vnum;
            var enter = player.room.exits[dir];            
            moveAnnounce(WORLD, player, enter, depart);
            player.room = WORLD.areas.midgaard[enter];
            player.call('look');
        } else {
            player.send('You bump into a wall');
        }
    }
}

function roomWho(WORLD, player) {
    WORLD.players.getArray()
                 .filter(x => x != player)
                 .filter(x => x.room === player.room)
                 .forEach(x => player.send('&emsp;* ' + x.nick + ' is standing here.'));
}

module.exports = {
    look: function (WORLD, player) {
        var room = player.room;
        player.send('<br/>' + room.name);
        player.send('<br/>' + room.long);
        roomWho(WORLD, player);
        player.send('<br/>' + "Exits: " + Object.keys(room.exits).filter(x => room.exits[x]).join(', '));
    },
    n: move('n'),
    north: move('n'),
    e: move('e'),
    east: move('e'),
    s: move('s'),
    south: move('s'),
    w: move('w'),
    west: move('w'),

    
};