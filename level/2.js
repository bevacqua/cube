var npc = require('../npc');
var rookie = require('../ai/rookie');
var machinegun = require('../ai/machinegun');
var growingpain = require('../ai/growingpain');
var growatog = require('../enchantments/growatog');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: growingpain, level: 1 }).node.addClass('npc-mass');
  npc(you, { ai: machinegun });
  powerup(you);
};

module.exports.enchantments = [
  growatog(2)
];
