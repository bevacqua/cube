var mobs = [];

function clear () {
  var mob;
  while ((mob = mobs.shift())) {
    if (mob.player !== true) {
      mob.clear = true;
      mob.remove();
    }
  }
}

module.exports = global.cube.mob = mobs;

mobs.clear = clear;
