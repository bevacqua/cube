var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var npc = require('../npc');
var aimer = require('../ai/aimer');
var bullet = require('../bullet');
var powerup = require('../powerup');
var audio = require('../audio');

module.exports = function bulletrain (level) {
  function effect (player, options) {
    var o = options || {};
    fire(0, -1);
    fire(0, 1);
    fire(1, 1);
    fire(1, 0);
    fire(1, -1);
    fire(-1, -1);
    fire(-1, 1);
    fire(-1, 0);

    function fire (x, y) {
      if (player.kia) {
        return; // sanity
      }
      bullet(player, { level: level, diy: { dx: x, dy: y }, audio: false, speedfactor: o.speedfactor });
    }

    function sound () {
      audio.play('bulletrain');
    }

    setTimeout(sound, 50);
  }

  effect.words = ['BULLETRAIN!', 'TRAIN OF BULLETS.', 'YES!', 'BEASTLY', 'MAJESTUOUS!', 'DIE DIE DIE'];

  return effect;
};
