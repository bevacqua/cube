var throttle = require('lodash.throttle');
var npcs = require('../npcs');
var us = require('../us');

module.exports = function (level) {
  var freq = Math.max(12000 / (level + 1), 1000);

  return throttle(function () {console.log('going');
    var n = us.r(npcs);
    if (n) {
      n.mob.addLevel(1, level);
    }
  }, freq);
};
