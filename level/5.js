var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};
