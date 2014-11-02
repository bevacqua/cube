var $ = require('dominus');
var incubate = require('./incubate');
var pows = require('./powerups');
var mob = require('./mob');
var us = require('./us');
var emitter = require('./emitter');
var body = $(document.body);
var lifesaver = require('./powerups/lifesaver');

function pow (player, options) {
  var o = options || {};
  var level = o.level || 0;
  var node = incubate();
  var m = mob(node, { level: level, type: 'pow' });
  var me = {
    node: node,
    mob: m
  };
  var effect = o.effect || lifesaver(1);
  node.find('.pc-cube').addClass('pc-smooth pc-show');
  m.pow = me;
  m.placement();

  emitter.on('mob.remove', function rm (who) {
    if (who === m) {
      emitter.off('mob.remove', rm);
      pows.splice(pows.indexOf(me), 1);
      if (me.cleanup !== true) {
        effect(player, me);
        emitter.emit('pow.use', m.level);
      }
    }
  });

  function wordup (face) {
    face.innerText = us.r(effect.words);
  }

  node.find('.pc-face').forEach(wordup);
  pows.push(me);

  return me;
}

module.exports = pow;
