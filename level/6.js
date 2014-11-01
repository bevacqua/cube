var npc = require('../npc');
var powerup = require('../powerup');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');

module.exports = function (you) {
  you.addLevel(1, 2);
  powerup(you);
  npc(you, { ai: aimer, level: 6 }).node.addClass('npc-boss');
};
