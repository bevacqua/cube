var $ = require('dominus');
var npcs = require('./npcs');
var mob = require('./mob');
var emitter = require('./emitter');
var body = $(document.body);
var baboon = require('./ai/baboon');

function r () { return Math.random(); }

function npc (enemy, options) {
  var o = options || {};
  var level = o.level || 0;
  var node = enemy.node.clone().appendTo(body).attr('id', '');
  var m = mob(node, { level: level, type: 'npc' });
  var me = {
    node: node,
    mob: m
  };
  m.npc = me;
  node.find('.pc-cube').addClass('pc-smooth pc-show');

  if (enemy.cd().length === 0) {
    m.placement(); // as good as dead!
  }

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
