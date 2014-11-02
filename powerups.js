var powerups = [];

function clear () {
  var pow;
  while ((pow = powerups.shift())) {
    pow.cleanup = true;
    pow.mob.remove();
  }
}

module.exports = global.cube.powerup = powerups;

powerups.clear = clear;
