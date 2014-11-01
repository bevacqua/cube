var npc = require('../npc');

module.exports = function (you) {
  npc(you).node.addClass('npc-disc');
};
