var $ = require('dominus');
var incubate = require('./incubate');
var bullets = require('./bullets');
var emitter = require('./emitter');
var us = require('./us');

function r () { return Math.random(); }
function rstale () { var v = r(); return v > 0.66 ? -1 : v > 0.33 ? 1 : 0; }

function bullet (source, options) {
  var o = options || {};
  var level = o.level || 0;
  var mob = require('./mob');
  var body = $(document.body);
  var s = getComputedStyle(source.node[0]);
  var node = incubate();
  node[0].style.top = s.top;
  node[0].style.left = s.left;
  var ts = 12;
  var dx = source.d.x;
  var dy = source.d.y;
  var cube = node.find('.pc-cube').addClass('pc-show');
  if (o.aim) {
    var a = getComputedStyle(node[0]);
    var b = getComputedStyle(o.aim.node[0]);
    var x = us.u(b.left) - us.u(a.left);
    var y = us.u(b.top) - us.u(a.top);
    dx = Math.abs(x) > 40 ? x : 0;
    dy = Math.abs(y) > 40 ? y : 0;
  } else if (dx === 0 && dy === 0) {
    dx = rstale();
    dy = rstale();
    if (dx === 0 && dy === 0) {
      dx = rstale();
      dy = dx === 0 ? 1 : rstale();
    }
  }
  var m = mob(node, {
    type: 'bullet',
    level: level,
    topspeed: ts,
    accel: {
      x: Math.abs(dx) * ts,
      y: Math.abs(dy) * ts
    }
  });
  var me = {
    remove: remove,
    node: node,
    mob: m,
    v: {
      x: Math.sign(dx),
      y: Math.sign(dy)
    }
  };
  m.gunner = source;

  function smooth () {
    cube.addClass('pc-smooth');
  }

  emitter.on('mob.remove', function (who) {
    if (who === m) {
      bullets.splice(bullets.indexOf(me), 1);
    }
  });

  function remove () {
    m.remove();
  }

  setTimeout(smooth, 0);
  setTimeout(remove, 2400);

  bullets.push(me);

  return me;
}


module.exports = bullet;
