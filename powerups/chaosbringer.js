var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var npc = require('../npc');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');

module.exports = function chaosbringer (level) {
  function effect (player, pow) {
    var count = Math.min(level, 4);
    for (i = 0; i < count; i++) {
      npc(player, { ai: aimer, level: Math.floor(Math.max(1, i / 2)) });
    }
    if (--level > 0) {
      powerup(player, { effect: chaosbringer(level) });
    }
  }

  effect.words = ['FIERY DEATH!', 'ANGRY THINGS.', 'OH NO', 'CHAOS BRINGER', 'angry kill!', 'death is inevitable'];

  return effect;
};
