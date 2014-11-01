var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');

module.exports = function (you) {
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: rookie, level: 1 });
  npc(you, { ai: rookie });
  powerup(you, { effect: rainstorm(1) });
};
