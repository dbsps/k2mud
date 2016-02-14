'use strict';


module.exports = {
    nick: function (WORLD, player, newNick) {
        if (!newNick) {
            player.send('Error: no nickname given');
        } else if (WORLD.players.get().has(newNick)) {
            send('Error: nick already taken');
        } else if (player.nick !== null) {
            WORLD.send('system message', player.nick + " is now " + newNick);
            return;
        }

        // try to load player
        WORLD.util.load(newNick)
        .then(data => {
            // right now the player object mixes functions and data, but you can't stringify
            // functions, so only data will get saved and this is mostly safe. it's still pretty
            // ugly though, and should be refactored.
            if (data.nick !== newNick) {
                throw new Error('Invalid state: player name doesn\'t match filename');
            }
            Object.assign(player, data);
            player.send('Player loaded');
        })
        .catch(err => {
            if (err.code !== 'ENOENT') { console.error(err.stack); }
            player.send('New player created');
            player.nick = newNick;            
            return { };
        })
        .then(() => {
            WORLD.players.add(player);
            WORLD.send('system message', "* " + newNick + " has joined the realm.");
            player.send('Nick set: ' + newNick);
            player.call('look');
        });
    },
    who: function (WORLD, player) {
        player.send('Connected Users:');
        WORLD.players.get().forEach(p =>
            player.send('&emsp;* ' + p.nick)
        );
    },
    save: function (WORLD, player) {
      WORLD.util.save(player)
        .then(() => player.send('Save successful'))
        .catch(err => console.error(`Failed to save ${player.nick}: ${err.stack}`));
    }
};