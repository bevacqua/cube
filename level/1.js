var npc = require('../npc');
var rookie = require('../ai/rookie');
var powerup = require('../powerup');
var bulletrain = require('../powerups/bulletrain');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-funk');
  npc(you, { ai: rookie });
  powerup(you, { effect: bulletrain(1) });
};
