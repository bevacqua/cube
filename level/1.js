var npc = require('../npc');

module.exports = function (you) {
  npc(you).node.addClass('npc-disc');
  npc(you).node.addClass('npc-funk');
  npc(you);
};
