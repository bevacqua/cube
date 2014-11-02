var mobs = require('./mobs');
var bullet = require('./bullet');
var emitter = require('./emitter');
var us = require('./us');
var lastbullet = Date.now();
var bulletrate = 300;
var screenmargin = 30;
var lastId = 0;

function r () { return Math.random(); }

function mob (node, options) {
  var o = options || {};
  var speed = o.speed || 0.3;
  var topspeed = o.topspeed || 4;
  var accel = {
    x: o.accel && o.accel.x || 0, y: o.accel && o.accel.y || 0
  };
  var d = {
    x: 0, y: 0
  };
  var ltype;
  var me = {
    id: lastId++,
    type: o.type,
    node: node,
    move: move,
    level: o.level || 0,
    set: set,
    cd: cd,
    fire: fire,
    placement: placement,
    damage: damage,
    remove: remove,
    accel: accel,
    d: d,
    kia: false,
    setLevel: setLevel,
    addLevel: addLevel
  };

  setLevel(me.level);

  mobs.push(me);

  function f (v, d) { return v * (speed + accel[d]); }
  function sane (v, max) {
    return Math.min(Math.max(v, screenmargin), max - screenmargin);
  }

  function move (ox, oy) {
    var c = node[0];
    var s = window.getComputedStyle(c);
    var x = us.u(s.left) + f(ox, 'x');
    var y = us.u(s.top) + f(oy, 'y');
    var sx = me.gunner ? x : sane(x, innerWidth);
    var sy = me.gunner ? y : sane(y, innerHeight);
    c.style.left = us.p(sx);
    c.style.top = us.p(sy);
    me.d.x = ox;
    me.d.y = oy;
    accelerate('x', ox);
    accelerate('y', oy);
    hits(s);
    return x === sx && y === sy;
  }

  function hits (computed) {
    var s = computed || window.getComputedStyle(node[0]);
    me.hitbox = { // 10% hitbox
      x: us.u(s.left) * 0.9,
      y: us.u(s.top) * 0.9,
      w: us.u(s.width) * 1.1,
      h: us.u(s.height) * 1.1
    };
  }

  function accelerate (d, m) {
    accel[d] += m ? 0.2 : -0.65;
    accel[d] = Math.max(Math.min(topspeed, accel[d]), 0);
  }

  function notMe (m) {
    return m !== me;
  }

  function notMyBullet (m) {
    return m.gunner !== me;
  }

  function notMyGunner (m) {
    return m !== me.gunner;
  }

  function notSameGunner (m) {
    return !m.gunner || !me.gunner || m.gunner !== me.gunner;
  }

  function collision (m) {
    var l = me.hitbox;
    var r = m.hitbox;
    var b = l && r;
    if (!b) {
      return false;
    }
    var lxb = l.x >= r.x && l.x < r.x + r.w;
    var rxb = r.x >= l.x && r.x < l.x + l.w;
    var lyb = l.y >= r.y && l.y < r.y + r.h;
    var ryb = r.y >= l.y && r.y < l.y + l.h;
    return (lxb || rxb) && (lyb || ryb);
  }

  function cd () {
    return mobs.filter(notMe).filter(notMyBullet).filter(notMyGunner).filter(notSameGunner).filter(collision);
  }

  function set (x, y) {
    var c = node[0];
    c.style.left = us.pc(x, innerWidth);
    c.style.top = us.pc(y, innerHeight);
    hits();
  }

  function placement () {
    var attempts = 0;
    var x = r() * 100;
    var y = r() * 100;
    set(x, y);

    if (++attempts < 5 && cd().length > 0) {
      placement();
    }
  }

  function fire () {
    if (Date.now() - lastbullet > bulletrate) {
      lastbullet = Date.now();
      bullet(me, { level: me.level });
    }
  }

  function remove () {
    if (me.kia) { // sanity
      return;
    }
    me.kia = true;
    node.remove();
    mobs.splice(mobs.indexOf(me), 1);
    emitter.emit('mob.remove', me);
  }

  function lv (l) {
    return me.type + '-' + l;
  }

  function setLevel (l) {
    me.node.find('.pc-cube').removeClass(lv(me.level)).addClass(lv(l));
    me.level = l;
    emitter.emit('mob.levelchange', me, l);
  }

  function addLevel (l, m) {
    setLevel(Math.min(me.level + l, m || Infinity));
  }

  function damage (l) {
    var lv = l || 1;
    if (me.level > lv - 1) {
      setLevel(me.level - lv);
      emitter.emit('mob.leveldown', me, me.level);
    } else {
      remove();
    }
  }

  return me;
}

module.exports = mob;
