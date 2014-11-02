var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var growingpain = require('../ai/growingpain');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie });
  npc(you, { ai: aimer });
  npc(you, { ai: growingpain, level: 1 }).node.addClass('npc-mass');;
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
};
