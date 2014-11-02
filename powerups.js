var powerups = [];

function clear () {
  var pow;
  while ((pow = powerups.shift())) {
    pow.cleanup = true;
    pow.node.remove();
  }
}

module.exports = global.cube.powerup = powerups;

powerups.clear = clear;
