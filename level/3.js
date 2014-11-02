var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
};
