var npc = require('../npc');
var rookie = require('../ai/rookie');
var unescapable = require('../ai/unescapable');
var powerup = require('../powerup');
var bulletrain = require('../powerups/bulletrain');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-funk');
  npc(you, { ai: unescapable });
  powerup(you, { effect: bulletrain(1) });
};
