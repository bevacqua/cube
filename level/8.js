var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');
var chaosbringer = require('../powerups/chaosbringer');

module.exports = function (you) {
  you.addLevel(1);
  powerup(you, { effect: rainstorm(2) });
  powerup(you, { effect: rainstorm(2) });
  powerup(you, { effect: chaosbringer(2) });
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer }).node.addClass('npc-mass');
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};
