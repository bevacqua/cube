var npcs = [];

function clear () {
  var npc;
  while (npc = npcs.shift()) {
    npc.mob.clear = true;
    npc.mob.remove();
  }
}

function tick () {
  npcs.forEach(function (npc) {
    npc.think();
  });
}

npcs.clear = clear;
npcs.tick = tick;

module.exports = global.cube.npc = npcs;
