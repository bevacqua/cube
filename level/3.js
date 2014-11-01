var npc = require('../npc');
var rookie = require('../ai/rookie');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie });
};
