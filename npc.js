var $ = require('dominus');
var incubate = require('./incubate');
var npcs = require('./npcs');
var mob = require('./mob');
var emitter = require('./emitter');
var body = $(document.body);
var baboon = require('./ai/baboon');

function npc (enemy, options) {
  var o = options || {};
  var level = o.level || 0;
  var node = incubate().attr('id', '');
  var m = mob(node, { level: level, type: 'npc' });
  var me = {
    node: node,
    mob: m
  };
  node.find('.pc-cube').addClass('pc-smooth pc-show');
  m.npc = me;
  m.placement();

  emitter.on('mob.remove', function (who) {
    if (who === m) {
      npcs.splice(npcs.indexOf(me), 1);
      emitter.emit('npc.kill', npcs.length === 0);
    }
  });

  (o.ai || baboon)(me, enemy);
  npcs.push(me);

  return me;
}

module.exports = npc;
