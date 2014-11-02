var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');
var machinegun = require('../ai/machinegun');
var growingpain = require('../ai/growingpain');

module.exports = function (you) {
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: growingpain, level: 3 }).node.addClass('npc-disc');
  npc(you, { ai: rookie, level: 1 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  powerup(you, { effect: rainstorm(1) });
};
