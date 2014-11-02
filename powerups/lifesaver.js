var audio = require('../audio');

module.exports = function (lives) {
  function effect (player, pow) {
    player.addLevel(lives);
    audio.play('lifesaver');
  }

  effect.words = ['LIFE!', 'Saver.'];

  return effect;
};
