'use strict';

function move(dir) {
    return function (WORLD, player) {
        if (player.room.exits[dir]) {
            var vnum = player.room.exits[dir];
            player.room = WORLD.areas.midgaard[vnum];
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
    west: move('w')
};