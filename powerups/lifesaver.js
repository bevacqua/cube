module.exports = function (lives) {
  function effect (player, pow) {
    player.addLevel(lives);
  }

  effect.words = ['LIFE!', 'Saver.'];

  return effect;
};
