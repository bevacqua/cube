var npc = require('../npc');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you).node.addClass('npc-disc');
  powerup(you);
};
