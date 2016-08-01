'use strict';

var Promise = require('bluebird'),
    PATH = require('path'),
    fs = Promise.promisifyAll(require('fs'), { suffix: '$' });

const pfile = name => PATH.join(__dirname, '..', 'save', name);

module.exports = {
  load: nick => fs.readFile$(pfile(nick)).then(JSON.parse),
  save: player => fs.writeFile$(pfile(player.nick), JSON.stringify(player))
};