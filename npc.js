var $ = require('dominus');
var incubate = require('./incubate');
var npcs = require('./npcs');
var mob = require('./mob');
var audio = require('./audio');
var emitter = require('./emitter');
var body = $(document.body);
var baboon = require('./ai/baboon');

emitter.on('mob.levelchange', function (who, l, old) {
  if (who.npc) {
    if (l > old) {
      audio.play('npc-grow');
    } else if (l < old) {
      audio.play('npc-shrink');
    }
  }
});

function npc (enemy, options) {
  var o = options || {};
  var level = o.level || 0;
  var node = incubate();
  var m = mob(node, { level: level, type: 'npc' });
  var me = {
    node: node,
    mob: m
  };
  var largestLevel = level;
  var metrics = $('<div>').addClass('npc-metrics');
  var lifebar = $('<div>').addClass('npc-life').appendTo(metrics);
  node.find('.pc-cube').addClass('pc-smooth pc-show');
  node.append(metrics);
  m.npc = me;
  m.placement();

  emitter.on('mob.remove', function rm (who) {
    if (who === m) {
      emitter.off('mob.remove', rm);
      npcs.splice(npcs.indexOf(me), 1);
      audio.play('npc-die');
      if (m.clear !== true) {
        emitter.emit('npc.kill', npcs.length === 0, m.level);
      }
    }
  });

  (o.ai || baboon)(me, enemy);
  npcs.push(me);

  return me;
}

module.exports = npc;
