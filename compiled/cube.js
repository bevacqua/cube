(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.once = noop;
process.off = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],2:[function(require,module,exports){
var throttle = require('lodash.throttle');
var bullet = require('../bullet');

function r () { return Math.random(); }
function rs () { return Math.sign(r() - 0.5); }

module.exports = function (npc, enemy) {
  var mob = npc.mob;
  var intelligence = 0.3;
  var goal = 700;
  var idle = 0;
  var d;
  var redirect = throttle(changeDirection, 300 + r() * 600);
  var shootrate = 700;
  var lastShooting = Date.now() + shootrate;

  function changeDirection () {
    d = { x: rs(), y: rs() };
  }

  function think () {
    if (idle > goal) {
      redirect();
      idle = 0;
    } else {
      idle += r() * 100 * intelligence;
    }
    var perfect = mob.move(d.x, d.y);
    if (perfect === false) {
      redirect();
    }
    var now = Date.now();
    if (now - lastShooting > shootrate) {
      bullet(mob, { level: 1, aim: enemy });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../bullet":6,"lodash.throttle":38}],3:[function(require,module,exports){
var throttle = require('lodash.throttle');

function r () { return Math.random(); }
function rs () { return Math.sign(r() - 0.5); }

module.exports = function (npc) {
  var mob = npc.mob;
  var intelligence = 0.3;
  var goal = 700;
  var idle = 0;
  var d;
  var redirect = throttle(changeDirection, 300 + r() * 1000);

  function changeDirection () {
    d = { x: rs(), y: rs() };
  }

  function think () {
    if (idle > goal) {
      redirect();
      idle = 0;
    } else {
      idle += r() * 100 * intelligence;
    }
    var perfect = mob.move(d.x, d.y);
    if (perfect === false) {
      redirect();
    }
  }

  redirect();
  npc.think = think;
};

},{"lodash.throttle":38}],4:[function(require,module,exports){
var throttle = require('lodash.throttle');
var bullet = require('../bullet');

function r () { return Math.random(); }
function rs () { return Math.sign(r() - 0.5); }

module.exports = function (npc, enemy) {
  var mob = npc.mob;
  var intelligence = 0.3;
  var goal = 700;
  var idle = 0;
  var d;
  var redirect = throttle(changeDirection, 50 + r() * 200);
  var shootrate = 20;
  var lastShooting = Date.now() + shootrate;

  function changeDirection () {
    d = { x: rs(), y: rs() };
  }

  function think () {
    if (idle > goal) {
      redirect();
      idle = 0;
    } else {
      idle += r() * 100 * intelligence;
    }
    var perfect = mob.move(d.x, d.y);
    if (perfect === false) {
      redirect();
    }
    var now = Date.now();
    if (now - lastShooting > shootrate) {
      bullet(mob, { level: 1, aim: enemy });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../bullet":6,"lodash.throttle":38}],5:[function(require,module,exports){
var throttle = require('lodash.throttle');
var bullet = require('../bullet');

function r () { return Math.random(); }
function rs () { return Math.sign(r() - 0.5); }

module.exports = function (npc) {
  var mob = npc.mob;
  var intelligence = 0.3;
  var goal = 700;
  var idle = 0;
  var d;
  var redirect = throttle(changeDirection, 300 + r() * 300);
  var shootrate = 300;
  var lastShooting = Date.now() + shootrate;

  function changeDirection () {
    d = { x: rs(), y: rs() };
  }

  function think () {
    if (idle > goal) {
      redirect();
      idle = 0;
    } else {
      idle += r() * 100 * intelligence;
    }
    var perfect = mob.move(d.x, d.y);
    if (perfect === false) {
      redirect();
    }
    var now = Date.now();
    if (now - lastShooting > shootrate) {
      bullet(mob, { level: 1 });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../bullet":6,"lodash.throttle":38}],6:[function(require,module,exports){
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

},{"./bullets":7,"./emitter":9,"./incubate":10,"./mob":21,"./us":53,"dominus":33}],7:[function(require,module,exports){
var bullets = [];

function tick () {
  bullets.forEach(function (bullet) {
    if (bullet.boot) {
      bullet.mob.move(bullet.v.x, bullet.v.y);
      bullet.mob.cd().forEach(damage);
    } else {
      setTimeout(boot, 0);
    }

    function boot () {
      bullet.boot = true;
    }

    function damage (target) {
      target.damage(bullet.level);
      bullet.remove();
    }
  });
}

module.exports = bullets;

bullets.tick = tick;

},{}],8:[function(require,module,exports){
(function (global){
var $ = require('dominus');

global.$ = $;
global.cube = {};

var mob = require('./mob');
var mobs = require('./mobs');
var npc = require('./npc');
var npcs = require('./npcs');
var pows = require('./powerups');
var bullets = require('./bullets');
var levels = require('./levels');
var emitter = require('./emitter');
var incubate = require('./incubate');
var body = $(document.body);
var yourCube;
var yourCubeInternal;
var you;
var flashing;
var keys;
var SPACE = 32;
var LEFT = 37;
var TOP = 38;
var RIGHT = 39;
var BOTTOM = 40;
var R = 82;

console.log('%cWelcome to Pony Cube! Use the arrow keys.', 'font-family: "Merriweather"; font-size: 60px; color: #e92c6c;');

incubateCube();
body.on('click', welcome);
body.on('keydown', welcoming);
body.on('keydown', specials);

function welcoming (e) {
  if (e.which === SPACE) {
    welcome();
  }
}

function specials (e) {
  if (e.which === R) {
    gameover('OK. TRY AGAIN!');
  }
}

function incubateCube () {
  yourCube = incubate().addClass('the-man');
  yourCubeInternal = yourCube.find('.pc-cube');
}

function welcome () {
  if (flashing) {
    $('#welcome-two').remove();
    body.removeClass('flashy');
    start();
    return true;
  } else {
    $('#welcome-one').remove();
    body.removeClass('welcome');
    body.addClass('flashy');
    flashing = true;
  }
}

function start () {
  keys = {};
  you = mob(yourCube, { type: 'you' });
  emitter.emit('player.start', you);
  global.cube.you = you;
  emitter.on('mob.leveldown', leveldown);
  emitter.on('levels.win', won);
  yourCubeInternal.addClass('pc-show');
  body.off('click', welcome);
  body.off('keydown', welcoming);
  body.on('keydown', kd);
  body.on('keyup', ku);
  gameloop();
  levels(you);
}

function leveldown (m, level) {
  if (m === you) {
    emitter.emit('player.death', level);
    you.placement();
    body.addClass('deathflash');
    setTimeout(function () {
      body.removeClass('deathflash');
    }, 400);
  }
}

function kd (e) { keys[e.which] = true; }
function ku (e) { keys[e.which] = false; }
function noPows (m) { return !m.pow; }
function onlyPows (m) { return !!m.pow; }
function usePow (m) { m.remove(); }
function gameloop () {
  var l = keys[LEFT];
  var t = keys[TOP];
  var r = keys[RIGHT];
  var b = keys[BOTTOM];
  var u = keys[SPACE];
  if (l && r) { l = r = false; }
  if (t && b) { t = b = false; }
  you.move(l ? -1 : (r ? 1 : 0), t ? -1 : (b ? 1 : 0));
  npcs.tick();
  bullets.tick();
  var cd = you.cd();
  var cdNoPows = cd.filter(noPows);
  cd.filter(onlyPows).forEach(usePow);
  if (you.kia || cdNoPows.length) {
    cdNoPows.forEach(function (m) {
      you.damage(m.level);
    });
    if (you.kia) {
      gameover('YOU\'RE VERY MUCH DEAD WOW~!'); return;
    }
  }
  if (u) {
    you.fire();
  }
  requestAnimationFrame(gameloop);
}

function gameover (message, classes) {
  emitter.off('levels.win', won);
  $('.rt-tint').addClass(['rt-show'].concat(classes || []).join(' '));
  $('.rt-text').text(message);
  cleanup();
  console.log('%c%s', 'font-family: "Comic Sans MS"; font-size: 25px; color: #d11911;', message);

  setTimeout(function () {
    body.on('keydown', restart);
  }, 500);
}

function cleanup () {
  yourCubeInternal.removeClass('pc-show');
  body.off('keyup', ku);
  body.off('keydown', kd);
  npcs.clear();
  pows.clear();
  mobs.splice(0, mobs.length);
}

function won () {
  gameover('ZOMG YOU WON!', ['rt-won']);
}

function restart (e) {
  if (e.which === SPACE) {
    body.off('keydown', restart);
    yourCube.remove();
    incubateCube();
    $('.rt-tint').removeClass('rt-show');
    setTimeout(start, 1000);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./bullets":7,"./emitter":9,"./incubate":10,"./levels":20,"./mob":21,"./mobs":22,"./npc":45,"./npcs":46,"./powerups":48,"dominus":33}],9:[function(require,module,exports){
var emitter = require('contra.emitter');

module.exports = emitter();

},{"contra.emitter":23}],10:[function(require,module,exports){
var $ = require('dominus');
var incubator = $('#you');
var body = $(document.body);

function incubate () {
  var cube = incubator.clone().appendTo(body);
  cube[0].removeAttribute('id');
  cube.find('.pc-cube').addClass('pc-smooth');
  return cube;
}


module.exports = incubate;

},{"dominus":33}],11:[function(require,module,exports){
var npc = require('../npc');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you).node.addClass('npc-disc');
  powerup(you);
};

},{"../npc":45,"../powerup":47}],12:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-funk');
  npc(you, { ai: rookie });
};

},{"../ai/rookie":5,"../npc":45}],13:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var machinegun = require('../ai/machinegun');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-funk');
  npc(you, { ai: machinegun });
  powerup(you);
};

},{"../ai/machinegun":4,"../ai/rookie":5,"../npc":45,"../powerup":47}],14:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer });
};

},{"../ai/aimer":2,"../ai/rookie":5,"../npc":45}],15:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');
var machinegun = require('../ai/machinegun');

module.exports = function (you) {
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: rookie, level: 1 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  powerup(you, { effect: rainstorm(1) });
};

},{"../ai/aimer":2,"../ai/machinegun":4,"../ai/rookie":5,"../npc":45,"../powerup":47,"../powerups/rainstorm":51}],16:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var machinegun = require('../ai/machinegun');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};

},{"../ai/aimer":2,"../ai/machinegun":4,"../ai/rookie":5,"../npc":45}],17:[function(require,module,exports){
var npc = require('../npc');
var powerup = require('../powerup');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var machinegun = require('../ai/machinegun');

module.exports = function (you) {
  you.addLevel(1, 2);
  powerup(you);
  npc(you, { ai: aimer, level: 6 }).node.addClass('npc-boss');
};

},{"../ai/aimer":2,"../ai/machinegun":4,"../ai/rookie":5,"../npc":45,"../powerup":47}],18:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var machinegun = require('../ai/machinegun');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');

module.exports = function (you) {
  you.addLevel(1);
  powerup(you, { effect: rainstorm(3) });
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: aimer });
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};

},{"../ai/aimer":2,"../ai/machinegun":4,"../ai/rookie":5,"../npc":45,"../powerup":47,"../powerups/rainstorm":51}],19:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');
var chaosbringer = require('../powerups/chaosbringer');

module.exports = function (you) {
  you.addLevel(1);
  powerup(you, { effect: rainstorm(2) });
  powerup(you, { effect: rainstorm(2) });
  powerup(you, { effect: chaosbringer(2) });
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer }).node.addClass('npc-mass');
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};

},{"../ai/aimer":2,"../ai/rookie":5,"../npc":45,"../powerup":47,"../powerups/chaosbringer":49,"../powerups/rainstorm":51}],20:[function(require,module,exports){
var $ = require('dominus');
var pows = require('./powerups');
var npcs = require('./npcs');
var npc = require('./npc');
var scoreboard = require('./scoreboard');
var emitter = require('./emitter');
var listeners = [];

function once (fn) {
  var discarded;
  return function () {
    if (discarded) {
      return;
    }
    discarded = true;
    return fn.apply(null, arguments);
  };
}

module.exports = function (you) {
  var level = 0;
  var levels = {
    0: once(require('./level/0')),
    1: once(require('./level/1')),
    2: once(require('./level/2')),
    3: once(require('./level/3')),
    4: once(require('./level/4')),
    5: once(require('./level/5')),
    6: once(require('./level/6')),
    7: once(require('./level/7')),
    8: once(require('./level/8')),
  };

  listeners.forEach(function (listener) {
    emitter.off('npc.kill', listener);
  });
  listeners.push(npcKill);
  emitter.on('npc.kill', npcKill);
  scoreboard.reset(you);
  reset();

  function npcKill (cleared) {
    var next = level + 1;
    if (cleared) {
      if (levels[next]) {
        ++level;
        console.log('%cLEVEL %s CLEAR WOW~!', 'font-family: "Cardo"; font-size: 25px; color: #ffd2d2;', next);
        setTimeout(reset, 600);
      } else {
        console.log('%cLEVEL %s CLEAR ZOMG SUCH GAMER~!', 'font-family: "Cardo"; font-size: 25px; color: #a4d4e6;', next);
        setTimeout(won, 600);
      }
    }
  }

  function reset () {
    emitter.emit('levels.change', level);
    scoreboard.add(level * 15);
    you.set(50, 50);
    if (levels[level]) {
      npcs.clear();
      pows.clear();
      $('.pc-parent').but('#you, .the-man').remove();
      levels[level](you);
    }
  }

  function won () {
    emitter.emit('levels.win');
  }
};

},{"./emitter":9,"./level/0":11,"./level/1":12,"./level/2":13,"./level/3":14,"./level/4":15,"./level/5":16,"./level/6":17,"./level/7":18,"./level/8":19,"./npc":45,"./npcs":46,"./powerups":48,"./scoreboard":52,"dominus":33}],21:[function(require,module,exports){
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
      bullet(me);
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

},{"./bullet":6,"./emitter":9,"./mobs":22,"./us":53}],22:[function(require,module,exports){
(function (global){
var mobs = [];

module.exports = global.cube.mob = mobs;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],23:[function(require,module,exports){
module.exports = require('./src/contra.emitter.js');

},{"./src/contra.emitter.js":24}],24:[function(require,module,exports){
(function (process){
(function (root, undefined) {
  'use strict';

  var undef = '' + undefined;
  function atoa (a, n) { return Array.prototype.slice.call(a, n); }
  function debounce (fn, args, ctx) { if (!fn) { return; } tick(function run () { fn.apply(ctx || null, args || []); }); }

  // cross-platform ticker
  var si = typeof setImmediate === 'function', tick;
  if (si) {
    tick = function (fn) { setImmediate(fn); };
  } else if (typeof process !== undef && process.nextTick) {
    tick = process.nextTick;
  } else {
    tick = function (fn) { setTimeout(fn, 0); };
  }

  function _emitter (thing, options) {
    var opts = options || {};
    var evt = {};
    if (thing === undefined) { thing = {}; }
    thing.on = function (type, fn) {
      if (!evt[type]) {
        evt[type] = [fn];
      } else {
        evt[type].push(fn);
      }
      return thing;
    };
    thing.once = function (type, fn) {
      fn._once = true; // thing.off(fn) still works!
      thing.on(type, fn);
      return thing;
    };
    thing.off = function (type, fn) {
      var c = arguments.length;
      if (c === 1) {
        delete evt[type];
      } else if (c === 0) {
        evt = {};
      } else {
        var et = evt[type];
        if (!et) { return thing; }
        et.splice(et.indexOf(fn), 1);
      }
      return thing;
    };
    thing.emit = function () {
      var ctx = this;
      var args = atoa(arguments);
      var type = args.shift();
      var et = evt[type];
      if (type === 'error' && opts.throws !== false && !et) { throw args.length === 1 ? args[0] : args; }
      if (!et) { return thing; }
      evt[type] = et.filter(function emitter (listen) {
        if (opts.async) { debounce(listen, args, ctx); } else { listen.apply(ctx, args); }
        return !listen._once;
      });
      return thing;
    };
    return thing;
  }

  // cross-platform export
  if (typeof module !== undef && module.exports) {
    module.exports = _emitter;
  } else {
    root.contra = root.contra || {};
    root.contra.emitter = _emitter;
  }
})(this);

}).call(this,require("/Users/nico/.nvm/v0.10.26/lib/node_modules/watchify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/Users/nico/.nvm/v0.10.26/lib/node_modules/watchify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":1}],25:[function(require,module,exports){
var poser = require('./src/node');

module.exports = poser;

['Array', 'Function', 'Object', 'Date', 'String'].forEach(pose);

function pose (type) {
  poser[type] = function poseComputedType () { return poser(type); };
}

},{"./src/node":26}],26:[function(require,module,exports){
(function (global){
'use strict';

var d = global.document;

function poser (type) {
  var iframe = d.createElement('iframe');

  iframe.style.display = 'none';
  d.body.appendChild(iframe);

  return map(type, iframe.contentWindow);
}

function map (type, source) { // forward polyfills to the stolen reference!
  var original = window[type].prototype;
  var value = source[type];
  var prop;

  for (prop in original) {
    value.prototype[prop] = original[prop];
  }

  return value;
}

module.exports = poser;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (global){
'use strict';

var expando = 'sektor-' + Date.now();
var rsiblings = /[+~]/;
var document = global.document;
var del = document.documentElement;
var match = del.matches ||
            del.webkitMatchesSelector ||
            del.mozMatchesSelector ||
            del.oMatchesSelector ||
            del.msMatchesSelector;

function qsa (selector, context) {
  var existed, id, prefix, prefixed, adapter, hack = context !== document;
  if (hack) { // id hack for context-rooted queries
    existed = context.getAttribute('id');
    id = existed || expando;
    prefix = '#' + id + ' ';
    prefixed = prefix + selector.replace(/,/g, ',' + prefix);
    adapter = rsiblings.test(selector) && context.parentNode;
    if (!existed) { context.setAttribute('id', id); }
  }
  try {
    return (adapter || context).querySelectorAll(prefixed || selector);
  } catch (e) {
    return [];
  } finally {
    if (existed === null) { context.removeAttribute('id'); }
  }
}

function find (selector, ctx, collection, seed) {
  var element;
  var context = ctx || document;
  var results = collection || [];
  var i = 0;
  if (typeof selector !== 'string') {
    return results;
  }
  if (context.nodeType !== 1 && context.nodeType !== 9) {
    return []; // bail if context is not an element or document
  }
  if (seed) {
    while ((element = seed[i++])) {
      if (matchesSelector(element, selector)) {
        results.push(element);
      }
    }
  } else {
    results.push.apply(results, qsa(selector, context));
  }
  return results;
}

function matches (selector, elements) {
  return find(selector, null, null, elements);
}

function matchesSelector (element, selector) {
  return match.call(element, selector);
}

module.exports = find;

find.matches = matches;
find.matchesSelector = matchesSelector;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
'use strict';

var poser = require('poser');
var Dominus = poser.Array();

module.exports = Dominus;

},{"poser":25}],29:[function(require,module,exports){
'use strict';

var $ = require('./public');
var core = require('./core');
var dom = require('./dom');
var classes = require('./classes');
var Dominus = require('./Dominus.ctor');

function equals (selector) {
  return function equals (elem) {
    return dom.matches(elem, selector);
  };
}

function straight (prop, one) {
  return function domMapping (selector) {
    var result = this.map(function (elem) {
      return dom[prop](elem, selector);
    });
    var results = core.flatten(result);
    return one ? results[0] : results;
  };
}

Dominus.prototype.prev = straight('prev');
Dominus.prototype.next = straight('next');
Dominus.prototype.parent = straight('parent');
Dominus.prototype.parents = straight('parents');
Dominus.prototype.children = straight('children');
Dominus.prototype.find = straight('qsa');
Dominus.prototype.findOne = straight('qs', true);

Dominus.prototype.where = function (selector) {
  return this.filter(equals(selector));
};

Dominus.prototype.is = function (selector) {
  return this.some(equals(selector));
};

Dominus.prototype.i = function (index) {
  return new Dominus(this[index]);
};

function compareFactory (fn) {
  return function compare () {
    $.apply(null, arguments).forEach(fn, this);
    return this;
  };
}

Dominus.prototype.and = compareFactory(function addOne (elem) {
  if (this.indexOf(elem) === -1) {
    this.push(elem);
  }
  return this;
});

Dominus.prototype.but = compareFactory(function addOne (elem) {
  var index = this.indexOf(elem);
  if (index !== -1) {
    this.splice(index, 1);
  }
  return this;
});

Dominus.prototype.on = function (types, filter, fn) {
  this.forEach(function (elem) {
    types.split(' ').forEach(function (type) {
      dom.on(elem, type, filter, fn);
    });
  });
  return this;
};

Dominus.prototype.off = function (types, filter, fn) {
  this.forEach(function (elem) {
    types.split(' ').forEach(function (type) {
      dom.off(elem, type, filter, fn);
    });
  });
  return this;
};

[
  ['addClass', classes.add],
  ['removeClass', classes.remove],
  ['setClass', classes.set],
  ['removeClass', classes.remove],
  ['remove', dom.remove]
].forEach(mapMethods);

function mapMethods (data) {
  Dominus.prototype[data[0]] = function (value) {
    this.forEach(function (elem) {
      data[1](elem, value);
    });
    return this;
  };
}

[
  ['append', dom.append],
  ['appendTo', dom.appendTo],
  ['prepend', dom.prepend],
  ['prependTo', dom.prependTo],
  ['before', dom.before],
  ['beforeOf', dom.beforeOf],
  ['after', dom.after],
  ['afterOf', dom.afterOf],
  ['show', dom.show],
  ['hide', dom.hide]
].forEach(mapManipulation);

function mapManipulation (data) {
  Dominus.prototype[data[0]] = function (value) {
    data[1](this, value);
    return this;
  };
}

Dominus.prototype.hasClass = function (value) {
  return this.some(function (elem) {
    return classes.contains(elem, value);
  });
};

Dominus.prototype.attr = function (name, value) {
  var getter = arguments.length < 2;
  var result = this.map(function (elem) {
    return getter ? dom.attr(elem, name) : dom.attr(elem, name, value);
  });
  return getter ? result[0] : this;
};

function keyValue (key, value) {
  var getter = arguments.length < 2;
  if (getter) {
    return this.length ? dom[key](this[0]) : '';
  }
  this.forEach(function (elem) {
    dom[key](elem, value);
  });
  return this;
}

function keyValueProperty (prop) {
  Dominus.prototype[prop] = function accessor (value) {
    var getter = arguments.length < 1;
    if (getter) {
      return keyValue.call(this, prop);
    }
    return keyValue.call(this, prop, value);
  };
}

['html', 'text', 'value'].forEach(keyValueProperty);

Dominus.prototype.clone = function () {
  return this.map(function (elem) {
    return dom.clone(elem);
  });
};

module.exports = require('./public');

},{"./Dominus.ctor":28,"./classes":30,"./core":31,"./dom":32,"./public":35}],30:[function(require,module,exports){
'use strict';

var trim = /^\s+|\s+$/g;
var whitespace = /\s+/g;

function interpret (input) {
  return typeof input === 'string' ? input.replace(trim, '').split(whitespace) : input;
}

function classes (node) {
  return node.className.replace(trim, '').split(whitespace);
}

function set (node, input) {
  node.className = interpret(input).join(' ');
}

function add (node, input) {
  var current = remove(node, input);
  var values = interpret(input);
  current.push.apply(current, values);
  set(node, current);
  return current;
}

function remove (node, input) {
  var current = classes(node);
  var values = interpret(input);
  values.forEach(function (value) {
    var i = current.indexOf(value);
    if (i !== -1) {
      current.splice(i, 1);
    }
  });
  set(node, current);
  return current;
}

function contains (node, input) {
  var current = classes(node);
  var values = interpret(input);

  return values.every(function (value) {
    return current.indexOf(value) !== -1;
  });
}

module.exports = {
  add: add,
  remove: remove,
  contains: contains,
  set: set,
  get: classes
};

},{}],31:[function(require,module,exports){
'use strict';

var test = require('./test');
var Dominus = require('./Dominus.ctor');
var proto = Dominus.prototype;

function Applied (args) {
  return Dominus.apply(this, args);
}

Applied.prototype = proto;

['map', 'filter', 'concat'].forEach(ensure);

function ensure (key) {
  var original = proto[key];
  proto[key] = function applied () {
    return apply(original.apply(this, arguments));
  };
}

function apply (a) {
  return new Applied(a);
}

function cast (a) {
  if (a instanceof Dominus) {
    return a;
  }
  if (!a) {
    return new Dominus();
  }
  if (test.isElement(a)) {
    return new Dominus(a);
  }
  if (!test.isArray(a)) {
    return new Dominus();
  }
  return apply(a).filter(function (i) {
    return test.isElement(i);
  });
}

function flatten (a, cache) {
  return a.reduce(function (current, item) {
    if (Dominus.isArray(item)) {
      return flatten(item, current);
    } else if (current.indexOf(item) === -1) {
      return current.concat(item);
    }
    return current;
  }, cache || new Dominus());
}

module.exports = {
  apply: apply,
  cast: cast,
  flatten: flatten
};

},{"./Dominus.ctor":28,"./test":36}],32:[function(require,module,exports){
'use strict';

var sektor = require('sektor');
var Dominus = require('./Dominus.ctor');
var core = require('./core');
var events = require('./events');
var text = require('./text');
var test = require('./test');
var api = module.exports = {};
var delegates = {};

function castContext (context) {
  if (typeof context === 'string') {
    return api.qs(null, context);
  }
  if (test.isElement(context)) {
    return context;
  }
  if (context instanceof Dominus) {
    return context[0];
  }
  return null;
}

api.qsa = function (elem, selector) {
  var results = new Dominus();
  return sektor(selector, castContext(elem), results);
};

api.qs = function (elem, selector) {
  return api.qsa(elem, selector)[0];
};

api.matches = function (elem, selector) {
  return sektor.matchesSelector(elem, selector);
};

function relatedFactory (prop) {
  return function related (elem, selector) {
    var relative = elem[prop];
    if (relative) {
      if (!selector || api.matches(relative, selector)) {
        return core.cast(relative);
      }
    }
    return new Dominus();
  };
}

api.prev = relatedFactory('previousSibling');
api.next = relatedFactory('nextSibling');
api.parent = relatedFactory('parentElement');

function matches (elem, value) {
  if (!value) {
    return true;
  }
  if (value instanceof Dominus) {
    return value.indexOf(elem) !== -1;
  }
  if (test.isElement(value)) {
    return elem === value;
  }
  return api.matches(elem, value);
}

api.parents = function (elem, value) {
  var nodes = [];
  var node = elem;
  while (node.parentElement) {
    if (matches(node.parentElement, value)) {
      nodes.push(node.parentElement);
    }
    node = node.parentElement;
  }
  return core.apply(nodes);
};

api.children = function (elem, value) {
  var nodes = [];
  var children = elem.children;
  var child;
  var i;
  for (i = 0; i < children.length; i++) {
    child = children[i];
    if (matches(child, value)) {
      nodes.push(child);
    }
  }
  return core.apply(nodes);
};

// this method caches delegates so that .off() works seamlessly
function delegate (root, filter, fn) {
  if (delegates[fn._dd]) {
    return delegates[fn._dd];
  }
  fn._dd = Date.now();
  delegates[fn._dd] = delegator;
  function delegator (e) {
    var elem = e.target;
    while (elem && elem !== root) {
      if (api.matches(elem, filter)) {
        fn.apply(this, arguments); return;
      }
      elem = elem.parentElement;
    }
  }
  return delegator;
}

api.on = function (elem, type, filter, fn) {
  if (fn === void 0) {
    events.add(elem, type, filter); // filter _is_ fn
  } else {
    events.add(elem, type, delegate(elem, filter, fn));
  }
};

api.off = function (elem, type, filter, fn) {
  if (fn === void 0) {
    events.remove(elem, type, filter); // filter _is_ fn
  } else {
    events.remove(elem, type, delegate(elem, filter, fn));
  }
};

api.html = function (elem, html) {
  var getter = arguments.length < 2;
  if (getter) {
    return elem.innerHTML;
  } else {
    elem.innerHTML = html;
  }
};

api.text = function (elem, text) {
  var checkable = test.isCheckable(elem);
  var getter = arguments.length < 2;
  if (getter) {
    return checkable ? elem.value : elem.innerText || elem.textContent;
  } else if (checkable) {
    elem.value = text;
  } else {
    elem.innerText = elem.textContent = text;
  }
};

api.value = function (elem, value) {
  var checkable = test.isCheckable(elem);
  var getter = arguments.length < 2;
  if (getter) {
    return checkable ? elem.checked : elem.value;
  } else if (checkable) {
    elem.checked = value;
  } else {
    elem.value = value;
  }
};

api.attr = function (elem, name, value) {
  var getter = arguments.length < 3;
  var camel = text.hyphenToCamel(name);
  if (getter) {
    if (camel in elem) {
      return elem[camel];
    } else {
      return elem.getAttribute(name, value);
    }
  }
  if (camel in elem) {
    elem[camel] = value;
  } else if (value === null || value === void 0) {
    elem.removeAttribute(name);
  } else {
    elem.setAttribute(name, value);
  }
};

api.make = function (type) {
  return new Dominus(document.createElement(type));
};

api.clone = function (elem) {
  return elem.cloneNode(true);
};

api.remove = function (elem) {
  if (elem.parentElement) {
    elem.parentElement.removeChild(elem);
  }
};

api.append = function (elem, target) {
  if (manipulationGuard(elem, target, api.append)) {
    return;
  }
  elem.appendChild(target);
};

api.prepend = function (elem, target) {
  if (manipulationGuard(elem, target, api.prepend)) {
    return;
  }
  elem.insertBefore(target, elem.firstChild);
};

api.before = function (elem, target) {
  if (manipulationGuard(elem, target, api.before)) {
    return;
  }
  if (elem.parentElement) {
    elem.parentElement.insertBefore(target, elem);
  }
};

api.after = function (elem, target) {
  if (manipulationGuard(elem, target, api.after)) {
    return;
  }
  if (elem.parentElement) {
    elem.parentElement.insertBefore(target, elem.nextSibling);
  }
};

function manipulationGuard (elem, target, fn) {
  var right = target instanceof Dominus;
  var left = elem instanceof Dominus;
  if (left) {
    elem.forEach(manipulateMany);
  } else if (right) {
    manipulate(elem, true);
  }
  return left || right;

  function manipulate (elem, precondition) {
    if (right) {
      target.forEach(function (target, j) {
        fn(elem, cloneUnless(target, precondition && j === 0));
      });
    } else {
      fn(elem, cloneUnless(target, precondition));
    }
  }

  function manipulateMany (elem, i) {
    manipulate(elem, i === 0);
  }
}

function cloneUnless (target, condition) {
  return condition ? target : api.clone(target);
}

['appendTo', 'prependTo', 'beforeOf', 'afterOf'].forEach(flip);

function flip (key) {
  var original = key.split(/[A-Z]/)[0];
  api[key] = function (elem, target) {
    api[original](target, elem);
  };
}

api.show = function (elem, should, invert) {
  if (elem instanceof Dominus) {
    elem.forEach(showTest);
  } else {
    showTest(elem);
  }

  function showTest (current) {
    var ok = should === void 0 || should === true || typeof should === 'function' && should.call(current);
    display(current, invert ? !ok : ok);
  }
};

api.hide = function (elem, should) {
  api.show(elem, should, true);
};

function display (elem, should) {
  if (should) {
    elem.style.display = 'block';
  } else {
    elem.style.display = 'none';
  }
}

},{"./Dominus.ctor":28,"./core":31,"./events":34,"./test":36,"./text":37,"sektor":27}],33:[function(require,module,exports){
'use strict';

module.exports = require('./Dominus.prototype');

},{"./Dominus.prototype":29}],34:[function(require,module,exports){
'use strict';

var addEvent = addEventEasy;
var removeEvent = removeEventEasy;
var hardCache = [];

if (!window.addEventListener) {
  addEvent = addEventHard;
}

if (!window.removeEventListener) {
  removeEvent = removeEventHard;
}

function addEventEasy (element, evt, fn) {
  return element.addEventListener(evt, fn);
}

function addEventHard (element, evt, fn) {
  return element.attachEvent('on' + evt, wrap(element, evt, fn));
}

function removeEventEasy (element, evt, fn) {
  return element.removeEventListener(evt, fn);
}

function removeEventHard (element, evt, fn) {
  return element.detachEvent('on' + evt, unwrap(element, evt, fn));
}

function wrapperFactory (element, evt, fn) {
  return function wrapper (originalEvent) {
    var e = originalEvent || window.event;
    e.target = e.target || e.srcElement;
    e.preventDefault  = e.preventDefault  || function preventDefault () { e.returnValue = false; };
    e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
    fn.call(element, e);
  };
}

function wrap (element, evt, fn) {
  var wrapper = unwrap(element, evt, fn) || wrapperFactory(element, evt, fn);
  hardCache.push({
    wrapper: wrapper,
    element: element,
    evt: evt,
    fn: fn
  });
  return wrapper;
}

function unwrap (element, evt, fn) {
  var i = find(element, evt, fn);
  if (i) {
    var wrapper = hardCache[i].wrapper;
    hardCache.splice(i, 1); // free up a tad of memory
    return wrapper;
  }
}

function find (element, evt, fn) {
  var i, item;
  for (i = 0; i < hardCache.length; i++) {
    item = hardCache[i];
    if (item.element === element && item.evt === evt && item.fn === fn) {
      return i;
    }
  }
}

module.exports = {
  add: addEvent,
  remove: removeEvent
};

},{}],35:[function(require,module,exports){
'use strict';

var dom = require('./dom');
var core = require('./core');
var Dominus = require('./Dominus.ctor');
var tag = /^\s*<([a-z]+(?:-[a-z]+)?)\s*\/?>\s*$/i;

function api (selector, context) {
  var notText = typeof selector !== 'string';
  if (notText && arguments.length < 2) {
    return core.cast(selector);
  }
  if (notText) {
    return new Dominus();
  }
  var matches = selector.match(tag);
  if (matches) {
    return dom.make(matches[1]);
  }
  return api.find(selector, context);
}

api.find = function (selector, context) {
  return dom.qsa(context, selector);
};

api.findOne = function (selector, context) {
  return dom.qs(context, selector);
};

module.exports = api;

},{"./Dominus.ctor":28,"./core":31,"./dom":32}],36:[function(require,module,exports){
'use strict';

var nodeObjects = typeof Node === 'object';
var elementObjects = typeof HTMLElement === 'object';

function isNode (o) {
  return nodeObjects ? o instanceof Node : isNodeObject(o);
}

function isNodeObject (o) {
  return o &&
    typeof o === 'object' &&
    typeof o.nodeName === 'string' &&
    typeof o.nodeType === 'number';
}

function isElement (o) {
  return elementObjects ? o instanceof HTMLElement : isElementObject(o);
}

function isElementObject (o) {
  return o &&
    typeof o === 'object' &&
    typeof o.nodeName === 'string' &&
    o.nodeType === 1;
}

function isArray (a) {
  return Object.prototype.toString.call(a) === '[object Array]';
}

function isCheckable (elem) {
  return 'checked' in elem && elem.type === 'radio' || elem.type === 'checkbox';
}

module.exports = {
  isNode: isNode,
  isElement: isElement,
  isArray: isArray,
  isCheckable: isCheckable
};

},{}],37:[function(require,module,exports){
'use strict';

function hyphenToCamel (hyphens) {
  var part = /-([a-z])/g;
  return hyphens.replace(part, function (g, m) {
    return m.toUpperCase();
  });
}

module.exports = {
  hyphenToCamel: hyphenToCamel
};

},{}],38:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var debounce = require('lodash.debounce'),
    isFunction = require('lodash.isfunction'),
    isObject = require('lodash.isobject');

/** Used as an internal `_.debounce` options object */
var debounceOptions = {
  'leading': false,
  'maxWait': 0,
  'trailing': false
};

/**
 * Creates a function that, when executed, will only call the `func` function
 * at most once per every `wait` milliseconds. Provide an options object to
 * indicate that `func` should be invoked on the leading and/or trailing edge
 * of the `wait` timeout. Subsequent calls to the throttled function will
 * return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the throttled function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to throttle.
 * @param {number} wait The number of milliseconds to throttle executions to.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // avoid excessively updating the position while scrolling
 * var throttled = _.throttle(updatePosition, 100);
 * jQuery(window).on('scroll', throttled);
 *
 * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
 * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
 *   'trailing': false
 * }));
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  if (options === false) {
    leading = false;
  } else if (isObject(options)) {
    leading = 'leading' in options ? options.leading : leading;
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  debounceOptions.leading = leading;
  debounceOptions.maxWait = wait;
  debounceOptions.trailing = trailing;

  return debounce(func, wait, debounceOptions);
}

module.exports = throttle;

},{"lodash.debounce":39,"lodash.isfunction":42,"lodash.isobject":43}],39:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isFunction = require('lodash.isfunction'),
    isObject = require('lodash.isobject'),
    now = require('lodash.now');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeMax = Math.max;

/**
 * Creates a function that will delay the execution of `func` until after
 * `wait` milliseconds have elapsed since the last time it was invoked.
 * Provide an options object to indicate that `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
 * to the debounced function will return the result of the last `func` call.
 *
 * Note: If `leading` and `trailing` options are `true` `func` will be called
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to debounce.
 * @param {number} wait The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
 * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * var lazyLayout = _.debounce(calculateLayout, 150);
 * jQuery(window).on('resize', lazyLayout);
 *
 * // execute `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * });
 *
 * // ensure `batchLog` is executed once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * source.addEventListener('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }, false);
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (!isFunction(func)) {
    throw new TypeError;
  }
  wait = nativeMax(0, wait) || 0;
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = options.leading;
    maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
    trailing = 'trailing' in options ? options.trailing : trailing;
  }
  var delayed = function() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0) {
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
      var isCalled = trailingCall;
      maxTimeoutId = timeoutId = trailingCall = undefined;
      if (isCalled) {
        lastCalled = now();
        result = func.apply(thisArg, args);
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
      }
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  };

  var maxDelayed = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (trailing || (maxWait !== wait)) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = null;
      }
    }
  };

  return function() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = null;
    }
    return result;
  };
}

module.exports = debounce;

},{"lodash.isfunction":42,"lodash.isobject":43,"lodash.now":40}],40:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = require('lodash._isnative');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var stamp = _.now();
 * _.defer(function() { console.log(_.now() - stamp); });
 * // => logs the number of milliseconds it took for the deferred function to be called
 */
var now = isNative(now = Date.now) && now || function() {
  return new Date().getTime();
};

module.exports = now;

},{"lodash._isnative":41}],41:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],42:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],43:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = require('lodash._objecttypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"lodash._objecttypes":44}],44:[function(require,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],45:[function(require,module,exports){
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
  var node = incubate();
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

},{"./ai/baboon":3,"./emitter":9,"./incubate":10,"./mob":21,"./npcs":46,"dominus":33}],46:[function(require,module,exports){
(function (global){
var npcs = [];

function clear () {
  var npc;
  while ((npc = npcs.shift())) {
    npc.mob.clear = true;
    npc.mob.remove();
  }
}

function tick () {
  npcs.forEach(function (npc) {
    npc.think();
  });
}

npcs.clear = clear;
npcs.tick = tick;

module.exports = global.cube.npc = npcs;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],47:[function(require,module,exports){
var $ = require('dominus');
var incubate = require('./incubate');
var pows = require('./powerups');
var mob = require('./mob');
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

  emitter.on('mob.remove', function (who) {
    if (who === m) {
      pows.splice(pows.indexOf(me), 1);
      if (me.cleanup !== true) {
        effect(player, me);
        emitter.emit('pow.use', m.level);
      }
    }
  });

  function wordup (face) {
    face.innerText = effect.words[Math.floor(Math.random() * effect.words.length)];
  }

  node.find('.pc-face').forEach(wordup);
  pows.push(me);

  return me;
}

module.exports = pow;

},{"./emitter":9,"./incubate":10,"./mob":21,"./powerups":48,"./powerups/lifesaver":50,"dominus":33}],48:[function(require,module,exports){
(function (global){
var powerups = [];

function clear () {
  var pow;
  while ((pow = powerups.shift())) {
    pow.cleanup = true;
    pow.node.remove();
  }
}

module.exports = global.cube.powerup = powerups;

powerups.clear = clear;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],49:[function(require,module,exports){
var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var npc = require('../npc');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');

module.exports = function chaosbringer (level) {
  function effect (player, pow) {
    var count = Math.min(level, 4);
    for (i = 0; i < count; i++) {
      npc(player, { ai: aimer, level: Math.floor(Math.max(1, i / 2)) });
    }
    if (--level > 0) {
      powerup(player, { effect: chaosbringer(level) });
    }
  }

  effect.words = ['FIERY DEATH!', 'ANGRY THINGS.', 'OH NO', 'CHAOS BRINGER', 'angry kill!', 'death is inevitable'];

  return effect;
};

},{"../ai/aimer":2,"../npc":45,"../npcs":46,"../powerup":47,"dominus":33}],50:[function(require,module,exports){
module.exports = function (lives) {
  function effect (player, pow) {
    player.addLevel(lives);
  }

  effect.words = ['LIFE!', 'Saver.'];

  return effect;
};

},{}],51:[function(require,module,exports){
var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');

module.exports = function (level) {
  function effect (player, pow) {
    var npc;

    body.addClass('rainstorm');
    setTimeout(function () {
      body.removeClass('rainstorm');
    }, 300);

    while (level-- && npcs.length) {
      npc = npcs[Math.floor(Math.random() * effect.words.length)];
      if (npc) {
        setTimeout(damage, Math.random() * 300);
      }
    }

    function  damage () {
      npc.mob.damage(level);
    }

    npcs.forEach(function (npc, i) {
      if (i < level) {
        npc.mob.damage(level);
      }
    });
  }

  effect.words = ['STORM!', 'Shower.', 'DEATH', 'Mayhem', 'WOOO!', 'KILL \'EM ALL'];

  return effect;
};

},{"../npcs":46,"dominus":33}],52:[function(require,module,exports){
var $ = require('dominus');
var us = require('./us');
var emitter = require('./emitter');
var level = $('.sc-level');
var points = $('.sc-points');
var lives = $('.sc-lives');
var score = 0;
var gameLevel = 0;
var player;

emitter.on('player.start', function (p) {
  player = p;
});

emitter.on('npc.kill', function (clear, level) {
  add(Math.floor(++level * 1.5));
});

emitter.on('pow.use', function (level) {
  add(++level);
});

emitter.on('player.death', function (level) {
  add(-us.mm(gameLevel * 5, gameLevel * 2));
});

emitter.on('levels.change', function (level) {
  gameLevel = level + 1;
  add(us.mm(gameLevel, gameLevel * 2));
});

function reset () {
  score = 0;
  update();
}

function add (points) {
  score += points;
  update();
}

function update () {
  level.text(gameLevel);
  lives.text(player.level + 1);
  points.text(score);
}

module.exports = {
  reset: reset,
  add: add,
  update: update
};

},{"./emitter":9,"./us":53,"dominus":33}],53:[function(require,module,exports){
function pc (v, r) { return p(r / 100 * v); }
function u (m) { return a = parseInt(m.replace('px', ''), 10), isNaN(a) ? 0 : a; }
function p (v) { return v + 'px'; }
function mm (min, max) { return Math.floor((Math.random() * (max - min)) + min); }

module.exports = {
  pc: pc,
  u: u,
  p: p,
  mm: mm
};

},{}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmljby8ubnZtL3YwLjEwLjI2L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9uaWNvLy5udm0vdjAuMTAuMjYvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9haS9haW1lci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL2JhYm9vbi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL21hY2hpbmVndW4uanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9haS9yb29raWUuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9idWxsZXQuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9idWxsZXRzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvY3ViZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2VtaXR0ZXIuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9pbmN1YmF0ZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzAuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC8xLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvMi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC80LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvNS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzYuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC83LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvOC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVscy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL21vYi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL21vYnMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvY29udHJhLmVtaXR0ZXIvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvY29udHJhLmVtaXR0ZXIvc3JjL2NvbnRyYS5lbWl0dGVyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvbm9kZV9tb2R1bGVzL3Bvc2VyL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvbm9kZV9tb2R1bGVzL3Bvc2VyL3NyYy9icm93c2VyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvbm9kZV9tb2R1bGVzL3Nla3Rvci9zcmMvc2VrdG9yLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL0RvbWludXMuY3Rvci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy9Eb21pbnVzLnByb3RvdHlwZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy9jbGFzc2VzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL2NvcmUuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvZG9tLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL2RvbWludXMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvZXZlbnRzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL3B1YmxpYy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy90ZXN0LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL3RleHQuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL25vZGVfbW9kdWxlcy9sb2Rhc2gubm93L2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL25vZGVfbW9kdWxlcy9sb2Rhc2gubm93L25vZGVfbW9kdWxlcy9sb2Rhc2guX2lzbmF0aXZlL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZnVuY3Rpb24vaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3Qvbm9kZV9tb2R1bGVzL2xvZGFzaC5fb2JqZWN0dHlwZXMvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ucGMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ucGNzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3Bvd2VydXBzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMvY2hhb3NicmluZ2VyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMvbGlmZXNhdmVyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMvcmFpbnN0b3JtLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvc2NvcmVib2FyZC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xudmFyIGJ1bGxldCA9IHJlcXVpcmUoJy4uL2J1bGxldCcpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYywgZW5lbXkpIHtcbiAgdmFyIG1vYiA9IG5wYy5tb2I7XG4gIHZhciBpbnRlbGxpZ2VuY2UgPSAwLjM7XG4gIHZhciBnb2FsID0gNzAwO1xuICB2YXIgaWRsZSA9IDA7XG4gIHZhciBkO1xuICB2YXIgcmVkaXJlY3QgPSB0aHJvdHRsZShjaGFuZ2VEaXJlY3Rpb24sIDMwMCArIHIoKSAqIDYwMCk7XG4gIHZhciBzaG9vdHJhdGUgPSA3MDA7XG4gIHZhciBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpICsgc2hvb3RyYXRlO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZURpcmVjdGlvbiAoKSB7XG4gICAgZCA9IHsgeDogcnMoKSwgeTogcnMoKSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpbmsgKCkge1xuICAgIGlmIChpZGxlID4gZ29hbCkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICAgIGlkbGUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGxlICs9IHIoKSAqIDEwMCAqIGludGVsbGlnZW5jZTtcbiAgICB9XG4gICAgdmFyIHBlcmZlY3QgPSBtb2IubW92ZShkLngsIGQueSk7XG4gICAgaWYgKHBlcmZlY3QgPT09IGZhbHNlKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgIH1cbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAobm93IC0gbGFzdFNob290aW5nID4gc2hvb3RyYXRlKSB7XG4gICAgICBidWxsZXQobW9iLCB7IGxldmVsOiAxLCBhaW06IGVuZW15IH0pO1xuICAgICAgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gIH1cblxuICByZWRpcmVjdCgpO1xuICBucGMudGhpbmsgPSB0aGluaztcbn07XG4iLCJ2YXIgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKTtcblxuZnVuY3Rpb24gciAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpOyB9XG5mdW5jdGlvbiBycyAoKSB7IHJldHVybiBNYXRoLnNpZ24ocigpIC0gMC41KTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChucGMpIHtcbiAgdmFyIG1vYiA9IG5wYy5tb2I7XG4gIHZhciBpbnRlbGxpZ2VuY2UgPSAwLjM7XG4gIHZhciBnb2FsID0gNzAwO1xuICB2YXIgaWRsZSA9IDA7XG4gIHZhciBkO1xuICB2YXIgcmVkaXJlY3QgPSB0aHJvdHRsZShjaGFuZ2VEaXJlY3Rpb24sIDMwMCArIHIoKSAqIDEwMDApO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZURpcmVjdGlvbiAoKSB7XG4gICAgZCA9IHsgeDogcnMoKSwgeTogcnMoKSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpbmsgKCkge1xuICAgIGlmIChpZGxlID4gZ29hbCkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICAgIGlkbGUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGxlICs9IHIoKSAqIDEwMCAqIGludGVsbGlnZW5jZTtcbiAgICB9XG4gICAgdmFyIHBlcmZlY3QgPSBtb2IubW92ZShkLngsIGQueSk7XG4gICAgaWYgKHBlcmZlY3QgPT09IGZhbHNlKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlZGlyZWN0KCk7XG4gIG5wYy50aGluayA9IHRoaW5rO1xufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xudmFyIGJ1bGxldCA9IHJlcXVpcmUoJy4uL2J1bGxldCcpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYywgZW5lbXkpIHtcbiAgdmFyIG1vYiA9IG5wYy5tb2I7XG4gIHZhciBpbnRlbGxpZ2VuY2UgPSAwLjM7XG4gIHZhciBnb2FsID0gNzAwO1xuICB2YXIgaWRsZSA9IDA7XG4gIHZhciBkO1xuICB2YXIgcmVkaXJlY3QgPSB0aHJvdHRsZShjaGFuZ2VEaXJlY3Rpb24sIDUwICsgcigpICogMjAwKTtcbiAgdmFyIHNob290cmF0ZSA9IDIwO1xuICB2YXIgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKSArIHNob290cmF0ZTtcblxuICBmdW5jdGlvbiBjaGFuZ2VEaXJlY3Rpb24gKCkge1xuICAgIGQgPSB7IHg6IHJzKCksIHk6IHJzKCkgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRoaW5rICgpIHtcbiAgICBpZiAoaWRsZSA+IGdvYWwpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgICBpZGxlID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRsZSArPSByKCkgKiAxMDAgKiBpbnRlbGxpZ2VuY2U7XG4gICAgfVxuICAgIHZhciBwZXJmZWN0ID0gbW9iLm1vdmUoZC54LCBkLnkpO1xuICAgIGlmIChwZXJmZWN0ID09PSBmYWxzZSkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICB9XG4gICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKG5vdyAtIGxhc3RTaG9vdGluZyA+IHNob290cmF0ZSkge1xuICAgICAgYnVsbGV0KG1vYiwgeyBsZXZlbDogMSwgYWltOiBlbmVteSB9KTtcbiAgICAgIGxhc3RTaG9vdGluZyA9IERhdGUubm93KCk7XG4gICAgfVxuICB9XG5cbiAgcmVkaXJlY3QoKTtcbiAgbnBjLnRoaW5rID0gdGhpbms7XG59O1xuIiwidmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG52YXIgYnVsbGV0ID0gcmVxdWlyZSgnLi4vYnVsbGV0Jyk7XG5cbmZ1bmN0aW9uIHIgKCkgeyByZXR1cm4gTWF0aC5yYW5kb20oKTsgfVxuZnVuY3Rpb24gcnMgKCkgeyByZXR1cm4gTWF0aC5zaWduKHIoKSAtIDAuNSk7IH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobnBjKSB7XG4gIHZhciBtb2IgPSBucGMubW9iO1xuICB2YXIgaW50ZWxsaWdlbmNlID0gMC4zO1xuICB2YXIgZ29hbCA9IDcwMDtcbiAgdmFyIGlkbGUgPSAwO1xuICB2YXIgZDtcbiAgdmFyIHJlZGlyZWN0ID0gdGhyb3R0bGUoY2hhbmdlRGlyZWN0aW9uLCAzMDAgKyByKCkgKiAzMDApO1xuICB2YXIgc2hvb3RyYXRlID0gMzAwO1xuICB2YXIgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKSArIHNob290cmF0ZTtcblxuICBmdW5jdGlvbiBjaGFuZ2VEaXJlY3Rpb24gKCkge1xuICAgIGQgPSB7IHg6IHJzKCksIHk6IHJzKCkgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRoaW5rICgpIHtcbiAgICBpZiAoaWRsZSA+IGdvYWwpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgICBpZGxlID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRsZSArPSByKCkgKiAxMDAgKiBpbnRlbGxpZ2VuY2U7XG4gICAgfVxuICAgIHZhciBwZXJmZWN0ID0gbW9iLm1vdmUoZC54LCBkLnkpO1xuICAgIGlmIChwZXJmZWN0ID09PSBmYWxzZSkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICB9XG4gICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKG5vdyAtIGxhc3RTaG9vdGluZyA+IHNob290cmF0ZSkge1xuICAgICAgYnVsbGV0KG1vYiwgeyBsZXZlbDogMSB9KTtcbiAgICAgIGxhc3RTaG9vdGluZyA9IERhdGUubm93KCk7XG4gICAgfVxuICB9XG5cbiAgcmVkaXJlY3QoKTtcbiAgbnBjLnRoaW5rID0gdGhpbms7XG59O1xuIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgaW5jdWJhdGUgPSByZXF1aXJlKCcuL2luY3ViYXRlJyk7XG52YXIgYnVsbGV0cyA9IHJlcXVpcmUoJy4vYnVsbGV0cycpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciB1cyA9IHJlcXVpcmUoJy4vdXMnKTtcblxuZnVuY3Rpb24gciAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpOyB9XG5mdW5jdGlvbiByc3RhbGUgKCkgeyB2YXIgdiA9IHIoKTsgcmV0dXJuIHYgPiAwLjY2ID8gLTEgOiB2ID4gMC4zMyA/IDEgOiAwOyB9XG5cbmZ1bmN0aW9uIGJ1bGxldCAoc291cmNlLCBvcHRpb25zKSB7XG4gIHZhciBvID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIGxldmVsID0gby5sZXZlbCB8fCAwO1xuICB2YXIgbW9iID0gcmVxdWlyZSgnLi9tb2InKTtcbiAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xuICB2YXIgcyA9IGdldENvbXB1dGVkU3R5bGUoc291cmNlLm5vZGVbMF0pO1xuICB2YXIgbm9kZSA9IGluY3ViYXRlKCk7XG4gIG5vZGVbMF0uc3R5bGUudG9wID0gcy50b3A7XG4gIG5vZGVbMF0uc3R5bGUubGVmdCA9IHMubGVmdDtcbiAgdmFyIHRzID0gMTI7XG4gIHZhciBkeCA9IHNvdXJjZS5kLng7XG4gIHZhciBkeSA9IHNvdXJjZS5kLnk7XG4gIHZhciBjdWJlID0gbm9kZS5maW5kKCcucGMtY3ViZScpLmFkZENsYXNzKCdwYy1zaG93Jyk7XG4gIGlmIChvLmFpbSkge1xuICAgIHZhciBhID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlWzBdKTtcbiAgICB2YXIgYiA9IGdldENvbXB1dGVkU3R5bGUoby5haW0ubm9kZVswXSk7XG4gICAgdmFyIHggPSB1cy51KGIubGVmdCkgLSB1cy51KGEubGVmdCk7XG4gICAgdmFyIHkgPSB1cy51KGIudG9wKSAtIHVzLnUoYS50b3ApO1xuICAgIGR4ID0gTWF0aC5hYnMoeCkgPiA0MCA/IHggOiAwO1xuICAgIGR5ID0gTWF0aC5hYnMoeSkgPiA0MCA/IHkgOiAwO1xuICB9IGVsc2UgaWYgKGR4ID09PSAwICYmIGR5ID09PSAwKSB7XG4gICAgZHggPSByc3RhbGUoKTtcbiAgICBkeSA9IHJzdGFsZSgpO1xuICAgIGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgZHggPSByc3RhbGUoKTtcbiAgICAgIGR5ID0gZHggPT09IDAgPyAxIDogcnN0YWxlKCk7XG4gICAgfVxuICB9XG4gIHZhciBtID0gbW9iKG5vZGUsIHtcbiAgICB0eXBlOiAnYnVsbGV0JyxcbiAgICBsZXZlbDogbGV2ZWwsXG4gICAgdG9wc3BlZWQ6IHRzLFxuICAgIGFjY2VsOiB7XG4gICAgICB4OiBNYXRoLmFicyhkeCkgKiB0cyxcbiAgICAgIHk6IE1hdGguYWJzKGR5KSAqIHRzXG4gICAgfVxuICB9KTtcbiAgdmFyIG1lID0ge1xuICAgIHJlbW92ZTogcmVtb3ZlLFxuICAgIG5vZGU6IG5vZGUsXG4gICAgbW9iOiBtLFxuICAgIHY6IHtcbiAgICAgIHg6IE1hdGguc2lnbihkeCksXG4gICAgICB5OiBNYXRoLnNpZ24oZHkpXG4gICAgfVxuICB9O1xuICBtLmd1bm5lciA9IHNvdXJjZTtcblxuICBmdW5jdGlvbiBzbW9vdGggKCkge1xuICAgIGN1YmUuYWRkQ2xhc3MoJ3BjLXNtb290aCcpO1xuICB9XG5cbiAgZW1pdHRlci5vbignbW9iLnJlbW92ZScsIGZ1bmN0aW9uICh3aG8pIHtcbiAgICBpZiAod2hvID09PSBtKSB7XG4gICAgICBidWxsZXRzLnNwbGljZShidWxsZXRzLmluZGV4T2YobWUpLCAxKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHJlbW92ZSAoKSB7XG4gICAgbS5yZW1vdmUoKTtcbiAgfVxuXG4gIHNldFRpbWVvdXQoc21vb3RoLCAwKTtcbiAgc2V0VGltZW91dChyZW1vdmUsIDI0MDApO1xuXG4gIGJ1bGxldHMucHVzaChtZSk7XG5cbiAgcmV0dXJuIG1lO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gYnVsbGV0O1xuIiwidmFyIGJ1bGxldHMgPSBbXTtcblxuZnVuY3Rpb24gdGljayAoKSB7XG4gIGJ1bGxldHMuZm9yRWFjaChmdW5jdGlvbiAoYnVsbGV0KSB7XG4gICAgaWYgKGJ1bGxldC5ib290KSB7XG4gICAgICBidWxsZXQubW9iLm1vdmUoYnVsbGV0LnYueCwgYnVsbGV0LnYueSk7XG4gICAgICBidWxsZXQubW9iLmNkKCkuZm9yRWFjaChkYW1hZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KGJvb3QsIDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGJvb3QgKCkge1xuICAgICAgYnVsbGV0LmJvb3QgPSB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhbWFnZSAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQuZGFtYWdlKGJ1bGxldC5sZXZlbCk7XG4gICAgICBidWxsZXQucmVtb3ZlKCk7XG4gICAgfVxuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXRzO1xuXG5idWxsZXRzLnRpY2sgPSB0aWNrO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG5cbmdsb2JhbC4kID0gJDtcbmdsb2JhbC5jdWJlID0ge307XG5cbnZhciBtb2IgPSByZXF1aXJlKCcuL21vYicpO1xudmFyIG1vYnMgPSByZXF1aXJlKCcuL21vYnMnKTtcbnZhciBucGMgPSByZXF1aXJlKCcuL25wYycpO1xudmFyIG5wY3MgPSByZXF1aXJlKCcuL25wY3MnKTtcbnZhciBwb3dzID0gcmVxdWlyZSgnLi9wb3dlcnVwcycpO1xudmFyIGJ1bGxldHMgPSByZXF1aXJlKCcuL2J1bGxldHMnKTtcbnZhciBsZXZlbHMgPSByZXF1aXJlKCcuL2xldmVscycpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciBpbmN1YmF0ZSA9IHJlcXVpcmUoJy4vaW5jdWJhdGUnKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcbnZhciB5b3VyQ3ViZTtcbnZhciB5b3VyQ3ViZUludGVybmFsO1xudmFyIHlvdTtcbnZhciBmbGFzaGluZztcbnZhciBrZXlzO1xudmFyIFNQQUNFID0gMzI7XG52YXIgTEVGVCA9IDM3O1xudmFyIFRPUCA9IDM4O1xudmFyIFJJR0hUID0gMzk7XG52YXIgQk9UVE9NID0gNDA7XG52YXIgUiA9IDgyO1xuXG5jb25zb2xlLmxvZygnJWNXZWxjb21lIHRvIFBvbnkgQ3ViZSEgVXNlIHRoZSBhcnJvdyBrZXlzLicsICdmb250LWZhbWlseTogXCJNZXJyaXdlYXRoZXJcIjsgZm9udC1zaXplOiA2MHB4OyBjb2xvcjogI2U5MmM2YzsnKTtcblxuaW5jdWJhdGVDdWJlKCk7XG5ib2R5Lm9uKCdjbGljaycsIHdlbGNvbWUpO1xuYm9keS5vbigna2V5ZG93bicsIHdlbGNvbWluZyk7XG5ib2R5Lm9uKCdrZXlkb3duJywgc3BlY2lhbHMpO1xuXG5mdW5jdGlvbiB3ZWxjb21pbmcgKGUpIHtcbiAgaWYgKGUud2hpY2ggPT09IFNQQUNFKSB7XG4gICAgd2VsY29tZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNwZWNpYWxzIChlKSB7XG4gIGlmIChlLndoaWNoID09PSBSKSB7XG4gICAgZ2FtZW92ZXIoJ09LLiBUUlkgQUdBSU4hJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5jdWJhdGVDdWJlICgpIHtcbiAgeW91ckN1YmUgPSBpbmN1YmF0ZSgpLmFkZENsYXNzKCd0aGUtbWFuJyk7XG4gIHlvdXJDdWJlSW50ZXJuYWwgPSB5b3VyQ3ViZS5maW5kKCcucGMtY3ViZScpO1xufVxuXG5mdW5jdGlvbiB3ZWxjb21lICgpIHtcbiAgaWYgKGZsYXNoaW5nKSB7XG4gICAgJCgnI3dlbGNvbWUtdHdvJykucmVtb3ZlKCk7XG4gICAgYm9keS5yZW1vdmVDbGFzcygnZmxhc2h5Jyk7XG4gICAgc3RhcnQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAkKCcjd2VsY29tZS1vbmUnKS5yZW1vdmUoKTtcbiAgICBib2R5LnJlbW92ZUNsYXNzKCd3ZWxjb21lJyk7XG4gICAgYm9keS5hZGRDbGFzcygnZmxhc2h5Jyk7XG4gICAgZmxhc2hpbmcgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAga2V5cyA9IHt9O1xuICB5b3UgPSBtb2IoeW91ckN1YmUsIHsgdHlwZTogJ3lvdScgfSk7XG4gIGVtaXR0ZXIuZW1pdCgncGxheWVyLnN0YXJ0JywgeW91KTtcbiAgZ2xvYmFsLmN1YmUueW91ID0geW91O1xuICBlbWl0dGVyLm9uKCdtb2IubGV2ZWxkb3duJywgbGV2ZWxkb3duKTtcbiAgZW1pdHRlci5vbignbGV2ZWxzLndpbicsIHdvbik7XG4gIHlvdXJDdWJlSW50ZXJuYWwuYWRkQ2xhc3MoJ3BjLXNob3cnKTtcbiAgYm9keS5vZmYoJ2NsaWNrJywgd2VsY29tZSk7XG4gIGJvZHkub2ZmKCdrZXlkb3duJywgd2VsY29taW5nKTtcbiAgYm9keS5vbigna2V5ZG93bicsIGtkKTtcbiAgYm9keS5vbigna2V5dXAnLCBrdSk7XG4gIGdhbWVsb29wKCk7XG4gIGxldmVscyh5b3UpO1xufVxuXG5mdW5jdGlvbiBsZXZlbGRvd24gKG0sIGxldmVsKSB7XG4gIGlmIChtID09PSB5b3UpIHtcbiAgICBlbWl0dGVyLmVtaXQoJ3BsYXllci5kZWF0aCcsIGxldmVsKTtcbiAgICB5b3UucGxhY2VtZW50KCk7XG4gICAgYm9keS5hZGRDbGFzcygnZGVhdGhmbGFzaCcpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgYm9keS5yZW1vdmVDbGFzcygnZGVhdGhmbGFzaCcpO1xuICAgIH0sIDQwMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24ga2QgKGUpIHsga2V5c1tlLndoaWNoXSA9IHRydWU7IH1cbmZ1bmN0aW9uIGt1IChlKSB7IGtleXNbZS53aGljaF0gPSBmYWxzZTsgfVxuZnVuY3Rpb24gbm9Qb3dzIChtKSB7IHJldHVybiAhbS5wb3c7IH1cbmZ1bmN0aW9uIG9ubHlQb3dzIChtKSB7IHJldHVybiAhIW0ucG93OyB9XG5mdW5jdGlvbiB1c2VQb3cgKG0pIHsgbS5yZW1vdmUoKTsgfVxuZnVuY3Rpb24gZ2FtZWxvb3AgKCkge1xuICB2YXIgbCA9IGtleXNbTEVGVF07XG4gIHZhciB0ID0ga2V5c1tUT1BdO1xuICB2YXIgciA9IGtleXNbUklHSFRdO1xuICB2YXIgYiA9IGtleXNbQk9UVE9NXTtcbiAgdmFyIHUgPSBrZXlzW1NQQUNFXTtcbiAgaWYgKGwgJiYgcikgeyBsID0gciA9IGZhbHNlOyB9XG4gIGlmICh0ICYmIGIpIHsgdCA9IGIgPSBmYWxzZTsgfVxuICB5b3UubW92ZShsID8gLTEgOiAociA/IDEgOiAwKSwgdCA/IC0xIDogKGIgPyAxIDogMCkpO1xuICBucGNzLnRpY2soKTtcbiAgYnVsbGV0cy50aWNrKCk7XG4gIHZhciBjZCA9IHlvdS5jZCgpO1xuICB2YXIgY2ROb1Bvd3MgPSBjZC5maWx0ZXIobm9Qb3dzKTtcbiAgY2QuZmlsdGVyKG9ubHlQb3dzKS5mb3JFYWNoKHVzZVBvdyk7XG4gIGlmICh5b3Uua2lhIHx8IGNkTm9Qb3dzLmxlbmd0aCkge1xuICAgIGNkTm9Qb3dzLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgIHlvdS5kYW1hZ2UobS5sZXZlbCk7XG4gICAgfSk7XG4gICAgaWYgKHlvdS5raWEpIHtcbiAgICAgIGdhbWVvdmVyKCdZT1VcXCdSRSBWRVJZIE1VQ0ggREVBRCBXT1d+IScpOyByZXR1cm47XG4gICAgfVxuICB9XG4gIGlmICh1KSB7XG4gICAgeW91LmZpcmUoKTtcbiAgfVxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZWxvb3ApO1xufVxuXG5mdW5jdGlvbiBnYW1lb3ZlciAobWVzc2FnZSwgY2xhc3Nlcykge1xuICBlbWl0dGVyLm9mZignbGV2ZWxzLndpbicsIHdvbik7XG4gICQoJy5ydC10aW50JykuYWRkQ2xhc3MoWydydC1zaG93J10uY29uY2F0KGNsYXNzZXMgfHwgW10pLmpvaW4oJyAnKSk7XG4gICQoJy5ydC10ZXh0JykudGV4dChtZXNzYWdlKTtcbiAgY2xlYW51cCgpO1xuICBjb25zb2xlLmxvZygnJWMlcycsICdmb250LWZhbWlseTogXCJDb21pYyBTYW5zIE1TXCI7IGZvbnQtc2l6ZTogMjVweDsgY29sb3I6ICNkMTE5MTE7JywgbWVzc2FnZSk7XG5cbiAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgYm9keS5vbigna2V5ZG93bicsIHJlc3RhcnQpO1xuICB9LCA1MDApO1xufVxuXG5mdW5jdGlvbiBjbGVhbnVwICgpIHtcbiAgeW91ckN1YmVJbnRlcm5hbC5yZW1vdmVDbGFzcygncGMtc2hvdycpO1xuICBib2R5Lm9mZigna2V5dXAnLCBrdSk7XG4gIGJvZHkub2ZmKCdrZXlkb3duJywga2QpO1xuICBucGNzLmNsZWFyKCk7XG4gIHBvd3MuY2xlYXIoKTtcbiAgbW9icy5zcGxpY2UoMCwgbW9icy5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiB3b24gKCkge1xuICBnYW1lb3ZlcignWk9NRyBZT1UgV09OIScsIFsncnQtd29uJ10pO1xufVxuXG5mdW5jdGlvbiByZXN0YXJ0IChlKSB7XG4gIGlmIChlLndoaWNoID09PSBTUEFDRSkge1xuICAgIGJvZHkub2ZmKCdrZXlkb3duJywgcmVzdGFydCk7XG4gICAgeW91ckN1YmUucmVtb3ZlKCk7XG4gICAgaW5jdWJhdGVDdWJlKCk7XG4gICAgJCgnLnJ0LXRpbnQnKS5yZW1vdmVDbGFzcygncnQtc2hvdycpO1xuICAgIHNldFRpbWVvdXQoc3RhcnQsIDEwMDApO1xuICB9XG59XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIGVtaXR0ZXIgPSByZXF1aXJlKCdjb250cmEuZW1pdHRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVtaXR0ZXIoKTtcbiIsInZhciAkID0gcmVxdWlyZSgnZG9taW51cycpO1xudmFyIGluY3ViYXRvciA9ICQoJyN5b3UnKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcblxuZnVuY3Rpb24gaW5jdWJhdGUgKCkge1xuICB2YXIgY3ViZSA9IGluY3ViYXRvci5jbG9uZSgpLmFwcGVuZFRvKGJvZHkpO1xuICBjdWJlWzBdLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcbiAgY3ViZS5maW5kKCcucGMtY3ViZScpLmFkZENsYXNzKCdwYy1zbW9vdGgnKTtcbiAgcmV0dXJuIGN1YmU7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBpbmN1YmF0ZTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgbnBjKHlvdSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgcG93ZXJ1cCh5b3UpO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiByb29raWUgfSkubm9kZS5hZGRDbGFzcygnbnBjLWZ1bmsnKTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBtYWNoaW5lZ3VuID0gcmVxdWlyZSgnLi4vYWkvbWFjaGluZWd1bicpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICBucGMoeW91LCB7IGFpOiByb29raWUgfSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KS5ub2RlLmFkZENsYXNzKCducGMtZnVuaycpO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuIH0pO1xuICBwb3dlcnVwKHlvdSk7XG59O1xuIiwidmFyIG5wYyA9IHJlcXVpcmUoJy4uL25wYycpO1xudmFyIHJvb2tpZSA9IHJlcXVpcmUoJy4uL2FpL3Jvb2tpZScpO1xudmFyIGFpbWVyID0gcmVxdWlyZSgnLi4vYWkvYWltZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIHlvdS5hZGRMZXZlbCgxKTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG59O1xuIiwidmFyIG5wYyA9IHJlcXVpcmUoJy4uL25wYycpO1xudmFyIHJvb2tpZSA9IHJlcXVpcmUoJy4uL2FpL3Jvb2tpZScpO1xudmFyIGFpbWVyID0gcmVxdWlyZSgnLi4vYWkvYWltZXInKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xudmFyIHJhaW5zdG9ybSA9IHJlcXVpcmUoJy4uL3Bvd2VydXBzL3JhaW5zdG9ybScpO1xudmFyIG1hY2hpbmVndW4gPSByZXF1aXJlKCcuLi9haS9tYWNoaW5lZ3VuJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiByb29raWUsIGxldmVsOiAxIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMiB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDIgfSk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogcmFpbnN0b3JtKDEpIH0pO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgbWFjaGluZWd1biA9IHJlcXVpcmUoJy4uL2FpL21hY2hpbmVndW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIHlvdS5hZGRMZXZlbCgxKTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIsIGxldmVsOiAxIH0pO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDMgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAzIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMyB9KTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llLCBsZXZlbDogMiB9KS5ub2RlLmFkZENsYXNzKCducGMtbWFzcycpO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xudmFyIHJvb2tpZSA9IHJlcXVpcmUoJy4uL2FpL3Jvb2tpZScpO1xudmFyIGFpbWVyID0gcmVxdWlyZSgnLi4vYWkvYWltZXInKTtcbnZhciBtYWNoaW5lZ3VuID0gcmVxdWlyZSgnLi4vYWkvbWFjaGluZWd1bicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgeW91LmFkZExldmVsKDEsIDIpO1xuICBwb3dlcnVwKHlvdSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyLCBsZXZlbDogNiB9KS5ub2RlLmFkZENsYXNzKCducGMtYm9zcycpO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgbWFjaGluZWd1biA9IHJlcXVpcmUoJy4uL2FpL21hY2hpbmVndW4nKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xudmFyIHJhaW5zdG9ybSA9IHJlcXVpcmUoJy4uL3Bvd2VydXBzL3JhaW5zdG9ybScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgeW91LmFkZExldmVsKDEpO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IHJhaW5zdG9ybSgzKSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIsIGxldmVsOiAxIH0pO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDMgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAyIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMiB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4gfSkubm9kZS5hZGRDbGFzcygnbnBjLWZ1bmsnKTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biB9KS5ub2RlLmFkZENsYXNzKCducGMtZnVuaycpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llLCBsZXZlbDogMiB9KS5ub2RlLmFkZENsYXNzKCducGMtbWFzcycpO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciByYWluc3Rvcm0gPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9yYWluc3Rvcm0nKTtcbnZhciBjaGFvc2JyaW5nZXIgPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9jaGFvc2JyaW5nZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIHlvdS5hZGRMZXZlbCgxKTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiByYWluc3Rvcm0oMikgfSk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogcmFpbnN0b3JtKDIpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IGNoYW9zYnJpbmdlcigyKSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIsIGxldmVsOiAxIH0pO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSkubm9kZS5hZGRDbGFzcygnbnBjLW1hc3MnKTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDMgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAyIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMiB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4gfSkubm9kZS5hZGRDbGFzcygnbnBjLWZ1bmsnKTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biB9KS5ub2RlLmFkZENsYXNzKCducGMtZnVuaycpO1xuICBucGMoeW91LCB7IGFpOiByb29raWUsIGxldmVsOiAyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1tYXNzJyk7XG59O1xuIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgcG93cyA9IHJlcXVpcmUoJy4vcG93ZXJ1cHMnKTtcbnZhciBucGNzID0gcmVxdWlyZSgnLi9ucGNzJyk7XG52YXIgbnBjID0gcmVxdWlyZSgnLi9ucGMnKTtcbnZhciBzY29yZWJvYXJkID0gcmVxdWlyZSgnLi9zY29yZWJvYXJkJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIGxpc3RlbmVycyA9IFtdO1xuXG5mdW5jdGlvbiBvbmNlIChmbikge1xuICB2YXIgZGlzY2FyZGVkO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkaXNjYXJkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGlzY2FyZGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIHZhciBsZXZlbCA9IDA7XG4gIHZhciBsZXZlbHMgPSB7XG4gICAgMDogb25jZShyZXF1aXJlKCcuL2xldmVsLzAnKSksXG4gICAgMTogb25jZShyZXF1aXJlKCcuL2xldmVsLzEnKSksXG4gICAgMjogb25jZShyZXF1aXJlKCcuL2xldmVsLzInKSksXG4gICAgMzogb25jZShyZXF1aXJlKCcuL2xldmVsLzMnKSksXG4gICAgNDogb25jZShyZXF1aXJlKCcuL2xldmVsLzQnKSksXG4gICAgNTogb25jZShyZXF1aXJlKCcuL2xldmVsLzUnKSksXG4gICAgNjogb25jZShyZXF1aXJlKCcuL2xldmVsLzYnKSksXG4gICAgNzogb25jZShyZXF1aXJlKCcuL2xldmVsLzcnKSksXG4gICAgODogb25jZShyZXF1aXJlKCcuL2xldmVsLzgnKSksXG4gIH07XG5cbiAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgZW1pdHRlci5vZmYoJ25wYy5raWxsJywgbGlzdGVuZXIpO1xuICB9KTtcbiAgbGlzdGVuZXJzLnB1c2gobnBjS2lsbCk7XG4gIGVtaXR0ZXIub24oJ25wYy5raWxsJywgbnBjS2lsbCk7XG4gIHNjb3JlYm9hcmQucmVzZXQoeW91KTtcbiAgcmVzZXQoKTtcblxuICBmdW5jdGlvbiBucGNLaWxsIChjbGVhcmVkKSB7XG4gICAgdmFyIG5leHQgPSBsZXZlbCArIDE7XG4gICAgaWYgKGNsZWFyZWQpIHtcbiAgICAgIGlmIChsZXZlbHNbbmV4dF0pIHtcbiAgICAgICAgKytsZXZlbDtcbiAgICAgICAgY29uc29sZS5sb2coJyVjTEVWRUwgJXMgQ0xFQVIgV09XfiEnLCAnZm9udC1mYW1pbHk6IFwiQ2FyZG9cIjsgZm9udC1zaXplOiAyNXB4OyBjb2xvcjogI2ZmZDJkMjsnLCBuZXh0KTtcbiAgICAgICAgc2V0VGltZW91dChyZXNldCwgNjAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCclY0xFVkVMICVzIENMRUFSIFpPTUcgU1VDSCBHQU1FUn4hJywgJ2ZvbnQtZmFtaWx5OiBcIkNhcmRvXCI7IGZvbnQtc2l6ZTogMjVweDsgY29sb3I6ICNhNGQ0ZTY7JywgbmV4dCk7XG4gICAgICAgIHNldFRpbWVvdXQod29uLCA2MDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0ICgpIHtcbiAgICBlbWl0dGVyLmVtaXQoJ2xldmVscy5jaGFuZ2UnLCBsZXZlbCk7XG4gICAgc2NvcmVib2FyZC5hZGQobGV2ZWwgKiAxNSk7XG4gICAgeW91LnNldCg1MCwgNTApO1xuICAgIGlmIChsZXZlbHNbbGV2ZWxdKSB7XG4gICAgICBucGNzLmNsZWFyKCk7XG4gICAgICBwb3dzLmNsZWFyKCk7XG4gICAgICAkKCcucGMtcGFyZW50JykuYnV0KCcjeW91LCAudGhlLW1hbicpLnJlbW92ZSgpO1xuICAgICAgbGV2ZWxzW2xldmVsXSh5b3UpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdvbiAoKSB7XG4gICAgZW1pdHRlci5lbWl0KCdsZXZlbHMud2luJyk7XG4gIH1cbn07XG4iLCJ2YXIgbW9icyA9IHJlcXVpcmUoJy4vbW9icycpO1xudmFyIGJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0Jyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIHVzID0gcmVxdWlyZSgnLi91cycpO1xudmFyIGxhc3RidWxsZXQgPSBEYXRlLm5vdygpO1xudmFyIGJ1bGxldHJhdGUgPSAzMDA7XG52YXIgc2NyZWVubWFyZ2luID0gMzA7XG52YXIgbGFzdElkID0gMDtcblxuZnVuY3Rpb24gciAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpOyB9XG5cbmZ1bmN0aW9uIG1vYiAobm9kZSwgb3B0aW9ucykge1xuICB2YXIgbyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBzcGVlZCA9IG8uc3BlZWQgfHwgMC4zO1xuICB2YXIgdG9wc3BlZWQgPSBvLnRvcHNwZWVkIHx8IDQ7XG4gIHZhciBhY2NlbCA9IHtcbiAgICB4OiBvLmFjY2VsICYmIG8uYWNjZWwueCB8fCAwLCB5OiBvLmFjY2VsICYmIG8uYWNjZWwueSB8fCAwXG4gIH07XG4gIHZhciBkID0ge1xuICAgIHg6IDAsIHk6IDBcbiAgfTtcbiAgdmFyIGx0eXBlO1xuICB2YXIgbWUgPSB7XG4gICAgaWQ6IGxhc3RJZCsrLFxuICAgIHR5cGU6IG8udHlwZSxcbiAgICBub2RlOiBub2RlLFxuICAgIG1vdmU6IG1vdmUsXG4gICAgbGV2ZWw6IG8ubGV2ZWwgfHwgMCxcbiAgICBzZXQ6IHNldCxcbiAgICBjZDogY2QsXG4gICAgZmlyZTogZmlyZSxcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICBkYW1hZ2U6IGRhbWFnZSxcbiAgICByZW1vdmU6IHJlbW92ZSxcbiAgICBhY2NlbDogYWNjZWwsXG4gICAgZDogZCxcbiAgICBraWE6IGZhbHNlLFxuICAgIHNldExldmVsOiBzZXRMZXZlbCxcbiAgICBhZGRMZXZlbDogYWRkTGV2ZWxcbiAgfTtcblxuICBzZXRMZXZlbChtZS5sZXZlbCk7XG5cbiAgbW9icy5wdXNoKG1lKTtcblxuICBmdW5jdGlvbiBmICh2LCBkKSB7IHJldHVybiB2ICogKHNwZWVkICsgYWNjZWxbZF0pOyB9XG4gIGZ1bmN0aW9uIHNhbmUgKHYsIG1heCkge1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2LCBzY3JlZW5tYXJnaW4pLCBtYXggLSBzY3JlZW5tYXJnaW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZSAob3gsIG95KSB7XG4gICAgdmFyIGMgPSBub2RlWzBdO1xuICAgIHZhciBzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYyk7XG4gICAgdmFyIHggPSB1cy51KHMubGVmdCkgKyBmKG94LCAneCcpO1xuICAgIHZhciB5ID0gdXMudShzLnRvcCkgKyBmKG95LCAneScpO1xuICAgIHZhciBzeCA9IG1lLmd1bm5lciA/IHggOiBzYW5lKHgsIGlubmVyV2lkdGgpO1xuICAgIHZhciBzeSA9IG1lLmd1bm5lciA/IHkgOiBzYW5lKHksIGlubmVySGVpZ2h0KTtcbiAgICBjLnN0eWxlLmxlZnQgPSB1cy5wKHN4KTtcbiAgICBjLnN0eWxlLnRvcCA9IHVzLnAoc3kpO1xuICAgIG1lLmQueCA9IG94O1xuICAgIG1lLmQueSA9IG95O1xuICAgIGFjY2VsZXJhdGUoJ3gnLCBveCk7XG4gICAgYWNjZWxlcmF0ZSgneScsIG95KTtcbiAgICBoaXRzKHMpO1xuICAgIHJldHVybiB4ID09PSBzeCAmJiB5ID09PSBzeTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpdHMgKGNvbXB1dGVkKSB7XG4gICAgdmFyIHMgPSBjb21wdXRlZCB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlWzBdKTtcbiAgICBtZS5oaXRib3ggPSB7IC8vIDEwJSBoaXRib3hcbiAgICAgIHg6IHVzLnUocy5sZWZ0KSAqIDAuOSxcbiAgICAgIHk6IHVzLnUocy50b3ApICogMC45LFxuICAgICAgdzogdXMudShzLndpZHRoKSAqIDEuMSxcbiAgICAgIGg6IHVzLnUocy5oZWlnaHQpICogMS4xXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFjY2VsZXJhdGUgKGQsIG0pIHtcbiAgICBhY2NlbFtkXSArPSBtID8gMC4yIDogLTAuNjU7XG4gICAgYWNjZWxbZF0gPSBNYXRoLm1heChNYXRoLm1pbih0b3BzcGVlZCwgYWNjZWxbZF0pLCAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdE1lIChtKSB7XG4gICAgcmV0dXJuIG0gIT09IG1lO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90TXlCdWxsZXQgKG0pIHtcbiAgICByZXR1cm4gbS5ndW5uZXIgIT09IG1lO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90TXlHdW5uZXIgKG0pIHtcbiAgICByZXR1cm4gbSAhPT0gbWUuZ3VubmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90U2FtZUd1bm5lciAobSkge1xuICAgIHJldHVybiAhbS5ndW5uZXIgfHwgIW1lLmd1bm5lciB8fCBtLmd1bm5lciAhPT0gbWUuZ3VubmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gY29sbGlzaW9uIChtKSB7XG4gICAgdmFyIGwgPSBtZS5oaXRib3g7XG4gICAgdmFyIHIgPSBtLmhpdGJveDtcbiAgICB2YXIgYiA9IGwgJiYgcjtcbiAgICBpZiAoIWIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGx4YiA9IGwueCA+PSByLnggJiYgbC54IDwgci54ICsgci53O1xuICAgIHZhciByeGIgPSByLnggPj0gbC54ICYmIHIueCA8IGwueCArIGwudztcbiAgICB2YXIgbHliID0gbC55ID49IHIueSAmJiBsLnkgPCByLnkgKyByLmg7XG4gICAgdmFyIHJ5YiA9IHIueSA+PSBsLnkgJiYgci55IDwgbC55ICsgbC5oO1xuICAgIHJldHVybiAobHhiIHx8IHJ4YikgJiYgKGx5YiB8fCByeWIpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2QgKCkge1xuICAgIHJldHVybiBtb2JzLmZpbHRlcihub3RNZSkuZmlsdGVyKG5vdE15QnVsbGV0KS5maWx0ZXIobm90TXlHdW5uZXIpLmZpbHRlcihub3RTYW1lR3VubmVyKS5maWx0ZXIoY29sbGlzaW9uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldCAoeCwgeSkge1xuICAgIHZhciBjID0gbm9kZVswXTtcbiAgICBjLnN0eWxlLmxlZnQgPSB1cy5wYyh4LCBpbm5lcldpZHRoKTtcbiAgICBjLnN0eWxlLnRvcCA9IHVzLnBjKHksIGlubmVySGVpZ2h0KTtcbiAgICBoaXRzKCk7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZW1lbnQgKCkge1xuICAgIHZhciBhdHRlbXB0cyA9IDA7XG4gICAgdmFyIHggPSByKCkgKiAxMDA7XG4gICAgdmFyIHkgPSByKCkgKiAxMDA7XG4gICAgc2V0KHgsIHkpO1xuXG4gICAgaWYgKCsrYXR0ZW1wdHMgPCA1ICYmIGNkKCkubGVuZ3RoID4gMCkge1xuICAgICAgcGxhY2VtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZmlyZSAoKSB7XG4gICAgaWYgKERhdGUubm93KCkgLSBsYXN0YnVsbGV0ID4gYnVsbGV0cmF0ZSkge1xuICAgICAgbGFzdGJ1bGxldCA9IERhdGUubm93KCk7XG4gICAgICBidWxsZXQobWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZSAoKSB7XG4gICAgaWYgKG1lLmtpYSkgeyAvLyBzYW5pdHlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbWUua2lhID0gdHJ1ZTtcbiAgICBub2RlLnJlbW92ZSgpO1xuICAgIG1vYnMuc3BsaWNlKG1vYnMuaW5kZXhPZihtZSksIDEpO1xuICAgIGVtaXR0ZXIuZW1pdCgnbW9iLnJlbW92ZScsIG1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGx2IChsKSB7XG4gICAgcmV0dXJuIG1lLnR5cGUgKyAnLScgKyBsO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0TGV2ZWwgKGwpIHtcbiAgICBtZS5ub2RlLmZpbmQoJy5wYy1jdWJlJykucmVtb3ZlQ2xhc3MobHYobWUubGV2ZWwpKS5hZGRDbGFzcyhsdihsKSk7XG4gICAgbWUubGV2ZWwgPSBsO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkTGV2ZWwgKGwsIG0pIHtcbiAgICBzZXRMZXZlbChNYXRoLm1pbihtZS5sZXZlbCArIGwsIG0gfHwgSW5maW5pdHkpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRhbWFnZSAobCkge1xuICAgIHZhciBsdiA9IGwgfHwgMTtcbiAgICBpZiAobWUubGV2ZWwgPiBsdiAtIDEpIHtcbiAgICAgIHNldExldmVsKG1lLmxldmVsIC0gbHYpO1xuICAgICAgZW1pdHRlci5lbWl0KCdtb2IubGV2ZWxkb3duJywgbWUsIG1lLmxldmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vYjtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBtb2JzID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLmN1YmUubW9iID0gbW9icztcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2NvbnRyYS5lbWl0dGVyLmpzJyk7XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuKGZ1bmN0aW9uIChyb290LCB1bmRlZmluZWQpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB1bmRlZiA9ICcnICsgdW5kZWZpbmVkO1xuICBmdW5jdGlvbiBhdG9hIChhLCBuKSB7IHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhLCBuKTsgfVxuICBmdW5jdGlvbiBkZWJvdW5jZSAoZm4sIGFyZ3MsIGN0eCkgeyBpZiAoIWZuKSB7IHJldHVybjsgfSB0aWNrKGZ1bmN0aW9uIHJ1biAoKSB7IGZuLmFwcGx5KGN0eCB8fCBudWxsLCBhcmdzIHx8IFtdKTsgfSk7IH1cblxuICAvLyBjcm9zcy1wbGF0Zm9ybSB0aWNrZXJcbiAgdmFyIHNpID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJywgdGljaztcbiAgaWYgKHNpKSB7XG4gICAgdGljayA9IGZ1bmN0aW9uIChmbikgeyBzZXRJbW1lZGlhdGUoZm4pOyB9O1xuICB9IGVsc2UgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSB1bmRlZiAmJiBwcm9jZXNzLm5leHRUaWNrKSB7XG4gICAgdGljayA9IHByb2Nlc3MubmV4dFRpY2s7XG4gIH0gZWxzZSB7XG4gICAgdGljayA9IGZ1bmN0aW9uIChmbikgeyBzZXRUaW1lb3V0KGZuLCAwKTsgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9lbWl0dGVyICh0aGluZywgb3B0aW9ucykge1xuICAgIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgZXZ0ID0ge307XG4gICAgaWYgKHRoaW5nID09PSB1bmRlZmluZWQpIHsgdGhpbmcgPSB7fTsgfVxuICAgIHRoaW5nLm9uID0gZnVuY3Rpb24gKHR5cGUsIGZuKSB7XG4gICAgICBpZiAoIWV2dFt0eXBlXSkge1xuICAgICAgICBldnRbdHlwZV0gPSBbZm5dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZ0W3R5cGVdLnB1c2goZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgdGhpbmcub25jZSA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgICAgZm4uX29uY2UgPSB0cnVlOyAvLyB0aGluZy5vZmYoZm4pIHN0aWxsIHdvcmtzIVxuICAgICAgdGhpbmcub24odHlwZSwgZm4pO1xuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgdGhpbmcub2ZmID0gZnVuY3Rpb24gKHR5cGUsIGZuKSB7XG4gICAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAoYyA9PT0gMSkge1xuICAgICAgICBkZWxldGUgZXZ0W3R5cGVdO1xuICAgICAgfSBlbHNlIGlmIChjID09PSAwKSB7XG4gICAgICAgIGV2dCA9IHt9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGV0ID0gZXZ0W3R5cGVdO1xuICAgICAgICBpZiAoIWV0KSB7IHJldHVybiB0aGluZzsgfVxuICAgICAgICBldC5zcGxpY2UoZXQuaW5kZXhPZihmbiksIDEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgdGhpbmcuZW1pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjdHggPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhdG9hKGFyZ3VtZW50cyk7XG4gICAgICB2YXIgdHlwZSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgIHZhciBldCA9IGV2dFt0eXBlXTtcbiAgICAgIGlmICh0eXBlID09PSAnZXJyb3InICYmIG9wdHMudGhyb3dzICE9PSBmYWxzZSAmJiAhZXQpIHsgdGhyb3cgYXJncy5sZW5ndGggPT09IDEgPyBhcmdzWzBdIDogYXJnczsgfVxuICAgICAgaWYgKCFldCkgeyByZXR1cm4gdGhpbmc7IH1cbiAgICAgIGV2dFt0eXBlXSA9IGV0LmZpbHRlcihmdW5jdGlvbiBlbWl0dGVyIChsaXN0ZW4pIHtcbiAgICAgICAgaWYgKG9wdHMuYXN5bmMpIHsgZGVib3VuY2UobGlzdGVuLCBhcmdzLCBjdHgpOyB9IGVsc2UgeyBsaXN0ZW4uYXBwbHkoY3R4LCBhcmdzKTsgfVxuICAgICAgICByZXR1cm4gIWxpc3Rlbi5fb25jZTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaW5nO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaW5nO1xuICB9XG5cbiAgLy8gY3Jvc3MtcGxhdGZvcm0gZXhwb3J0XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSB1bmRlZiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gX2VtaXR0ZXI7XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5jb250cmEgPSByb290LmNvbnRyYSB8fCB7fTtcbiAgICByb290LmNvbnRyYS5lbWl0dGVyID0gX2VtaXR0ZXI7XG4gIH1cbn0pKHRoaXMpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIi9Vc2Vycy9uaWNvLy5udm0vdjAuMTAuMjYvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIikpIiwidmFyIHBvc2VyID0gcmVxdWlyZSgnLi9zcmMvbm9kZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBvc2VyO1xuXG5bJ0FycmF5JywgJ0Z1bmN0aW9uJywgJ09iamVjdCcsICdEYXRlJywgJ1N0cmluZyddLmZvckVhY2gocG9zZSk7XG5cbmZ1bmN0aW9uIHBvc2UgKHR5cGUpIHtcbiAgcG9zZXJbdHlwZV0gPSBmdW5jdGlvbiBwb3NlQ29tcHV0ZWRUeXBlICgpIHsgcmV0dXJuIHBvc2VyKHR5cGUpOyB9O1xufVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZCA9IGdsb2JhbC5kb2N1bWVudDtcblxuZnVuY3Rpb24gcG9zZXIgKHR5cGUpIHtcbiAgdmFyIGlmcmFtZSA9IGQuY3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG5cbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIGQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuXG4gIHJldHVybiBtYXAodHlwZSwgaWZyYW1lLmNvbnRlbnRXaW5kb3cpO1xufVxuXG5mdW5jdGlvbiBtYXAgKHR5cGUsIHNvdXJjZSkgeyAvLyBmb3J3YXJkIHBvbHlmaWxscyB0byB0aGUgc3RvbGVuIHJlZmVyZW5jZSFcbiAgdmFyIG9yaWdpbmFsID0gd2luZG93W3R5cGVdLnByb3RvdHlwZTtcbiAgdmFyIHZhbHVlID0gc291cmNlW3R5cGVdO1xuICB2YXIgcHJvcDtcblxuICBmb3IgKHByb3AgaW4gb3JpZ2luYWwpIHtcbiAgICB2YWx1ZS5wcm90b3R5cGVbcHJvcF0gPSBvcmlnaW5hbFtwcm9wXTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwb3NlcjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBleHBhbmRvID0gJ3Nla3Rvci0nICsgRGF0ZS5ub3coKTtcbnZhciByc2libGluZ3MgPSAvWyt+XS87XG52YXIgZG9jdW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgZGVsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xudmFyIG1hdGNoID0gZGVsLm1hdGNoZXMgfHxcbiAgICAgICAgICAgIGRlbC53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgIGRlbC5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgIGRlbC5vTWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICBkZWwubXNNYXRjaGVzU2VsZWN0b3I7XG5cbmZ1bmN0aW9uIHFzYSAoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgdmFyIGV4aXN0ZWQsIGlkLCBwcmVmaXgsIHByZWZpeGVkLCBhZGFwdGVyLCBoYWNrID0gY29udGV4dCAhPT0gZG9jdW1lbnQ7XG4gIGlmIChoYWNrKSB7IC8vIGlkIGhhY2sgZm9yIGNvbnRleHQtcm9vdGVkIHF1ZXJpZXNcbiAgICBleGlzdGVkID0gY29udGV4dC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgaWQgPSBleGlzdGVkIHx8IGV4cGFuZG87XG4gICAgcHJlZml4ID0gJyMnICsgaWQgKyAnICc7XG4gICAgcHJlZml4ZWQgPSBwcmVmaXggKyBzZWxlY3Rvci5yZXBsYWNlKC8sL2csICcsJyArIHByZWZpeCk7XG4gICAgYWRhcHRlciA9IHJzaWJsaW5ncy50ZXN0KHNlbGVjdG9yKSAmJiBjb250ZXh0LnBhcmVudE5vZGU7XG4gICAgaWYgKCFleGlzdGVkKSB7IGNvbnRleHQuc2V0QXR0cmlidXRlKCdpZCcsIGlkKTsgfVxuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIChhZGFwdGVyIHx8IGNvbnRleHQpLnF1ZXJ5U2VsZWN0b3JBbGwocHJlZml4ZWQgfHwgc2VsZWN0b3IpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9IGZpbmFsbHkge1xuICAgIGlmIChleGlzdGVkID09PSBudWxsKSB7IGNvbnRleHQucmVtb3ZlQXR0cmlidXRlKCdpZCcpOyB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZCAoc2VsZWN0b3IsIGN0eCwgY29sbGVjdGlvbiwgc2VlZCkge1xuICB2YXIgZWxlbWVudDtcbiAgdmFyIGNvbnRleHQgPSBjdHggfHwgZG9jdW1lbnQ7XG4gIHZhciByZXN1bHRzID0gY29sbGVjdGlvbiB8fCBbXTtcbiAgdmFyIGkgPSAwO1xuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG4gIGlmIChjb250ZXh0Lm5vZGVUeXBlICE9PSAxICYmIGNvbnRleHQubm9kZVR5cGUgIT09IDkpIHtcbiAgICByZXR1cm4gW107IC8vIGJhaWwgaWYgY29udGV4dCBpcyBub3QgYW4gZWxlbWVudCBvciBkb2N1bWVudFxuICB9XG4gIGlmIChzZWVkKSB7XG4gICAgd2hpbGUgKChlbGVtZW50ID0gc2VlZFtpKytdKSkge1xuICAgICAgaWYgKG1hdGNoZXNTZWxlY3RvcihlbGVtZW50LCBzZWxlY3RvcikpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXN1bHRzLnB1c2guYXBwbHkocmVzdWx0cywgcXNhKHNlbGVjdG9yLCBjb250ZXh0KSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMgKHNlbGVjdG9yLCBlbGVtZW50cykge1xuICByZXR1cm4gZmluZChzZWxlY3RvciwgbnVsbCwgbnVsbCwgZWxlbWVudHMpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzU2VsZWN0b3IgKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBtYXRjaC5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kO1xuXG5maW5kLm1hdGNoZXMgPSBtYXRjaGVzO1xuZmluZC5tYXRjaGVzU2VsZWN0b3IgPSBtYXRjaGVzU2VsZWN0b3I7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcG9zZXIgPSByZXF1aXJlKCdwb3NlcicpO1xudmFyIERvbWludXMgPSBwb3Nlci5BcnJheSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvbWludXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gcmVxdWlyZSgnLi9wdWJsaWMnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9jb3JlJyk7XG52YXIgZG9tID0gcmVxdWlyZSgnLi9kb20nKTtcbnZhciBjbGFzc2VzID0gcmVxdWlyZSgnLi9jbGFzc2VzJyk7XG52YXIgRG9taW51cyA9IHJlcXVpcmUoJy4vRG9taW51cy5jdG9yJyk7XG5cbmZ1bmN0aW9uIGVxdWFscyAoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGVxdWFscyAoZWxlbSkge1xuICAgIHJldHVybiBkb20ubWF0Y2hlcyhlbGVtLCBzZWxlY3Rvcik7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0cmFpZ2h0IChwcm9wLCBvbmUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRvbU1hcHBpbmcgKHNlbGVjdG9yKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMubWFwKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICByZXR1cm4gZG9tW3Byb3BdKGVsZW0sIHNlbGVjdG9yKTtcbiAgICB9KTtcbiAgICB2YXIgcmVzdWx0cyA9IGNvcmUuZmxhdHRlbihyZXN1bHQpO1xuICAgIHJldHVybiBvbmUgPyByZXN1bHRzWzBdIDogcmVzdWx0cztcbiAgfTtcbn1cblxuRG9taW51cy5wcm90b3R5cGUucHJldiA9IHN0cmFpZ2h0KCdwcmV2Jyk7XG5Eb21pbnVzLnByb3RvdHlwZS5uZXh0ID0gc3RyYWlnaHQoJ25leHQnKTtcbkRvbWludXMucHJvdG90eXBlLnBhcmVudCA9IHN0cmFpZ2h0KCdwYXJlbnQnKTtcbkRvbWludXMucHJvdG90eXBlLnBhcmVudHMgPSBzdHJhaWdodCgncGFyZW50cycpO1xuRG9taW51cy5wcm90b3R5cGUuY2hpbGRyZW4gPSBzdHJhaWdodCgnY2hpbGRyZW4nKTtcbkRvbWludXMucHJvdG90eXBlLmZpbmQgPSBzdHJhaWdodCgncXNhJyk7XG5Eb21pbnVzLnByb3RvdHlwZS5maW5kT25lID0gc3RyYWlnaHQoJ3FzJywgdHJ1ZSk7XG5cbkRvbWludXMucHJvdG90eXBlLndoZXJlID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0aGlzLmZpbHRlcihlcXVhbHMoc2VsZWN0b3IpKTtcbn07XG5cbkRvbWludXMucHJvdG90eXBlLmlzID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gIHJldHVybiB0aGlzLnNvbWUoZXF1YWxzKHNlbGVjdG9yKSk7XG59O1xuXG5Eb21pbnVzLnByb3RvdHlwZS5pID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gIHJldHVybiBuZXcgRG9taW51cyh0aGlzW2luZGV4XSk7XG59O1xuXG5mdW5jdGlvbiBjb21wYXJlRmFjdG9yeSAoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNvbXBhcmUgKCkge1xuICAgICQuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5mb3JFYWNoKGZuLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn1cblxuRG9taW51cy5wcm90b3R5cGUuYW5kID0gY29tcGFyZUZhY3RvcnkoZnVuY3Rpb24gYWRkT25lIChlbGVtKSB7XG4gIGlmICh0aGlzLmluZGV4T2YoZWxlbSkgPT09IC0xKSB7XG4gICAgdGhpcy5wdXNoKGVsZW0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufSk7XG5cbkRvbWludXMucHJvdG90eXBlLmJ1dCA9IGNvbXBhcmVGYWN0b3J5KGZ1bmN0aW9uIGFkZE9uZSAoZWxlbSkge1xuICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2YoZWxlbSk7XG4gIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59KTtcblxuRG9taW51cy5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAodHlwZXMsIGZpbHRlciwgZm4pIHtcbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgdHlwZXMuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICBkb20ub24oZWxlbSwgdHlwZSwgZmlsdGVyLCBmbik7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkRvbWludXMucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uICh0eXBlcywgZmlsdGVyLCBmbikge1xuICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICB0eXBlcy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIGRvbS5vZmYoZWxlbSwgdHlwZSwgZmlsdGVyLCBmbik7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbltcbiAgWydhZGRDbGFzcycsIGNsYXNzZXMuYWRkXSxcbiAgWydyZW1vdmVDbGFzcycsIGNsYXNzZXMucmVtb3ZlXSxcbiAgWydzZXRDbGFzcycsIGNsYXNzZXMuc2V0XSxcbiAgWydyZW1vdmVDbGFzcycsIGNsYXNzZXMucmVtb3ZlXSxcbiAgWydyZW1vdmUnLCBkb20ucmVtb3ZlXVxuXS5mb3JFYWNoKG1hcE1ldGhvZHMpO1xuXG5mdW5jdGlvbiBtYXBNZXRob2RzIChkYXRhKSB7XG4gIERvbWludXMucHJvdG90eXBlW2RhdGFbMF1dID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICBkYXRhWzFdKGVsZW0sIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn1cblxuW1xuICBbJ2FwcGVuZCcsIGRvbS5hcHBlbmRdLFxuICBbJ2FwcGVuZFRvJywgZG9tLmFwcGVuZFRvXSxcbiAgWydwcmVwZW5kJywgZG9tLnByZXBlbmRdLFxuICBbJ3ByZXBlbmRUbycsIGRvbS5wcmVwZW5kVG9dLFxuICBbJ2JlZm9yZScsIGRvbS5iZWZvcmVdLFxuICBbJ2JlZm9yZU9mJywgZG9tLmJlZm9yZU9mXSxcbiAgWydhZnRlcicsIGRvbS5hZnRlcl0sXG4gIFsnYWZ0ZXJPZicsIGRvbS5hZnRlck9mXSxcbiAgWydzaG93JywgZG9tLnNob3ddLFxuICBbJ2hpZGUnLCBkb20uaGlkZV1cbl0uZm9yRWFjaChtYXBNYW5pcHVsYXRpb24pO1xuXG5mdW5jdGlvbiBtYXBNYW5pcHVsYXRpb24gKGRhdGEpIHtcbiAgRG9taW51cy5wcm90b3R5cGVbZGF0YVswXV0gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBkYXRhWzFdKHRoaXMsIHZhbHVlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn1cblxuRG9taW51cy5wcm90b3R5cGUuaGFzQ2xhc3MgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuc29tZShmdW5jdGlvbiAoZWxlbSkge1xuICAgIHJldHVybiBjbGFzc2VzLmNvbnRhaW5zKGVsZW0sIHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Eb21pbnVzLnByb3RvdHlwZS5hdHRyID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gIHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMjtcbiAgdmFyIHJlc3VsdCA9IHRoaXMubWFwKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgcmV0dXJuIGdldHRlciA/IGRvbS5hdHRyKGVsZW0sIG5hbWUpIDogZG9tLmF0dHIoZWxlbSwgbmFtZSwgdmFsdWUpO1xuICB9KTtcbiAgcmV0dXJuIGdldHRlciA/IHJlc3VsdFswXSA6IHRoaXM7XG59O1xuXG5mdW5jdGlvbiBrZXlWYWx1ZSAoa2V5LCB2YWx1ZSkge1xuICB2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDI7XG4gIGlmIChnZXR0ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPyBkb21ba2V5XSh0aGlzWzBdKSA6ICcnO1xuICB9XG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xuICAgIGRvbVtrZXldKGVsZW0sIHZhbHVlKTtcbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBrZXlWYWx1ZVByb3BlcnR5IChwcm9wKSB7XG4gIERvbWludXMucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24gYWNjZXNzb3IgKHZhbHVlKSB7XG4gICAgdmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAxO1xuICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgIHJldHVybiBrZXlWYWx1ZS5jYWxsKHRoaXMsIHByb3ApO1xuICAgIH1cbiAgICByZXR1cm4ga2V5VmFsdWUuY2FsbCh0aGlzLCBwcm9wLCB2YWx1ZSk7XG4gIH07XG59XG5cblsnaHRtbCcsICd0ZXh0JywgJ3ZhbHVlJ10uZm9yRWFjaChrZXlWYWx1ZVByb3BlcnR5KTtcblxuRG9taW51cy5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoZWxlbSkge1xuICAgIHJldHVybiBkb20uY2xvbmUoZWxlbSk7XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3B1YmxpYycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xudmFyIHdoaXRlc3BhY2UgPSAvXFxzKy9nO1xuXG5mdW5jdGlvbiBpbnRlcnByZXQgKGlucHV0KSB7XG4gIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gaW5wdXQucmVwbGFjZSh0cmltLCAnJykuc3BsaXQod2hpdGVzcGFjZSkgOiBpbnB1dDtcbn1cblxuZnVuY3Rpb24gY2xhc3NlcyAobm9kZSkge1xuICByZXR1cm4gbm9kZS5jbGFzc05hbWUucmVwbGFjZSh0cmltLCAnJykuc3BsaXQod2hpdGVzcGFjZSk7XG59XG5cbmZ1bmN0aW9uIHNldCAobm9kZSwgaW5wdXQpIHtcbiAgbm9kZS5jbGFzc05hbWUgPSBpbnRlcnByZXQoaW5wdXQpLmpvaW4oJyAnKTtcbn1cblxuZnVuY3Rpb24gYWRkIChub2RlLCBpbnB1dCkge1xuICB2YXIgY3VycmVudCA9IHJlbW92ZShub2RlLCBpbnB1dCk7XG4gIHZhciB2YWx1ZXMgPSBpbnRlcnByZXQoaW5wdXQpO1xuICBjdXJyZW50LnB1c2guYXBwbHkoY3VycmVudCwgdmFsdWVzKTtcbiAgc2V0KG5vZGUsIGN1cnJlbnQpO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlIChub2RlLCBpbnB1dCkge1xuICB2YXIgY3VycmVudCA9IGNsYXNzZXMobm9kZSk7XG4gIHZhciB2YWx1ZXMgPSBpbnRlcnByZXQoaW5wdXQpO1xuICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgaSA9IGN1cnJlbnQuaW5kZXhPZih2YWx1ZSk7XG4gICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICBjdXJyZW50LnNwbGljZShpLCAxKTtcbiAgICB9XG4gIH0pO1xuICBzZXQobm9kZSwgY3VycmVudCk7XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiBjb250YWlucyAobm9kZSwgaW5wdXQpIHtcbiAgdmFyIGN1cnJlbnQgPSBjbGFzc2VzKG5vZGUpO1xuICB2YXIgdmFsdWVzID0gaW50ZXJwcmV0KGlucHV0KTtcblxuICByZXR1cm4gdmFsdWVzLmV2ZXJ5KGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBjdXJyZW50LmluZGV4T2YodmFsdWUpICE9PSAtMTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGQ6IGFkZCxcbiAgcmVtb3ZlOiByZW1vdmUsXG4gIGNvbnRhaW5zOiBjb250YWlucyxcbiAgc2V0OiBzZXQsXG4gIGdldDogY2xhc3Nlc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlc3QgPSByZXF1aXJlKCcuL3Rlc3QnKTtcbnZhciBEb21pbnVzID0gcmVxdWlyZSgnLi9Eb21pbnVzLmN0b3InKTtcbnZhciBwcm90byA9IERvbWludXMucHJvdG90eXBlO1xuXG5mdW5jdGlvbiBBcHBsaWVkIChhcmdzKSB7XG4gIHJldHVybiBEb21pbnVzLmFwcGx5KHRoaXMsIGFyZ3MpO1xufVxuXG5BcHBsaWVkLnByb3RvdHlwZSA9IHByb3RvO1xuXG5bJ21hcCcsICdmaWx0ZXInLCAnY29uY2F0J10uZm9yRWFjaChlbnN1cmUpO1xuXG5mdW5jdGlvbiBlbnN1cmUgKGtleSkge1xuICB2YXIgb3JpZ2luYWwgPSBwcm90b1trZXldO1xuICBwcm90b1trZXldID0gZnVuY3Rpb24gYXBwbGllZCAoKSB7XG4gICAgcmV0dXJuIGFwcGx5KG9yaWdpbmFsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhcHBseSAoYSkge1xuICByZXR1cm4gbmV3IEFwcGxpZWQoYSk7XG59XG5cbmZ1bmN0aW9uIGNhc3QgKGEpIHtcbiAgaWYgKGEgaW5zdGFuY2VvZiBEb21pbnVzKSB7XG4gICAgcmV0dXJuIGE7XG4gIH1cbiAgaWYgKCFhKSB7XG4gICAgcmV0dXJuIG5ldyBEb21pbnVzKCk7XG4gIH1cbiAgaWYgKHRlc3QuaXNFbGVtZW50KGEpKSB7XG4gICAgcmV0dXJuIG5ldyBEb21pbnVzKGEpO1xuICB9XG4gIGlmICghdGVzdC5pc0FycmF5KGEpKSB7XG4gICAgcmV0dXJuIG5ldyBEb21pbnVzKCk7XG4gIH1cbiAgcmV0dXJuIGFwcGx5KGEpLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuICAgIHJldHVybiB0ZXN0LmlzRWxlbWVudChpKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW4gKGEsIGNhY2hlKSB7XG4gIHJldHVybiBhLnJlZHVjZShmdW5jdGlvbiAoY3VycmVudCwgaXRlbSkge1xuICAgIGlmIChEb21pbnVzLmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgIHJldHVybiBmbGF0dGVuKGl0ZW0sIGN1cnJlbnQpO1xuICAgIH0gZWxzZSBpZiAoY3VycmVudC5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgcmV0dXJuIGN1cnJlbnQuY29uY2F0KGl0ZW0pO1xuICAgIH1cbiAgICByZXR1cm4gY3VycmVudDtcbiAgfSwgY2FjaGUgfHwgbmV3IERvbWludXMoKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcHBseTogYXBwbHksXG4gIGNhc3Q6IGNhc3QsXG4gIGZsYXR0ZW46IGZsYXR0ZW5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzZWt0b3IgPSByZXF1aXJlKCdzZWt0b3InKTtcbnZhciBEb21pbnVzID0gcmVxdWlyZSgnLi9Eb21pbnVzLmN0b3InKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9jb3JlJyk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgnLi9ldmVudHMnKTtcbnZhciB0ZXh0ID0gcmVxdWlyZSgnLi90ZXh0Jyk7XG52YXIgdGVzdCA9IHJlcXVpcmUoJy4vdGVzdCcpO1xudmFyIGFwaSA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgZGVsZWdhdGVzID0ge307XG5cbmZ1bmN0aW9uIGNhc3RDb250ZXh0IChjb250ZXh0KSB7XG4gIGlmICh0eXBlb2YgY29udGV4dCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gYXBpLnFzKG51bGwsIGNvbnRleHQpO1xuICB9XG4gIGlmICh0ZXN0LmlzRWxlbWVudChjb250ZXh0KSkge1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG4gIGlmIChjb250ZXh0IGluc3RhbmNlb2YgRG9taW51cykge1xuICAgIHJldHVybiBjb250ZXh0WzBdO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5hcGkucXNhID0gZnVuY3Rpb24gKGVsZW0sIHNlbGVjdG9yKSB7XG4gIHZhciByZXN1bHRzID0gbmV3IERvbWludXMoKTtcbiAgcmV0dXJuIHNla3RvcihzZWxlY3RvciwgY2FzdENvbnRleHQoZWxlbSksIHJlc3VsdHMpO1xufTtcblxuYXBpLnFzID0gZnVuY3Rpb24gKGVsZW0sIHNlbGVjdG9yKSB7XG4gIHJldHVybiBhcGkucXNhKGVsZW0sIHNlbGVjdG9yKVswXTtcbn07XG5cbmFwaS5tYXRjaGVzID0gZnVuY3Rpb24gKGVsZW0sIHNlbGVjdG9yKSB7XG4gIHJldHVybiBzZWt0b3IubWF0Y2hlc1NlbGVjdG9yKGVsZW0sIHNlbGVjdG9yKTtcbn07XG5cbmZ1bmN0aW9uIHJlbGF0ZWRGYWN0b3J5IChwcm9wKSB7XG4gIHJldHVybiBmdW5jdGlvbiByZWxhdGVkIChlbGVtLCBzZWxlY3Rvcikge1xuICAgIHZhciByZWxhdGl2ZSA9IGVsZW1bcHJvcF07XG4gICAgaWYgKHJlbGF0aXZlKSB7XG4gICAgICBpZiAoIXNlbGVjdG9yIHx8IGFwaS5tYXRjaGVzKHJlbGF0aXZlLCBzZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIGNvcmUuY2FzdChyZWxhdGl2ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgRG9taW51cygpO1xuICB9O1xufVxuXG5hcGkucHJldiA9IHJlbGF0ZWRGYWN0b3J5KCdwcmV2aW91c1NpYmxpbmcnKTtcbmFwaS5uZXh0ID0gcmVsYXRlZEZhY3RvcnkoJ25leHRTaWJsaW5nJyk7XG5hcGkucGFyZW50ID0gcmVsYXRlZEZhY3RvcnkoJ3BhcmVudEVsZW1lbnQnKTtcblxuZnVuY3Rpb24gbWF0Y2hlcyAoZWxlbSwgdmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERvbWludXMpIHtcbiAgICByZXR1cm4gdmFsdWUuaW5kZXhPZihlbGVtKSAhPT0gLTE7XG4gIH1cbiAgaWYgKHRlc3QuaXNFbGVtZW50KHZhbHVlKSkge1xuICAgIHJldHVybiBlbGVtID09PSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gYXBpLm1hdGNoZXMoZWxlbSwgdmFsdWUpO1xufVxuXG5hcGkucGFyZW50cyA9IGZ1bmN0aW9uIChlbGVtLCB2YWx1ZSkge1xuICB2YXIgbm9kZXMgPSBbXTtcbiAgdmFyIG5vZGUgPSBlbGVtO1xuICB3aGlsZSAobm9kZS5wYXJlbnRFbGVtZW50KSB7XG4gICAgaWYgKG1hdGNoZXMobm9kZS5wYXJlbnRFbGVtZW50LCB2YWx1ZSkpIHtcbiAgICAgIG5vZGVzLnB1c2gobm9kZS5wYXJlbnRFbGVtZW50KTtcbiAgICB9XG4gICAgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcbiAgfVxuICByZXR1cm4gY29yZS5hcHBseShub2Rlcyk7XG59O1xuXG5hcGkuY2hpbGRyZW4gPSBmdW5jdGlvbiAoZWxlbSwgdmFsdWUpIHtcbiAgdmFyIG5vZGVzID0gW107XG4gIHZhciBjaGlsZHJlbiA9IGVsZW0uY2hpbGRyZW47XG4gIHZhciBjaGlsZDtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgaWYgKG1hdGNoZXMoY2hpbGQsIHZhbHVlKSkge1xuICAgICAgbm9kZXMucHVzaChjaGlsZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb3JlLmFwcGx5KG5vZGVzKTtcbn07XG5cbi8vIHRoaXMgbWV0aG9kIGNhY2hlcyBkZWxlZ2F0ZXMgc28gdGhhdCAub2ZmKCkgd29ya3Mgc2VhbWxlc3NseVxuZnVuY3Rpb24gZGVsZWdhdGUgKHJvb3QsIGZpbHRlciwgZm4pIHtcbiAgaWYgKGRlbGVnYXRlc1tmbi5fZGRdKSB7XG4gICAgcmV0dXJuIGRlbGVnYXRlc1tmbi5fZGRdO1xuICB9XG4gIGZuLl9kZCA9IERhdGUubm93KCk7XG4gIGRlbGVnYXRlc1tmbi5fZGRdID0gZGVsZWdhdG9yO1xuICBmdW5jdGlvbiBkZWxlZ2F0b3IgKGUpIHtcbiAgICB2YXIgZWxlbSA9IGUudGFyZ2V0O1xuICAgIHdoaWxlIChlbGVtICYmIGVsZW0gIT09IHJvb3QpIHtcbiAgICAgIGlmIChhcGkubWF0Y2hlcyhlbGVtLCBmaWx0ZXIpKSB7XG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IHJldHVybjtcbiAgICAgIH1cbiAgICAgIGVsZW0gPSBlbGVtLnBhcmVudEVsZW1lbnQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWxlZ2F0b3I7XG59XG5cbmFwaS5vbiA9IGZ1bmN0aW9uIChlbGVtLCB0eXBlLCBmaWx0ZXIsIGZuKSB7XG4gIGlmIChmbiA9PT0gdm9pZCAwKSB7XG4gICAgZXZlbnRzLmFkZChlbGVtLCB0eXBlLCBmaWx0ZXIpOyAvLyBmaWx0ZXIgX2lzXyBmblxuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5hZGQoZWxlbSwgdHlwZSwgZGVsZWdhdGUoZWxlbSwgZmlsdGVyLCBmbikpO1xuICB9XG59O1xuXG5hcGkub2ZmID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGZpbHRlciwgZm4pIHtcbiAgaWYgKGZuID09PSB2b2lkIDApIHtcbiAgICBldmVudHMucmVtb3ZlKGVsZW0sIHR5cGUsIGZpbHRlcik7IC8vIGZpbHRlciBfaXNfIGZuXG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLnJlbW92ZShlbGVtLCB0eXBlLCBkZWxlZ2F0ZShlbGVtLCBmaWx0ZXIsIGZuKSk7XG4gIH1cbn07XG5cbmFwaS5odG1sID0gZnVuY3Rpb24gKGVsZW0sIGh0bWwpIHtcbiAgdmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAyO1xuICBpZiAoZ2V0dGVyKSB7XG4gICAgcmV0dXJuIGVsZW0uaW5uZXJIVE1MO1xuICB9IGVsc2Uge1xuICAgIGVsZW0uaW5uZXJIVE1MID0gaHRtbDtcbiAgfVxufTtcblxuYXBpLnRleHQgPSBmdW5jdGlvbiAoZWxlbSwgdGV4dCkge1xuICB2YXIgY2hlY2thYmxlID0gdGVzdC5pc0NoZWNrYWJsZShlbGVtKTtcbiAgdmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAyO1xuICBpZiAoZ2V0dGVyKSB7XG4gICAgcmV0dXJuIGNoZWNrYWJsZSA/IGVsZW0udmFsdWUgOiBlbGVtLmlubmVyVGV4dCB8fCBlbGVtLnRleHRDb250ZW50O1xuICB9IGVsc2UgaWYgKGNoZWNrYWJsZSkge1xuICAgIGVsZW0udmFsdWUgPSB0ZXh0O1xuICB9IGVsc2Uge1xuICAgIGVsZW0uaW5uZXJUZXh0ID0gZWxlbS50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cbn07XG5cbmFwaS52YWx1ZSA9IGZ1bmN0aW9uIChlbGVtLCB2YWx1ZSkge1xuICB2YXIgY2hlY2thYmxlID0gdGVzdC5pc0NoZWNrYWJsZShlbGVtKTtcbiAgdmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAyO1xuICBpZiAoZ2V0dGVyKSB7XG4gICAgcmV0dXJuIGNoZWNrYWJsZSA/IGVsZW0uY2hlY2tlZCA6IGVsZW0udmFsdWU7XG4gIH0gZWxzZSBpZiAoY2hlY2thYmxlKSB7XG4gICAgZWxlbS5jaGVja2VkID0gdmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS52YWx1ZSA9IHZhbHVlO1xuICB9XG59O1xuXG5hcGkuYXR0ciA9IGZ1bmN0aW9uIChlbGVtLCBuYW1lLCB2YWx1ZSkge1xuICB2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDM7XG4gIHZhciBjYW1lbCA9IHRleHQuaHlwaGVuVG9DYW1lbChuYW1lKTtcbiAgaWYgKGdldHRlcikge1xuICAgIGlmIChjYW1lbCBpbiBlbGVtKSB7XG4gICAgICByZXR1cm4gZWxlbVtjYW1lbF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlbGVtLmdldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIGlmIChjYW1lbCBpbiBlbGVtKSB7XG4gICAgZWxlbVtjYW1lbF0gPSB2YWx1ZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICB9XG59O1xuXG5hcGkubWFrZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHJldHVybiBuZXcgRG9taW51cyhkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpKTtcbn07XG5cbmFwaS5jbG9uZSA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gIHJldHVybiBlbGVtLmNsb25lTm9kZSh0cnVlKTtcbn07XG5cbmFwaS5yZW1vdmUgPSBmdW5jdGlvbiAoZWxlbSkge1xuICBpZiAoZWxlbS5wYXJlbnRFbGVtZW50KSB7XG4gICAgZWxlbS5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVsZW0pO1xuICB9XG59O1xuXG5hcGkuYXBwZW5kID0gZnVuY3Rpb24gKGVsZW0sIHRhcmdldCkge1xuICBpZiAobWFuaXB1bGF0aW9uR3VhcmQoZWxlbSwgdGFyZ2V0LCBhcGkuYXBwZW5kKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBlbGVtLmFwcGVuZENoaWxkKHRhcmdldCk7XG59O1xuXG5hcGkucHJlcGVuZCA9IGZ1bmN0aW9uIChlbGVtLCB0YXJnZXQpIHtcbiAgaWYgKG1hbmlwdWxhdGlvbkd1YXJkKGVsZW0sIHRhcmdldCwgYXBpLnByZXBlbmQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsZW0uaW5zZXJ0QmVmb3JlKHRhcmdldCwgZWxlbS5maXJzdENoaWxkKTtcbn07XG5cbmFwaS5iZWZvcmUgPSBmdW5jdGlvbiAoZWxlbSwgdGFyZ2V0KSB7XG4gIGlmIChtYW5pcHVsYXRpb25HdWFyZChlbGVtLCB0YXJnZXQsIGFwaS5iZWZvcmUpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbGVtLnBhcmVudEVsZW1lbnQpIHtcbiAgICBlbGVtLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhcmdldCwgZWxlbSk7XG4gIH1cbn07XG5cbmFwaS5hZnRlciA9IGZ1bmN0aW9uIChlbGVtLCB0YXJnZXQpIHtcbiAgaWYgKG1hbmlwdWxhdGlvbkd1YXJkKGVsZW0sIHRhcmdldCwgYXBpLmFmdGVyKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZWxlbS5wYXJlbnRFbGVtZW50KSB7XG4gICAgZWxlbS5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0YXJnZXQsIGVsZW0ubmV4dFNpYmxpbmcpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBtYW5pcHVsYXRpb25HdWFyZCAoZWxlbSwgdGFyZ2V0LCBmbikge1xuICB2YXIgcmlnaHQgPSB0YXJnZXQgaW5zdGFuY2VvZiBEb21pbnVzO1xuICB2YXIgbGVmdCA9IGVsZW0gaW5zdGFuY2VvZiBEb21pbnVzO1xuICBpZiAobGVmdCkge1xuICAgIGVsZW0uZm9yRWFjaChtYW5pcHVsYXRlTWFueSk7XG4gIH0gZWxzZSBpZiAocmlnaHQpIHtcbiAgICBtYW5pcHVsYXRlKGVsZW0sIHRydWUpO1xuICB9XG4gIHJldHVybiBsZWZ0IHx8IHJpZ2h0O1xuXG4gIGZ1bmN0aW9uIG1hbmlwdWxhdGUgKGVsZW0sIHByZWNvbmRpdGlvbikge1xuICAgIGlmIChyaWdodCkge1xuICAgICAgdGFyZ2V0LmZvckVhY2goZnVuY3Rpb24gKHRhcmdldCwgaikge1xuICAgICAgICBmbihlbGVtLCBjbG9uZVVubGVzcyh0YXJnZXQsIHByZWNvbmRpdGlvbiAmJiBqID09PSAwKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm4oZWxlbSwgY2xvbmVVbmxlc3ModGFyZ2V0LCBwcmVjb25kaXRpb24pKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYW5pcHVsYXRlTWFueSAoZWxlbSwgaSkge1xuICAgIG1hbmlwdWxhdGUoZWxlbSwgaSA9PT0gMCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2xvbmVVbmxlc3MgKHRhcmdldCwgY29uZGl0aW9uKSB7XG4gIHJldHVybiBjb25kaXRpb24gPyB0YXJnZXQgOiBhcGkuY2xvbmUodGFyZ2V0KTtcbn1cblxuWydhcHBlbmRUbycsICdwcmVwZW5kVG8nLCAnYmVmb3JlT2YnLCAnYWZ0ZXJPZiddLmZvckVhY2goZmxpcCk7XG5cbmZ1bmN0aW9uIGZsaXAgKGtleSkge1xuICB2YXIgb3JpZ2luYWwgPSBrZXkuc3BsaXQoL1tBLVpdLylbMF07XG4gIGFwaVtrZXldID0gZnVuY3Rpb24gKGVsZW0sIHRhcmdldCkge1xuICAgIGFwaVtvcmlnaW5hbF0odGFyZ2V0LCBlbGVtKTtcbiAgfTtcbn1cblxuYXBpLnNob3cgPSBmdW5jdGlvbiAoZWxlbSwgc2hvdWxkLCBpbnZlcnQpIHtcbiAgaWYgKGVsZW0gaW5zdGFuY2VvZiBEb21pbnVzKSB7XG4gICAgZWxlbS5mb3JFYWNoKHNob3dUZXN0KTtcbiAgfSBlbHNlIHtcbiAgICBzaG93VGVzdChlbGVtKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3dUZXN0IChjdXJyZW50KSB7XG4gICAgdmFyIG9rID0gc2hvdWxkID09PSB2b2lkIDAgfHwgc2hvdWxkID09PSB0cnVlIHx8IHR5cGVvZiBzaG91bGQgPT09ICdmdW5jdGlvbicgJiYgc2hvdWxkLmNhbGwoY3VycmVudCk7XG4gICAgZGlzcGxheShjdXJyZW50LCBpbnZlcnQgPyAhb2sgOiBvayk7XG4gIH1cbn07XG5cbmFwaS5oaWRlID0gZnVuY3Rpb24gKGVsZW0sIHNob3VsZCkge1xuICBhcGkuc2hvdyhlbGVtLCBzaG91bGQsIHRydWUpO1xufTtcblxuZnVuY3Rpb24gZGlzcGxheSAoZWxlbSwgc2hvdWxkKSB7XG4gIGlmIChzaG91bGQpIHtcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICB9IGVsc2Uge1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vRG9taW51cy5wcm90b3R5cGUnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFkZEV2ZW50ID0gYWRkRXZlbnRFYXN5O1xudmFyIHJlbW92ZUV2ZW50ID0gcmVtb3ZlRXZlbnRFYXN5O1xudmFyIGhhcmRDYWNoZSA9IFtdO1xuXG5pZiAoIXdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gIGFkZEV2ZW50ID0gYWRkRXZlbnRIYXJkO1xufVxuXG5pZiAoIXdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKSB7XG4gIHJlbW92ZUV2ZW50ID0gcmVtb3ZlRXZlbnRIYXJkO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudEVhc3kgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgcmV0dXJuIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldnQsIGZuKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRIYXJkIChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHJldHVybiBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldnQsIHdyYXAoZWxlbWVudCwgZXZ0LCBmbikpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudEVhc3kgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgcmV0dXJuIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIGZuKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRIYXJkIChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHJldHVybiBlbGVtZW50LmRldGFjaEV2ZW50KCdvbicgKyBldnQsIHVud3JhcChlbGVtZW50LCBldnQsIGZuKSk7XG59XG5cbmZ1bmN0aW9uIHdyYXBwZXJGYWN0b3J5IChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwcGVyIChvcmlnaW5hbEV2ZW50KSB7XG4gICAgdmFyIGUgPSBvcmlnaW5hbEV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICBlLnRhcmdldCA9IGUudGFyZ2V0IHx8IGUuc3JjRWxlbWVudDtcbiAgICBlLnByZXZlbnREZWZhdWx0ICA9IGUucHJldmVudERlZmF1bHQgIHx8IGZ1bmN0aW9uIHByZXZlbnREZWZhdWx0ICgpIHsgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlOyB9O1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uID0gZS5zdG9wUHJvcGFnYXRpb24gfHwgZnVuY3Rpb24gc3RvcFByb3BhZ2F0aW9uICgpIHsgZS5jYW5jZWxCdWJibGUgPSB0cnVlOyB9O1xuICAgIGZuLmNhbGwoZWxlbWVudCwgZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHdyYXAgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgdmFyIHdyYXBwZXIgPSB1bndyYXAoZWxlbWVudCwgZXZ0LCBmbikgfHwgd3JhcHBlckZhY3RvcnkoZWxlbWVudCwgZXZ0LCBmbik7XG4gIGhhcmRDYWNoZS5wdXNoKHtcbiAgICB3cmFwcGVyOiB3cmFwcGVyLFxuICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgZXZ0OiBldnQsXG4gICAgZm46IGZuXG4gIH0pO1xuICByZXR1cm4gd3JhcHBlcjtcbn1cblxuZnVuY3Rpb24gdW53cmFwIChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHZhciBpID0gZmluZChlbGVtZW50LCBldnQsIGZuKTtcbiAgaWYgKGkpIHtcbiAgICB2YXIgd3JhcHBlciA9IGhhcmRDYWNoZVtpXS53cmFwcGVyO1xuICAgIGhhcmRDYWNoZS5zcGxpY2UoaSwgMSk7IC8vIGZyZWUgdXAgYSB0YWQgb2YgbWVtb3J5XG4gICAgcmV0dXJuIHdyYXBwZXI7XG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZCAoZWxlbWVudCwgZXZ0LCBmbikge1xuICB2YXIgaSwgaXRlbTtcbiAgZm9yIChpID0gMDsgaSA8IGhhcmRDYWNoZS5sZW5ndGg7IGkrKykge1xuICAgIGl0ZW0gPSBoYXJkQ2FjaGVbaV07XG4gICAgaWYgKGl0ZW0uZWxlbWVudCA9PT0gZWxlbWVudCAmJiBpdGVtLmV2dCA9PT0gZXZ0ICYmIGl0ZW0uZm4gPT09IGZuKSB7XG4gICAgICByZXR1cm4gaTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZDogYWRkRXZlbnQsXG4gIHJlbW92ZTogcmVtb3ZlRXZlbnRcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL2NvcmUnKTtcbnZhciBEb21pbnVzID0gcmVxdWlyZSgnLi9Eb21pbnVzLmN0b3InKTtcbnZhciB0YWcgPSAvXlxccyo8KFthLXpdKyg/Oi1bYS16XSspPylcXHMqXFwvPz5cXHMqJC9pO1xuXG5mdW5jdGlvbiBhcGkgKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gIHZhciBub3RUZXh0ID0gdHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJztcbiAgaWYgKG5vdFRleHQgJiYgYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICByZXR1cm4gY29yZS5jYXN0KHNlbGVjdG9yKTtcbiAgfVxuICBpZiAobm90VGV4dCkge1xuICAgIHJldHVybiBuZXcgRG9taW51cygpO1xuICB9XG4gIHZhciBtYXRjaGVzID0gc2VsZWN0b3IubWF0Y2godGFnKTtcbiAgaWYgKG1hdGNoZXMpIHtcbiAgICByZXR1cm4gZG9tLm1ha2UobWF0Y2hlc1sxXSk7XG4gIH1cbiAgcmV0dXJuIGFwaS5maW5kKHNlbGVjdG9yLCBjb250ZXh0KTtcbn1cblxuYXBpLmZpbmQgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgcmV0dXJuIGRvbS5xc2EoY29udGV4dCwgc2VsZWN0b3IpO1xufTtcblxuYXBpLmZpbmRPbmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgcmV0dXJuIGRvbS5xcyhjb250ZXh0LCBzZWxlY3Rvcik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwaTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG5vZGVPYmplY3RzID0gdHlwZW9mIE5vZGUgPT09ICdvYmplY3QnO1xudmFyIGVsZW1lbnRPYmplY3RzID0gdHlwZW9mIEhUTUxFbGVtZW50ID09PSAnb2JqZWN0JztcblxuZnVuY3Rpb24gaXNOb2RlIChvKSB7XG4gIHJldHVybiBub2RlT2JqZWN0cyA/IG8gaW5zdGFuY2VvZiBOb2RlIDogaXNOb2RlT2JqZWN0KG8pO1xufVxuXG5mdW5jdGlvbiBpc05vZGVPYmplY3QgKG8pIHtcbiAgcmV0dXJuIG8gJiZcbiAgICB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gJ3N0cmluZycgJiZcbiAgICB0eXBlb2Ygby5ub2RlVHlwZSA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzRWxlbWVudCAobykge1xuICByZXR1cm4gZWxlbWVudE9iamVjdHMgPyBvIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgOiBpc0VsZW1lbnRPYmplY3Qobyk7XG59XG5cbmZ1bmN0aW9uIGlzRWxlbWVudE9iamVjdCAobykge1xuICByZXR1cm4gbyAmJlxuICAgIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJlxuICAgIHR5cGVvZiBvLm5vZGVOYW1lID09PSAnc3RyaW5nJyAmJlxuICAgIG8ubm9kZVR5cGUgPT09IDE7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGEpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuZnVuY3Rpb24gaXNDaGVja2FibGUgKGVsZW0pIHtcbiAgcmV0dXJuICdjaGVja2VkJyBpbiBlbGVtICYmIGVsZW0udHlwZSA9PT0gJ3JhZGlvJyB8fCBlbGVtLnR5cGUgPT09ICdjaGVja2JveCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc05vZGU6IGlzTm9kZSxcbiAgaXNFbGVtZW50OiBpc0VsZW1lbnQsXG4gIGlzQXJyYXk6IGlzQXJyYXksXG4gIGlzQ2hlY2thYmxlOiBpc0NoZWNrYWJsZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gaHlwaGVuVG9DYW1lbCAoaHlwaGVucykge1xuICB2YXIgcGFydCA9IC8tKFthLXpdKS9nO1xuICByZXR1cm4gaHlwaGVucy5yZXBsYWNlKHBhcnQsIGZ1bmN0aW9uIChnLCBtKSB7XG4gICAgcmV0dXJuIG0udG9VcHBlckNhc2UoKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBoeXBoZW5Ub0NhbWVsOiBoeXBoZW5Ub0NhbWVsXG59O1xuIiwiLyoqXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIG1vZGVybiBleHBvcnRzPVwibnBtXCIgLW8gLi9ucG0vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2xvZGFzaC5kZWJvdW5jZScpLFxuICAgIGlzRnVuY3Rpb24gPSByZXF1aXJlKCdsb2Rhc2guaXNmdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoLmlzb2JqZWN0Jyk7XG5cbi8qKiBVc2VkIGFzIGFuIGludGVybmFsIGBfLmRlYm91bmNlYCBvcHRpb25zIG9iamVjdCAqL1xudmFyIGRlYm91bmNlT3B0aW9ucyA9IHtcbiAgJ2xlYWRpbmcnOiBmYWxzZSxcbiAgJ21heFdhaXQnOiAwLFxuICAndHJhaWxpbmcnOiBmYWxzZVxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBleGVjdXRlZCwgd2lsbCBvbmx5IGNhbGwgdGhlIGBmdW5jYCBmdW5jdGlvblxuICogYXQgbW9zdCBvbmNlIHBlciBldmVyeSBgd2FpdGAgbWlsbGlzZWNvbmRzLiBQcm92aWRlIGFuIG9wdGlvbnMgb2JqZWN0IHRvXG4gKiBpbmRpY2F0ZSB0aGF0IGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZVxuICogb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbFxuICogcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGNhbGwuXG4gKlxuICogTm90ZTogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCBgZnVuY2Agd2lsbCBiZSBjYWxsZWRcbiAqIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gaXNcbiAqIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSBleGVjdXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV0gU3BlY2lmeSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV0gU3BlY2lmeSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIGF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmdcbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApO1xuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIHRocm90dGxlZCk7XG4gKlxuICogLy8gZXhlY3V0ZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzXG4gKiBqUXVlcnkoJy5pbnRlcmFjdGl2ZScpLm9uKCdjbGljaycsIF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7XG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxlYWRpbmcgPSB0cnVlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gIH1cbiAgaWYgKG9wdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgbGVhZGluZyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/IG9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICBkZWJvdW5jZU9wdGlvbnMubGVhZGluZyA9IGxlYWRpbmc7XG4gIGRlYm91bmNlT3B0aW9ucy5tYXhXYWl0ID0gd2FpdDtcbiAgZGVib3VuY2VPcHRpb25zLnRyYWlsaW5nID0gdHJhaWxpbmc7XG5cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIGRlYm91bmNlT3B0aW9ucyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGU7XG4iLCIvKipcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgbW9kZXJuIGV4cG9ydHM9XCJucG1cIiAtbyAuL25wbS9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCdsb2Rhc2guaXNmdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnbG9kYXNoLmlzb2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnbG9kYXNoLm5vdycpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHNob3J0Y3V0cyBmb3IgbWV0aG9kcyB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcyAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgZGVsYXkgdGhlIGV4ZWN1dGlvbiBvZiBgZnVuY2AgdW50aWwgYWZ0ZXJcbiAqIGB3YWl0YCBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgaXQgd2FzIGludm9rZWQuXG4gKiBQcm92aWRlIGFuIG9wdGlvbnMgb2JqZWN0IHRvIGluZGljYXRlIHRoYXQgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uXG4gKiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFN1YnNlcXVlbnQgY2FsbHNcbiAqIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgY2FsbC5cbiAqXG4gKiBOb3RlOiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgIGBmdW5jYCB3aWxsIGJlIGNhbGxlZFxuICogb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiBpc1xuICogaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF0gVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGNhbGxlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV0gU3BlY2lmeSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIGF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXhcbiAqIHZhciBsYXp5TGF5b3V0ID0gXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCk7XG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgbGF6eUxheW91dCk7XG4gKlxuICogLy8gZXhlY3V0ZSBgc2VuZE1haWxgIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHNcbiAqIGpRdWVyeSgnI3Bvc3Rib3gnKS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSk7XG4gKlxuICogLy8gZW5zdXJlIGBiYXRjaExvZ2AgaXMgZXhlY3V0ZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHNcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIHNvdXJjZS5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7XG4gKiAgICdtYXhXYWl0JzogMTAwMFxuICogfSwgZmFsc2UpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBhcmdzLFxuICAgICAgbWF4VGltZW91dElkLFxuICAgICAgcmVzdWx0LFxuICAgICAgc3RhbXAsXG4gICAgICB0aGlzQXJnLFxuICAgICAgdGltZW91dElkLFxuICAgICAgdHJhaWxpbmdDYWxsLFxuICAgICAgbGFzdENhbGxlZCA9IDAsXG4gICAgICBtYXhXYWl0ID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgfVxuICB3YWl0ID0gbmF0aXZlTWF4KDAsIHdhaXQpIHx8IDA7XG4gIGlmIChvcHRpb25zID09PSB0cnVlKSB7XG4gICAgdmFyIGxlYWRpbmcgPSB0cnVlO1xuICAgIHRyYWlsaW5nID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heFdhaXQgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucyAmJiAobmF0aXZlTWF4KHdhaXQsIG9wdGlvbnMubWF4V2FpdCkgfHwgMCk7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgdmFyIGRlbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3coKSAtIHN0YW1wKTtcbiAgICBpZiAocmVtYWluaW5nIDw9IDApIHtcbiAgICAgIGlmIChtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgICB9XG4gICAgICB2YXIgaXNDYWxsZWQgPSB0cmFpbGluZ0NhbGw7XG4gICAgICBtYXhUaW1lb3V0SWQgPSB0aW1lb3V0SWQgPSB0cmFpbGluZ0NhbGwgPSB1bmRlZmluZWQ7XG4gICAgICBpZiAoaXNDYWxsZWQpIHtcbiAgICAgICAgbGFzdENhbGxlZCA9IG5vdygpO1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICAgICAgYXJncyA9IHRoaXNBcmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgcmVtYWluaW5nKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIG1heERlbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGltZW91dElkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB9XG4gICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICAgIGlmICh0cmFpbGluZyB8fCAobWF4V2FpdCAhPT0gd2FpdCkpIHtcbiAgICAgIGxhc3RDYWxsZWQgPSBub3coKTtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICAgIGFyZ3MgPSB0aGlzQXJnID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgc3RhbXAgPSBub3coKTtcbiAgICB0aGlzQXJnID0gdGhpcztcbiAgICB0cmFpbGluZ0NhbGwgPSB0cmFpbGluZyAmJiAodGltZW91dElkIHx8ICFsZWFkaW5nKTtcblxuICAgIGlmIChtYXhXYWl0ID09PSBmYWxzZSkge1xuICAgICAgdmFyIGxlYWRpbmdDYWxsID0gbGVhZGluZyAmJiAhdGltZW91dElkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW1heFRpbWVvdXRJZCAmJiAhbGVhZGluZykge1xuICAgICAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgICB9XG4gICAgICB2YXIgcmVtYWluaW5nID0gbWF4V2FpdCAtIChzdGFtcCAtIGxhc3RDYWxsZWQpLFxuICAgICAgICAgIGlzQ2FsbGVkID0gcmVtYWluaW5nIDw9IDA7XG5cbiAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICBpZiAobWF4VGltZW91dElkKSB7XG4gICAgICAgICAgbWF4VGltZW91dElkID0gY2xlYXJUaW1lb3V0KG1heFRpbWVvdXRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIW1heFRpbWVvdXRJZCkge1xuICAgICAgICBtYXhUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KG1heERlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0NhbGxlZCAmJiB0aW1lb3V0SWQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGltZW91dElkICYmIHdhaXQgIT09IG1heFdhaXQpIHtcbiAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZGVsYXllZCwgd2FpdCk7XG4gICAgfVxuICAgIGlmIChsZWFkaW5nQ2FsbCkge1xuICAgICAgaXNDYWxsZWQgPSB0cnVlO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICB9XG4gICAgaWYgKGlzQ2FsbGVkICYmICF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgYXJncyA9IHRoaXNBcmcgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwiLyoqXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIG1vZGVybiBleHBvcnRzPVwibnBtXCIgLW8gLi9ucG0vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBpc05hdGl2ZSA9IHJlcXVpcmUoJ2xvZGFzaC5faXNuYXRpdmUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBVbml4IGVwb2NoXG4gKiAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgc3RhbXAgPSBfLm5vdygpO1xuICogXy5kZWZlcihmdW5jdGlvbigpIHsgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTsgfSk7XG4gKiAvLyA9PiBsb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBmdW5jdGlvbiB0byBiZSBjYWxsZWRcbiAqL1xudmFyIG5vdyA9IGlzTmF0aXZlKG5vdyA9IERhdGUubm93KSAmJiBub3cgfHwgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuIiwiLyoqXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIG1vZGVybiBleHBvcnRzPVwibnBtXCIgLW8gLi9ucG0vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgaW50ZXJuYWwgW1tDbGFzc11dIG9mIHZhbHVlcyAqL1xudmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUgKi9cbnZhciByZU5hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBTdHJpbmcodG9TdHJpbmcpXG4gICAgLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJylcbiAgICAucmVwbGFjZSgvdG9TdHJpbmd8IGZvciBbXlxcXV0rL2csICcuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNOYXRpdmUodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nICYmIHJlTmF0aXZlLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIG1vZGVybiBleHBvcnRzPVwibnBtXCIgLW8gLi9ucG0vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKipcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgbW9kZXJuIGV4cG9ydHM9XCJucG1cIiAtbyAuL25wbS9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIG9iamVjdFR5cGVzID0gcmVxdWlyZSgnbG9kYXNoLl9vYmplY3R0eXBlcycpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gY2hlY2sgaWYgdGhlIHZhbHVlIGlzIHRoZSBFQ01BU2NyaXB0IGxhbmd1YWdlIHR5cGUgb2YgT2JqZWN0XG4gIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4OFxuICAvLyBhbmQgYXZvaWQgYSBWOCBidWdcbiAgLy8gaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MVxuICByZXR1cm4gISEodmFsdWUgJiYgb2JqZWN0VHlwZXNbdHlwZW9mIHZhbHVlXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgbW9kZXJuIGV4cG9ydHM9XCJucG1cIiAtbyAuL25wbS9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogVXNlZCB0byBkZXRlcm1pbmUgaWYgdmFsdWVzIGFyZSBvZiB0aGUgbGFuZ3VhZ2UgdHlwZSBPYmplY3QgKi9cbnZhciBvYmplY3RUeXBlcyA9IHtcbiAgJ2Jvb2xlYW4nOiBmYWxzZSxcbiAgJ2Z1bmN0aW9uJzogdHJ1ZSxcbiAgJ29iamVjdCc6IHRydWUsXG4gICdudW1iZXInOiBmYWxzZSxcbiAgJ3N0cmluZyc6IGZhbHNlLFxuICAndW5kZWZpbmVkJzogZmFsc2Vcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VHlwZXM7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBpbmN1YmF0ZSA9IHJlcXVpcmUoJy4vaW5jdWJhdGUnKTtcbnZhciBucGNzID0gcmVxdWlyZSgnLi9ucGNzJyk7XG52YXIgbW9iID0gcmVxdWlyZSgnLi9tb2InKTtcbnZhciBlbWl0dGVyID0gcmVxdWlyZSgnLi9lbWl0dGVyJyk7XG52YXIgYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG52YXIgYmFib29uID0gcmVxdWlyZSgnLi9haS9iYWJvb24nKTtcblxuZnVuY3Rpb24gbnBjIChlbmVteSwgb3B0aW9ucykge1xuICB2YXIgbyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBsZXZlbCA9IG8ubGV2ZWwgfHwgMDtcbiAgdmFyIG5vZGUgPSBpbmN1YmF0ZSgpO1xuICB2YXIgbSA9IG1vYihub2RlLCB7IGxldmVsOiBsZXZlbCwgdHlwZTogJ25wYycgfSk7XG4gIHZhciBtZSA9IHtcbiAgICBub2RlOiBub2RlLFxuICAgIG1vYjogbVxuICB9O1xuICBub2RlLmZpbmQoJy5wYy1jdWJlJykuYWRkQ2xhc3MoJ3BjLXNtb290aCBwYy1zaG93Jyk7XG4gIG0ubnBjID0gbWU7XG4gIG0ucGxhY2VtZW50KCk7XG5cbiAgZW1pdHRlci5vbignbW9iLnJlbW92ZScsIGZ1bmN0aW9uICh3aG8pIHtcbiAgICBpZiAod2hvID09PSBtKSB7XG4gICAgICBucGNzLnNwbGljZShucGNzLmluZGV4T2YobWUpLCAxKTtcbiAgICAgIGlmIChtLmNsZWFyICE9PSB0cnVlKSB7XG4gICAgICAgIGVtaXR0ZXIuZW1pdCgnbnBjLmtpbGwnLCBucGNzLmxlbmd0aCA9PT0gMCwgbS5sZXZlbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAoby5haSB8fCBiYWJvb24pKG1lLCBlbmVteSk7XG4gIG5wY3MucHVzaChtZSk7XG5cbiAgcmV0dXJuIG1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5wYztcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBucGNzID0gW107XG5cbmZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgdmFyIG5wYztcbiAgd2hpbGUgKChucGMgPSBucGNzLnNoaWZ0KCkpKSB7XG4gICAgbnBjLm1vYi5jbGVhciA9IHRydWU7XG4gICAgbnBjLm1vYi5yZW1vdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0aWNrICgpIHtcbiAgbnBjcy5mb3JFYWNoKGZ1bmN0aW9uIChucGMpIHtcbiAgICBucGMudGhpbmsoKTtcbiAgfSk7XG59XG5cbm5wY3MuY2xlYXIgPSBjbGVhcjtcbm5wY3MudGljayA9IHRpY2s7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLmN1YmUubnBjID0gbnBjcztcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBpbmN1YmF0ZSA9IHJlcXVpcmUoJy4vaW5jdWJhdGUnKTtcbnZhciBwb3dzID0gcmVxdWlyZSgnLi9wb3dlcnVwcycpO1xudmFyIG1vYiA9IHJlcXVpcmUoJy4vbW9iJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xudmFyIGxpZmVzYXZlciA9IHJlcXVpcmUoJy4vcG93ZXJ1cHMvbGlmZXNhdmVyJyk7XG5cbmZ1bmN0aW9uIHBvdyAocGxheWVyLCBvcHRpb25zKSB7XG4gIHZhciBvID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIGxldmVsID0gby5sZXZlbCB8fCAwO1xuICB2YXIgbm9kZSA9IGluY3ViYXRlKCk7XG4gIHZhciBtID0gbW9iKG5vZGUsIHsgbGV2ZWw6IGxldmVsLCB0eXBlOiAncG93JyB9KTtcbiAgdmFyIG1lID0ge1xuICAgIG5vZGU6IG5vZGUsXG4gICAgbW9iOiBtXG4gIH07XG4gIHZhciBlZmZlY3QgPSBvLmVmZmVjdCB8fCBsaWZlc2F2ZXIoMSk7XG4gIG5vZGUuZmluZCgnLnBjLWN1YmUnKS5hZGRDbGFzcygncGMtc21vb3RoIHBjLXNob3cnKTtcbiAgbS5wb3cgPSBtZTtcbiAgbS5wbGFjZW1lbnQoKTtcblxuICBlbWl0dGVyLm9uKCdtb2IucmVtb3ZlJywgZnVuY3Rpb24gKHdobykge1xuICAgIGlmICh3aG8gPT09IG0pIHtcbiAgICAgIHBvd3Muc3BsaWNlKHBvd3MuaW5kZXhPZihtZSksIDEpO1xuICAgICAgaWYgKG1lLmNsZWFudXAgIT09IHRydWUpIHtcbiAgICAgICAgZWZmZWN0KHBsYXllciwgbWUpO1xuICAgICAgICBlbWl0dGVyLmVtaXQoJ3Bvdy51c2UnLCBtLmxldmVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHdvcmR1cCAoZmFjZSkge1xuICAgIGZhY2UuaW5uZXJUZXh0ID0gZWZmZWN0LndvcmRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGVmZmVjdC53b3Jkcy5sZW5ndGgpXTtcbiAgfVxuXG4gIG5vZGUuZmluZCgnLnBjLWZhY2UnKS5mb3JFYWNoKHdvcmR1cCk7XG4gIHBvd3MucHVzaChtZSk7XG5cbiAgcmV0dXJuIG1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvdztcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwb3dlcnVwcyA9IFtdO1xuXG5mdW5jdGlvbiBjbGVhciAoKSB7XG4gIHZhciBwb3c7XG4gIHdoaWxlICgocG93ID0gcG93ZXJ1cHMuc2hpZnQoKSkpIHtcbiAgICBwb3cuY2xlYW51cCA9IHRydWU7XG4gICAgcG93Lm5vZGUucmVtb3ZlKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuY3ViZS5wb3dlcnVwID0gcG93ZXJ1cHM7XG5cbnBvd2VydXBzLmNsZWFyID0gY2xlYXI7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG52YXIgbnBjcyA9IHJlcXVpcmUoJy4uL25wY3MnKTtcbnZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjaGFvc2JyaW5nZXIgKGxldmVsKSB7XG4gIGZ1bmN0aW9uIGVmZmVjdCAocGxheWVyLCBwb3cpIHtcbiAgICB2YXIgY291bnQgPSBNYXRoLm1pbihsZXZlbCwgNCk7XG4gICAgZm9yIChpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIG5wYyhwbGF5ZXIsIHsgYWk6IGFpbWVyLCBsZXZlbDogTWF0aC5mbG9vcihNYXRoLm1heCgxLCBpIC8gMikpIH0pO1xuICAgIH1cbiAgICBpZiAoLS1sZXZlbCA+IDApIHtcbiAgICAgIHBvd2VydXAocGxheWVyLCB7IGVmZmVjdDogY2hhb3NicmluZ2VyKGxldmVsKSB9KTtcbiAgICB9XG4gIH1cblxuICBlZmZlY3Qud29yZHMgPSBbJ0ZJRVJZIERFQVRIIScsICdBTkdSWSBUSElOR1MuJywgJ09IIE5PJywgJ0NIQU9TIEJSSU5HRVInLCAnYW5ncnkga2lsbCEnLCAnZGVhdGggaXMgaW5ldml0YWJsZSddO1xuXG4gIHJldHVybiBlZmZlY3Q7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGl2ZXMpIHtcbiAgZnVuY3Rpb24gZWZmZWN0IChwbGF5ZXIsIHBvdykge1xuICAgIHBsYXllci5hZGRMZXZlbChsaXZlcyk7XG4gIH1cblxuICBlZmZlY3Qud29yZHMgPSBbJ0xJRkUhJywgJ1NhdmVyLiddO1xuXG4gIHJldHVybiBlZmZlY3Q7XG59O1xuIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG52YXIgbnBjcyA9IHJlcXVpcmUoJy4uL25wY3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgZnVuY3Rpb24gZWZmZWN0IChwbGF5ZXIsIHBvdykge1xuICAgIHZhciBucGM7XG5cbiAgICBib2R5LmFkZENsYXNzKCdyYWluc3Rvcm0nKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGJvZHkucmVtb3ZlQ2xhc3MoJ3JhaW5zdG9ybScpO1xuICAgIH0sIDMwMCk7XG5cbiAgICB3aGlsZSAobGV2ZWwtLSAmJiBucGNzLmxlbmd0aCkge1xuICAgICAgbnBjID0gbnBjc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBlZmZlY3Qud29yZHMubGVuZ3RoKV07XG4gICAgICBpZiAobnBjKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZGFtYWdlLCBNYXRoLnJhbmRvbSgpICogMzAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiAgZGFtYWdlICgpIHtcbiAgICAgIG5wYy5tb2IuZGFtYWdlKGxldmVsKTtcbiAgICB9XG5cbiAgICBucGNzLmZvckVhY2goZnVuY3Rpb24gKG5wYywgaSkge1xuICAgICAgaWYgKGkgPCBsZXZlbCkge1xuICAgICAgICBucGMubW9iLmRhbWFnZShsZXZlbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBlZmZlY3Qud29yZHMgPSBbJ1NUT1JNIScsICdTaG93ZXIuJywgJ0RFQVRIJywgJ01heWhlbScsICdXT09PIScsICdLSUxMIFxcJ0VNIEFMTCddO1xuXG4gIHJldHVybiBlZmZlY3Q7XG59O1xuIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgdXMgPSByZXF1aXJlKCcuL3VzJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIGxldmVsID0gJCgnLnNjLWxldmVsJyk7XG52YXIgcG9pbnRzID0gJCgnLnNjLXBvaW50cycpO1xudmFyIGxpdmVzID0gJCgnLnNjLWxpdmVzJyk7XG52YXIgc2NvcmUgPSAwO1xudmFyIGdhbWVMZXZlbCA9IDA7XG52YXIgcGxheWVyO1xuXG5lbWl0dGVyLm9uKCdwbGF5ZXIuc3RhcnQnLCBmdW5jdGlvbiAocCkge1xuICBwbGF5ZXIgPSBwO1xufSk7XG5cbmVtaXR0ZXIub24oJ25wYy5raWxsJywgZnVuY3Rpb24gKGNsZWFyLCBsZXZlbCkge1xuICBhZGQoTWF0aC5mbG9vcigrK2xldmVsICogMS41KSk7XG59KTtcblxuZW1pdHRlci5vbigncG93LnVzZScsIGZ1bmN0aW9uIChsZXZlbCkge1xuICBhZGQoKytsZXZlbCk7XG59KTtcblxuZW1pdHRlci5vbigncGxheWVyLmRlYXRoJywgZnVuY3Rpb24gKGxldmVsKSB7XG4gIGFkZCgtdXMubW0oZ2FtZUxldmVsICogNSwgZ2FtZUxldmVsICogMikpO1xufSk7XG5cbmVtaXR0ZXIub24oJ2xldmVscy5jaGFuZ2UnLCBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgZ2FtZUxldmVsID0gbGV2ZWwgKyAxO1xuICBhZGQodXMubW0oZ2FtZUxldmVsLCBnYW1lTGV2ZWwgKiAyKSk7XG59KTtcblxuZnVuY3Rpb24gcmVzZXQgKCkge1xuICBzY29yZSA9IDA7XG4gIHVwZGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBhZGQgKHBvaW50cykge1xuICBzY29yZSArPSBwb2ludHM7XG4gIHVwZGF0ZSgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUgKCkge1xuICBsZXZlbC50ZXh0KGdhbWVMZXZlbCk7XG4gIGxpdmVzLnRleHQocGxheWVyLmxldmVsICsgMSk7XG4gIHBvaW50cy50ZXh0KHNjb3JlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlc2V0OiByZXNldCxcbiAgYWRkOiBhZGQsXG4gIHVwZGF0ZTogdXBkYXRlXG59O1xuIiwiZnVuY3Rpb24gcGMgKHYsIHIpIHsgcmV0dXJuIHAociAvIDEwMCAqIHYpOyB9XG5mdW5jdGlvbiB1IChtKSB7IHJldHVybiBhID0gcGFyc2VJbnQobS5yZXBsYWNlKCdweCcsICcnKSwgMTApLCBpc05hTihhKSA/IDAgOiBhOyB9XG5mdW5jdGlvbiBwICh2KSB7IHJldHVybiB2ICsgJ3B4JzsgfVxuZnVuY3Rpb24gbW0gKG1pbiwgbWF4KSB7IHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluKTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcGM6IHBjLFxuICB1OiB1LFxuICBwOiBwLFxuICBtbTogbW1cbn07XG4iXX0=
