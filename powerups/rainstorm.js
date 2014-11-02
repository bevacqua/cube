var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var us = require('../us');
var audio = require('../audio');

module.exports = function (level) {
  function effect (player, pow) {
    var npc;

    body.addClass('rainstorm');

    setTimeout(function () {
      body.removeClass('rainstorm');
    }, 300);

    while (level-- && npcs.length) {
      setTimeout(damage.bind(null, us.r(npcs)), Math.random() * 300);
    }

    function  damage (npc) {
      npc.mob.damage(level);
    }

    npcs.forEach(function (npc, i) {
      if (i < level) {
        npc.mob.damage(level);
      }
    });
    audio.play('rainstorm');
  }

  effect.words = ['STORM!', 'Shower.', 'DEATH', 'Mayhem', 'WOOO!', 'KILL \'EM ALL'];

  return effect;
};
