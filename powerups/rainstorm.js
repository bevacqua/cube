var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');

module.exports = function (level) {
  function effect (player, pow) {
    var npc;

    body.addClass('rainstorm');
    setTimeout(function () {
      body.removeClass('rainstorm');
    }, 300);

    while (level-- && npcs.length) {
      npc = npcs[Math.floor(Math.random() * effect.words.length)]
      if (npc) {
        setTimeout(function () {
          npc.mob.damage(level);
        }, Math.random() * 300);
      }
    }
    npcs.forEach(function (npc, i) {
      if (i < level) {
        npc.mob.damage(level);
      }
    });
  }

  effect.words = ['STORM!', 'Shower.', 'DEATH', 'Mayhem', 'WOOO!', 'KILL \'EM ALL'];

  return effect;
};
