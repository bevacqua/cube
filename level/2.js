var npc = require('../npc');
var rookie = require('../ai/rookie');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you).node.addClass('npc-disc');
  npc(you).node.addClass('npc-disc');
  npc(you).node.addClass('npc-funk');
  npc(you, { ai: rookie });
  powerup(you);
};
