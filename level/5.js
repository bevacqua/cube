var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var machinegun = require('../ai/machinegun');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};
