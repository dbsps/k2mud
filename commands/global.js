'use strict';

module.exports = {
    nick: function (WORLD, player, newNick) {
        if (!newNick) {
            player.send('Error: no nickname given');
        } else if (WORLD.players.get().has(newNick)) {
            send('Error: nick already taken');
        } else {
            if (player.nick === null) {
                WORLD.players.add(player);
                WORLD.send('system message', "* " + newNick + " has joined the realm.");
                player.send('Nick set: ' + newNick);
                player.call('look');
            } else {
                WORLD.send('system message', player.nick + " is now " + newNick);
            }
            player.nick = newNick;            
        }
    },
    who: function (WORLD, player) {
        player.send('Connected Users:');
        WORLD.players.get().forEach(p =>
            player.send('&emsp;* ' + p.nick)
        );
    }
};