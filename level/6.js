var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');

module.exports = function (you) {
  you.addLevel(1, 2);
  npc(you, { ai: aimer, level: 6 }).node.addClass('npc-boss');
};
