var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var growingpain = require('../ai/growingpain');
var powerup = require('../powerup');
var bulletrain = require('../powerups/bulletrain');

module.exports = function (you) {
  you.addLevel(1);
  powerup(you, { effect: bulletrain(1) });
  powerup(you, { effect: bulletrain(2) });
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie });
  npc(you, { ai: aimer });
  npc(you, { ai: growingpain, level: 1 }).node.addClass('npc-mass');;
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
};
