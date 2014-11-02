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
  var shootrate = 1000;
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
      bullet(mob, { level: Math.floor(Math.max(1, mob.level * 0.5)), aim: enemy });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../bullet":7,"lodash.throttle":39}],3:[function(require,module,exports){
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

},{"lodash.throttle":39}],4:[function(require,module,exports){
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
  var shootrate = 1000;
  var lastShooting = Date.now() + shootrate;

  function changeDirection () {
    d = { x: rs(), y: rs() };
  }

  function think () {
    if (idle > goal) {
      if (r() > 0.5) {
        mob.addLevel(1, 8);
      }
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
      bullet(mob, { level: Math.min(mob.level, 2), aim: enemy });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../bullet":7,"lodash.throttle":39}],5:[function(require,module,exports){
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
  var shootrate = 500;
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
      bullet(mob, { level: Math.floor(Math.max(1, mob.level * 0.5)), aim: enemy });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../bullet":7,"lodash.throttle":39}],6:[function(require,module,exports){
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
  var shootrate = 1500;
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
      bullet(mob, { level: Math.floor(Math.max(1, mob.level * 0.5)) });
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../bullet":7,"lodash.throttle":39}],7:[function(require,module,exports){
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
  if (o.diy) {
    dx = o.diy.dx;
    dy = o.diy.dy;
  } else if (o.aim) {
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

},{"./bullets":8,"./emitter":10,"./incubate":11,"./mob":22,"./us":55,"dominus":34}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
  incubateCube();
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
  if (yourCubeInternal) { yourCubeInternal.removeClass('pc-show'); }
  body.off('keyup', ku);
  body.off('keydown', kd);
  emitter.off('mob.leveldown', leveldown);
  emitter.off('levels.win', won);
  npcs.clear();
  pows.clear();
  yourCube.remove();
  mobs.splice(0, mobs.length);
}

function won () {
  gameover('ZOMG YOU WON!', ['rt-won']);
}

function restart (e) {
  if (e.which === SPACE) {
    body.off('keydown', restart);
    $('.rt-tint').removeClass('rt-show');
    setTimeout(start, 1000);
  }
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./bullets":8,"./emitter":10,"./incubate":11,"./levels":21,"./mob":22,"./mobs":23,"./npc":46,"./npcs":47,"./powerups":49,"dominus":34}],10:[function(require,module,exports){
var emitter = require('contra.emitter');

module.exports = emitter();

},{"contra.emitter":24}],11:[function(require,module,exports){
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

},{"dominus":34}],12:[function(require,module,exports){
var npc = require('../npc');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you).node.addClass('npc-disc');
  powerup(you);
};

},{"../npc":46,"../powerup":48}],13:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var powerup = require('../powerup');
var bulletrain = require('../powerups/bulletrain');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-funk');
  npc(you, { ai: rookie });
  powerup(you, { effect: bulletrain(1) });
};

},{"../ai/rookie":6,"../npc":46,"../powerup":48,"../powerups/bulletrain":50}],14:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var machinegun = require('../ai/machinegun');
var growingpain = require('../ai/growingpain');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: growingpain, level: 1 }).node.addClass('npc-mass');
  npc(you, { ai: machinegun });
  powerup(you);
};

},{"../ai/growingpain":4,"../ai/machinegun":5,"../ai/rookie":6,"../npc":46,"../powerup":48}],15:[function(require,module,exports){
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

},{"../ai/aimer":2,"../ai/growingpain":4,"../ai/rookie":6,"../npc":46,"../powerup":48,"../powerups/bulletrain":50}],16:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');
var machinegun = require('../ai/machinegun');
var growingpain = require('../ai/growingpain');

module.exports = function (you) {
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: growingpain, level: 3 }).node.addClass('npc-disc');
  npc(you, { ai: rookie, level: 1 });
  npc(you, { ai: machinegun, level: 2 });
  npc(you, { ai: machinegun, level: 2 });
  powerup(you, { effect: rainstorm(1) });
};

},{"../ai/aimer":2,"../ai/growingpain":4,"../ai/machinegun":5,"../ai/rookie":6,"../npc":46,"../powerup":48,"../powerups/rainstorm":53}],17:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var machinegun = require('../ai/machinegun');
var powerup = require('../powerup');
var bulletrain = require('../powerups/bulletrain');

module.exports = function (you) {
  you.addLevel(1);
  npc(you, { ai: aimer }).node.addClass('npc-disc');
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
  powerup(you, { effect: bulletrain(2) });
  powerup(you, { effect: bulletrain(2) });
  powerup(you, { effect: bulletrain(2) });
  powerup(you, { effect: bulletrain(2) });
};

},{"../ai/aimer":2,"../ai/machinegun":5,"../ai/rookie":6,"../npc":46,"../powerup":48,"../powerups/bulletrain":50}],18:[function(require,module,exports){
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

},{"../ai/aimer":2,"../ai/machinegun":5,"../ai/rookie":6,"../npc":46,"../powerup":48}],19:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var machinegun = require('../ai/machinegun');
var powerup = require('../powerup');
var rainstorm = require('../powerups/rainstorm');
var bulletrain = require('../powerups/bulletrain');

module.exports = function (you) {
  you.addLevel(1);
  powerup(you, { effect: rainstorm(3) });
  powerup(you, { effect: bulletrain(3) });
  powerup(you, { effect: bulletrain(3) });
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

},{"../ai/aimer":2,"../ai/machinegun":5,"../ai/rookie":6,"../npc":46,"../powerup":48,"../powerups/bulletrain":50,"../powerups/rainstorm":53}],20:[function(require,module,exports){
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

},{"../ai/aimer":2,"../ai/rookie":6,"../npc":46,"../powerup":48,"../powerups/chaosbringer":51,"../powerups/rainstorm":53}],21:[function(require,module,exports){
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

},{"./emitter":10,"./level/0":12,"./level/1":13,"./level/2":14,"./level/3":15,"./level/4":16,"./level/5":17,"./level/6":18,"./level/7":19,"./level/8":20,"./npc":46,"./npcs":47,"./powerups":49,"./scoreboard":54,"dominus":34}],22:[function(require,module,exports){
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
      bullet(me, { level: Math.floor(Math.max(1, me.level * 0.5)) });
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

},{"./bullet":7,"./emitter":10,"./mobs":23,"./us":55}],23:[function(require,module,exports){
(function (global){
var mobs = [];

module.exports = global.cube.mob = mobs;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
module.exports = require('./src/contra.emitter.js');

},{"./src/contra.emitter.js":25}],25:[function(require,module,exports){
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
},{"/Users/nico/.nvm/v0.10.26/lib/node_modules/watchify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":1}],26:[function(require,module,exports){
var poser = require('./src/node');

module.exports = poser;

['Array', 'Function', 'Object', 'Date', 'String'].forEach(pose);

function pose (type) {
  poser[type] = function poseComputedType () { return poser(type); };
}

},{"./src/node":27}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
'use strict';

var poser = require('poser');
var Dominus = poser.Array();

module.exports = Dominus;

},{"poser":26}],30:[function(require,module,exports){
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

},{"./Dominus.ctor":29,"./classes":31,"./core":32,"./dom":33,"./public":36}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{"./Dominus.ctor":29,"./test":37}],33:[function(require,module,exports){
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

},{"./Dominus.ctor":29,"./core":32,"./events":35,"./test":37,"./text":38,"sektor":28}],34:[function(require,module,exports){
'use strict';

module.exports = require('./Dominus.prototype');

},{"./Dominus.prototype":30}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./Dominus.ctor":29,"./core":32,"./dom":33}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{"lodash.debounce":40,"lodash.isfunction":43,"lodash.isobject":44}],40:[function(require,module,exports){
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

},{"lodash.isfunction":43,"lodash.isobject":44,"lodash.now":41}],41:[function(require,module,exports){
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

},{"lodash._isnative":42}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{}],44:[function(require,module,exports){
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

},{"lodash._objecttypes":45}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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
  var largestLevel = level;
  var metrics = $('<div>').addClass('npc-metrics');
  var lifebar = $('<div>').addClass('npc-life').appendTo(metrics);
  node.find('.pc-cube').addClass('pc-smooth pc-show');
  node.append(metrics);
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

},{"./ai/baboon":3,"./emitter":10,"./incubate":11,"./mob":22,"./npcs":47,"dominus":34}],47:[function(require,module,exports){
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
},{}],48:[function(require,module,exports){
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

},{"./emitter":10,"./incubate":11,"./mob":22,"./powerups":49,"./powerups/lifesaver":52,"dominus":34}],49:[function(require,module,exports){
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
},{}],50:[function(require,module,exports){
var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var npc = require('../npc');
var aimer = require('../ai/aimer');
var bullet = require('../bullet');
var powerup = require('../powerup');

module.exports = function chaosbringer (level) {
  function effect (player, pow) {
    fire(0, -1);
    fire(0, 1);
    fire(1, 1);
    fire(1, 0);
    fire(1, -1);
    fire(-1, -1);
    fire(-1, 1);
    fire(-1, 0);
  }

  function fire (x, y) {
    bullet(player, { level: level, diy: { dx: x, dy: y } });
  }

  effect.words = ['BULLETRAIN!', 'TRAIN OF BULLETS.', 'YES!', 'BEASTLY', 'MAJESTUOUS!', 'DIE DIE DIE'];

  return effect;
};

},{"../ai/aimer":2,"../bullet":7,"../npc":46,"../npcs":47,"../powerup":48,"dominus":34}],51:[function(require,module,exports){
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

},{"../ai/aimer":2,"../npc":46,"../npcs":47,"../powerup":48,"dominus":34}],52:[function(require,module,exports){
module.exports = function (lives) {
  function effect (player, pow) {
    player.addLevel(lives);
  }

  effect.words = ['LIFE!', 'Saver.'];

  return effect;
};

},{}],53:[function(require,module,exports){
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

},{"../npcs":47,"dominus":34}],54:[function(require,module,exports){
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

},{"./emitter":10,"./us":55,"dominus":34}],55:[function(require,module,exports){
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

},{}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmljby8ubnZtL3YwLjEwLjI2L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9uaWNvLy5udm0vdjAuMTAuMjYvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9haS9haW1lci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL2JhYm9vbi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL2dyb3dpbmdwYWluLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvYWkvbWFjaGluZWd1bi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL3Jvb2tpZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2J1bGxldC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2J1bGxldHMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9jdWJlLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvZW1pdHRlci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2luY3ViYXRlLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvMC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzEuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC8yLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvMy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzQuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC81LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvNi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzcuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC84LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWxzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbW9iLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbW9icy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9jb250cmEuZW1pdHRlci9pbmRleC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9jb250cmEuZW1pdHRlci9zcmMvY29udHJhLmVtaXR0ZXIuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9ub2RlX21vZHVsZXMvcG9zZXIvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9ub2RlX21vZHVsZXMvcG9zZXIvc3JjL2Jyb3dzZXIuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9ub2RlX21vZHVsZXMvc2VrdG9yL3NyYy9zZWt0b3IuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvRG9taW51cy5jdG9yLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL0RvbWludXMucHJvdG90eXBlLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL2NsYXNzZXMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvY29yZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy9kb20uanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvZG9taW51cy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy9ldmVudHMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvcHVibGljLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL3Rlc3QuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvdGV4dC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guZGVib3VuY2UvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2xvZGFzaC5ub3cvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guZGVib3VuY2Uvbm9kZV9tb2R1bGVzL2xvZGFzaC5ub3cvbm9kZV9tb2R1bGVzL2xvZGFzaC5faXNuYXRpdmUvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNmdW5jdGlvbi9pbmRleC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc29iamVjdC9pbmRleC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvbm9kZV9tb2R1bGVzL2xvZGFzaC5pc29iamVjdC9ub2RlX21vZHVsZXMvbG9kYXNoLl9vYmplY3R0eXBlcy9pbmRleC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25wYy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25wY3MuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9wb3dlcnVwLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9wb3dlcnVwcy9idWxsZXRyYWluLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMvY2hhb3NicmluZ2VyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMvbGlmZXNhdmVyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMvcmFpbnN0b3JtLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvc2NvcmVib2FyZC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsS0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9SQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJ2YXIgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKTtcbnZhciBidWxsZXQgPSByZXF1aXJlKCcuLi9idWxsZXQnKTtcblxuZnVuY3Rpb24gciAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpOyB9XG5mdW5jdGlvbiBycyAoKSB7IHJldHVybiBNYXRoLnNpZ24ocigpIC0gMC41KTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChucGMsIGVuZW15KSB7XG4gIHZhciBtb2IgPSBucGMubW9iO1xuICB2YXIgaW50ZWxsaWdlbmNlID0gMC4zO1xuICB2YXIgZ29hbCA9IDcwMDtcbiAgdmFyIGlkbGUgPSAwO1xuICB2YXIgZDtcbiAgdmFyIHJlZGlyZWN0ID0gdGhyb3R0bGUoY2hhbmdlRGlyZWN0aW9uLCAzMDAgKyByKCkgKiA2MDApO1xuICB2YXIgc2hvb3RyYXRlID0gMTAwMDtcbiAgdmFyIGxhc3RTaG9vdGluZyA9IERhdGUubm93KCkgKyBzaG9vdHJhdGU7XG5cbiAgZnVuY3Rpb24gY2hhbmdlRGlyZWN0aW9uICgpIHtcbiAgICBkID0geyB4OiBycygpLCB5OiBycygpIH07XG4gIH1cblxuICBmdW5jdGlvbiB0aGluayAoKSB7XG4gICAgaWYgKGlkbGUgPiBnb2FsKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgICAgaWRsZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkbGUgKz0gcigpICogMTAwICogaW50ZWxsaWdlbmNlO1xuICAgIH1cbiAgICB2YXIgcGVyZmVjdCA9IG1vYi5tb3ZlKGQueCwgZC55KTtcbiAgICBpZiAocGVyZmVjdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgfVxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgIGlmIChub3cgLSBsYXN0U2hvb3RpbmcgPiBzaG9vdHJhdGUpIHtcbiAgICAgIGJ1bGxldChtb2IsIHsgbGV2ZWw6IE1hdGguZmxvb3IoTWF0aC5tYXgoMSwgbW9iLmxldmVsICogMC41KSksIGFpbTogZW5lbXkgfSk7XG4gICAgICBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgfVxuXG4gIHJlZGlyZWN0KCk7XG4gIG5wYy50aGluayA9IHRoaW5rO1xufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYykge1xuICB2YXIgbW9iID0gbnBjLm1vYjtcbiAgdmFyIGludGVsbGlnZW5jZSA9IDAuMztcbiAgdmFyIGdvYWwgPSA3MDA7XG4gIHZhciBpZGxlID0gMDtcbiAgdmFyIGQ7XG4gIHZhciByZWRpcmVjdCA9IHRocm90dGxlKGNoYW5nZURpcmVjdGlvbiwgMzAwICsgcigpICogMTAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlRGlyZWN0aW9uICgpIHtcbiAgICBkID0geyB4OiBycygpLCB5OiBycygpIH07XG4gIH1cblxuICBmdW5jdGlvbiB0aGluayAoKSB7XG4gICAgaWYgKGlkbGUgPiBnb2FsKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgICAgaWRsZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkbGUgKz0gcigpICogMTAwICogaW50ZWxsaWdlbmNlO1xuICAgIH1cbiAgICB2YXIgcGVyZmVjdCA9IG1vYi5tb3ZlKGQueCwgZC55KTtcbiAgICBpZiAocGVyZmVjdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgcmVkaXJlY3QoKTtcbiAgbnBjLnRoaW5rID0gdGhpbms7XG59O1xuIiwidmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG52YXIgYnVsbGV0ID0gcmVxdWlyZSgnLi4vYnVsbGV0Jyk7XG5cbmZ1bmN0aW9uIHIgKCkgeyByZXR1cm4gTWF0aC5yYW5kb20oKTsgfVxuZnVuY3Rpb24gcnMgKCkgeyByZXR1cm4gTWF0aC5zaWduKHIoKSAtIDAuNSk7IH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobnBjLCBlbmVteSkge1xuICB2YXIgbW9iID0gbnBjLm1vYjtcbiAgdmFyIGludGVsbGlnZW5jZSA9IDAuMztcbiAgdmFyIGdvYWwgPSA3MDA7XG4gIHZhciBpZGxlID0gMDtcbiAgdmFyIGQ7XG4gIHZhciByZWRpcmVjdCA9IHRocm90dGxlKGNoYW5nZURpcmVjdGlvbiwgMzAwICsgcigpICogNjAwKTtcbiAgdmFyIHNob290cmF0ZSA9IDEwMDA7XG4gIHZhciBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpICsgc2hvb3RyYXRlO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZURpcmVjdGlvbiAoKSB7XG4gICAgZCA9IHsgeDogcnMoKSwgeTogcnMoKSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpbmsgKCkge1xuICAgIGlmIChpZGxlID4gZ29hbCkge1xuICAgICAgaWYgKHIoKSA+IDAuNSkge1xuICAgICAgICBtb2IuYWRkTGV2ZWwoMSwgOCk7XG4gICAgICB9XG4gICAgICByZWRpcmVjdCgpO1xuICAgICAgaWRsZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkbGUgKz0gcigpICogMTAwICogaW50ZWxsaWdlbmNlO1xuICAgIH1cbiAgICB2YXIgcGVyZmVjdCA9IG1vYi5tb3ZlKGQueCwgZC55KTtcbiAgICBpZiAocGVyZmVjdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgfVxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgIGlmIChub3cgLSBsYXN0U2hvb3RpbmcgPiBzaG9vdHJhdGUpIHtcbiAgICAgIGJ1bGxldChtb2IsIHsgbGV2ZWw6IE1hdGgubWluKG1vYi5sZXZlbCwgMiksIGFpbTogZW5lbXkgfSk7XG4gICAgICBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgfVxuXG4gIHJlZGlyZWN0KCk7XG4gIG5wYy50aGluayA9IHRoaW5rO1xufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xudmFyIGJ1bGxldCA9IHJlcXVpcmUoJy4uL2J1bGxldCcpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYywgZW5lbXkpIHtcbiAgdmFyIG1vYiA9IG5wYy5tb2I7XG4gIHZhciBpbnRlbGxpZ2VuY2UgPSAwLjM7XG4gIHZhciBnb2FsID0gNzAwO1xuICB2YXIgaWRsZSA9IDA7XG4gIHZhciBkO1xuICB2YXIgcmVkaXJlY3QgPSB0aHJvdHRsZShjaGFuZ2VEaXJlY3Rpb24sIDUwICsgcigpICogMjAwKTtcbiAgdmFyIHNob290cmF0ZSA9IDUwMDtcbiAgdmFyIGxhc3RTaG9vdGluZyA9IERhdGUubm93KCkgKyBzaG9vdHJhdGU7XG5cbiAgZnVuY3Rpb24gY2hhbmdlRGlyZWN0aW9uICgpIHtcbiAgICBkID0geyB4OiBycygpLCB5OiBycygpIH07XG4gIH1cblxuICBmdW5jdGlvbiB0aGluayAoKSB7XG4gICAgaWYgKGlkbGUgPiBnb2FsKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgICAgaWRsZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkbGUgKz0gcigpICogMTAwICogaW50ZWxsaWdlbmNlO1xuICAgIH1cbiAgICB2YXIgcGVyZmVjdCA9IG1vYi5tb3ZlKGQueCwgZC55KTtcbiAgICBpZiAocGVyZmVjdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgfVxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgIGlmIChub3cgLSBsYXN0U2hvb3RpbmcgPiBzaG9vdHJhdGUpIHtcbiAgICAgIGJ1bGxldChtb2IsIHsgbGV2ZWw6IE1hdGguZmxvb3IoTWF0aC5tYXgoMSwgbW9iLmxldmVsICogMC41KSksIGFpbTogZW5lbXkgfSk7XG4gICAgICBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgfVxuXG4gIHJlZGlyZWN0KCk7XG4gIG5wYy50aGluayA9IHRoaW5rO1xufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xudmFyIGJ1bGxldCA9IHJlcXVpcmUoJy4uL2J1bGxldCcpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYykge1xuICB2YXIgbW9iID0gbnBjLm1vYjtcbiAgdmFyIGludGVsbGlnZW5jZSA9IDAuMztcbiAgdmFyIGdvYWwgPSA3MDA7XG4gIHZhciBpZGxlID0gMDtcbiAgdmFyIGQ7XG4gIHZhciByZWRpcmVjdCA9IHRocm90dGxlKGNoYW5nZURpcmVjdGlvbiwgMzAwICsgcigpICogMzAwKTtcbiAgdmFyIHNob290cmF0ZSA9IDE1MDA7XG4gIHZhciBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpICsgc2hvb3RyYXRlO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZURpcmVjdGlvbiAoKSB7XG4gICAgZCA9IHsgeDogcnMoKSwgeTogcnMoKSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpbmsgKCkge1xuICAgIGlmIChpZGxlID4gZ29hbCkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICAgIGlkbGUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGxlICs9IHIoKSAqIDEwMCAqIGludGVsbGlnZW5jZTtcbiAgICB9XG4gICAgdmFyIHBlcmZlY3QgPSBtb2IubW92ZShkLngsIGQueSk7XG4gICAgaWYgKHBlcmZlY3QgPT09IGZhbHNlKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgIH1cbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAobm93IC0gbGFzdFNob290aW5nID4gc2hvb3RyYXRlKSB7XG4gICAgICBidWxsZXQobW9iLCB7IGxldmVsOiBNYXRoLmZsb29yKE1hdGgubWF4KDEsIG1vYi5sZXZlbCAqIDAuNSkpIH0pO1xuICAgICAgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gIH1cblxuICByZWRpcmVjdCgpO1xuICBucGMudGhpbmsgPSB0aGluaztcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBpbmN1YmF0ZSA9IHJlcXVpcmUoJy4vaW5jdWJhdGUnKTtcbnZhciBidWxsZXRzID0gcmVxdWlyZSgnLi9idWxsZXRzJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIHVzID0gcmVxdWlyZSgnLi91cycpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzdGFsZSAoKSB7IHZhciB2ID0gcigpOyByZXR1cm4gdiA+IDAuNjYgPyAtMSA6IHYgPiAwLjMzID8gMSA6IDA7IH1cblxuZnVuY3Rpb24gYnVsbGV0IChzb3VyY2UsIG9wdGlvbnMpIHtcbiAgdmFyIG8gPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgbGV2ZWwgPSBvLmxldmVsIHx8IDA7XG4gIHZhciBtb2IgPSByZXF1aXJlKCcuL21vYicpO1xuICB2YXIgYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG4gIHZhciBzID0gZ2V0Q29tcHV0ZWRTdHlsZShzb3VyY2Uubm9kZVswXSk7XG4gIHZhciBub2RlID0gaW5jdWJhdGUoKTtcbiAgbm9kZVswXS5zdHlsZS50b3AgPSBzLnRvcDtcbiAgbm9kZVswXS5zdHlsZS5sZWZ0ID0gcy5sZWZ0O1xuICB2YXIgdHMgPSAxMjtcbiAgdmFyIGR4ID0gc291cmNlLmQueDtcbiAgdmFyIGR5ID0gc291cmNlLmQueTtcbiAgdmFyIGN1YmUgPSBub2RlLmZpbmQoJy5wYy1jdWJlJykuYWRkQ2xhc3MoJ3BjLXNob3cnKTtcbiAgaWYgKG8uZGl5KSB7XG4gICAgZHggPSBvLmRpeS5keDtcbiAgICBkeSA9IG8uZGl5LmR5O1xuICB9IGVsc2UgaWYgKG8uYWltKSB7XG4gICAgdmFyIGEgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGVbMF0pO1xuICAgIHZhciBiID0gZ2V0Q29tcHV0ZWRTdHlsZShvLmFpbS5ub2RlWzBdKTtcbiAgICB2YXIgeCA9IHVzLnUoYi5sZWZ0KSAtIHVzLnUoYS5sZWZ0KTtcbiAgICB2YXIgeSA9IHVzLnUoYi50b3ApIC0gdXMudShhLnRvcCk7XG4gICAgZHggPSBNYXRoLmFicyh4KSA+IDQwID8geCA6IDA7XG4gICAgZHkgPSBNYXRoLmFicyh5KSA+IDQwID8geSA6IDA7XG4gIH0gZWxzZSBpZiAoZHggPT09IDAgJiYgZHkgPT09IDApIHtcbiAgICBkeCA9IHJzdGFsZSgpO1xuICAgIGR5ID0gcnN0YWxlKCk7XG4gICAgaWYgKGR4ID09PSAwICYmIGR5ID09PSAwKSB7XG4gICAgICBkeCA9IHJzdGFsZSgpO1xuICAgICAgZHkgPSBkeCA9PT0gMCA/IDEgOiByc3RhbGUoKTtcbiAgICB9XG4gIH1cbiAgdmFyIG0gPSBtb2Iobm9kZSwge1xuICAgIHR5cGU6ICdidWxsZXQnLFxuICAgIGxldmVsOiBsZXZlbCxcbiAgICB0b3BzcGVlZDogdHMsXG4gICAgYWNjZWw6IHtcbiAgICAgIHg6IE1hdGguYWJzKGR4KSAqIHRzLFxuICAgICAgeTogTWF0aC5hYnMoZHkpICogdHNcbiAgICB9XG4gIH0pO1xuICB2YXIgbWUgPSB7XG4gICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgbm9kZTogbm9kZSxcbiAgICBtb2I6IG0sXG4gICAgdjoge1xuICAgICAgeDogTWF0aC5zaWduKGR4KSxcbiAgICAgIHk6IE1hdGguc2lnbihkeSlcbiAgICB9XG4gIH07XG4gIG0uZ3VubmVyID0gc291cmNlO1xuXG4gIGZ1bmN0aW9uIHNtb290aCAoKSB7XG4gICAgY3ViZS5hZGRDbGFzcygncGMtc21vb3RoJyk7XG4gIH1cblxuICBlbWl0dGVyLm9uKCdtb2IucmVtb3ZlJywgZnVuY3Rpb24gKHdobykge1xuICAgIGlmICh3aG8gPT09IG0pIHtcbiAgICAgIGJ1bGxldHMuc3BsaWNlKGJ1bGxldHMuaW5kZXhPZihtZSksIDEpO1xuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gcmVtb3ZlICgpIHtcbiAgICBtLnJlbW92ZSgpO1xuICB9XG5cbiAgc2V0VGltZW91dChzbW9vdGgsIDApO1xuICBzZXRUaW1lb3V0KHJlbW92ZSwgMjQwMCk7XG5cbiAgYnVsbGV0cy5wdXNoKG1lKTtcblxuICByZXR1cm4gbWU7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXQ7XG4iLCJ2YXIgYnVsbGV0cyA9IFtdO1xuXG5mdW5jdGlvbiB0aWNrICgpIHtcbiAgYnVsbGV0cy5mb3JFYWNoKGZ1bmN0aW9uIChidWxsZXQpIHtcbiAgICBpZiAoYnVsbGV0LmJvb3QpIHtcbiAgICAgIGJ1bGxldC5tb2IubW92ZShidWxsZXQudi54LCBidWxsZXQudi55KTtcbiAgICAgIGJ1bGxldC5tb2IuY2QoKS5mb3JFYWNoKGRhbWFnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoYm9vdCwgMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm9vdCAoKSB7XG4gICAgICBidWxsZXQuYm9vdCA9IHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGFtYWdlICh0YXJnZXQpIHtcbiAgICAgIHRhcmdldC5kYW1hZ2UoYnVsbGV0LmxldmVsKTtcbiAgICAgIGJ1bGxldC5yZW1vdmUoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1bGxldHM7XG5cbmJ1bGxldHMudGljayA9IHRpY2s7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcblxuZ2xvYmFsLiQgPSAkO1xuZ2xvYmFsLmN1YmUgPSB7fTtcblxudmFyIG1vYiA9IHJlcXVpcmUoJy4vbW9iJyk7XG52YXIgbW9icyA9IHJlcXVpcmUoJy4vbW9icycpO1xudmFyIG5wYyA9IHJlcXVpcmUoJy4vbnBjJyk7XG52YXIgbnBjcyA9IHJlcXVpcmUoJy4vbnBjcycpO1xudmFyIHBvd3MgPSByZXF1aXJlKCcuL3Bvd2VydXBzJyk7XG52YXIgYnVsbGV0cyA9IHJlcXVpcmUoJy4vYnVsbGV0cycpO1xudmFyIGxldmVscyA9IHJlcXVpcmUoJy4vbGV2ZWxzJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIGluY3ViYXRlID0gcmVxdWlyZSgnLi9pbmN1YmF0ZScpO1xudmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xudmFyIHlvdXJDdWJlO1xudmFyIHlvdXJDdWJlSW50ZXJuYWw7XG52YXIgeW91O1xudmFyIGZsYXNoaW5nO1xudmFyIGtleXM7XG52YXIgU1BBQ0UgPSAzMjtcbnZhciBMRUZUID0gMzc7XG52YXIgVE9QID0gMzg7XG52YXIgUklHSFQgPSAzOTtcbnZhciBCT1RUT00gPSA0MDtcbnZhciBSID0gODI7XG5cbmNvbnNvbGUubG9nKCclY1dlbGNvbWUgdG8gUG9ueSBDdWJlISBVc2UgdGhlIGFycm93IGtleXMuJywgJ2ZvbnQtZmFtaWx5OiBcIk1lcnJpd2VhdGhlclwiOyBmb250LXNpemU6IDYwcHg7IGNvbG9yOiAjZTkyYzZjOycpO1xuXG5ib2R5Lm9uKCdjbGljaycsIHdlbGNvbWUpO1xuYm9keS5vbigna2V5ZG93bicsIHdlbGNvbWluZyk7XG5ib2R5Lm9uKCdrZXlkb3duJywgc3BlY2lhbHMpO1xuXG5mdW5jdGlvbiB3ZWxjb21pbmcgKGUpIHtcbiAgaWYgKGUud2hpY2ggPT09IFNQQUNFKSB7XG4gICAgd2VsY29tZSgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNwZWNpYWxzIChlKSB7XG4gIGlmIChlLndoaWNoID09PSBSKSB7XG4gICAgZ2FtZW92ZXIoJ09LLiBUUlkgQUdBSU4hJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5jdWJhdGVDdWJlICgpIHtcbiAgeW91ckN1YmUgPSBpbmN1YmF0ZSgpLmFkZENsYXNzKCd0aGUtbWFuJyk7XG4gIHlvdXJDdWJlSW50ZXJuYWwgPSB5b3VyQ3ViZS5maW5kKCcucGMtY3ViZScpO1xufVxuXG5mdW5jdGlvbiB3ZWxjb21lICgpIHtcbiAgaWYgKGZsYXNoaW5nKSB7XG4gICAgJCgnI3dlbGNvbWUtdHdvJykucmVtb3ZlKCk7XG4gICAgYm9keS5yZW1vdmVDbGFzcygnZmxhc2h5Jyk7XG4gICAgc3RhcnQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAkKCcjd2VsY29tZS1vbmUnKS5yZW1vdmUoKTtcbiAgICBib2R5LnJlbW92ZUNsYXNzKCd3ZWxjb21lJyk7XG4gICAgYm9keS5hZGRDbGFzcygnZmxhc2h5Jyk7XG4gICAgZmxhc2hpbmcgPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAga2V5cyA9IHt9O1xuICBpbmN1YmF0ZUN1YmUoKTtcbiAgeW91ID0gbW9iKHlvdXJDdWJlLCB7IHR5cGU6ICd5b3UnIH0pO1xuICBlbWl0dGVyLmVtaXQoJ3BsYXllci5zdGFydCcsIHlvdSk7XG4gIGdsb2JhbC5jdWJlLnlvdSA9IHlvdTtcbiAgZW1pdHRlci5vbignbW9iLmxldmVsZG93bicsIGxldmVsZG93bik7XG4gIGVtaXR0ZXIub24oJ2xldmVscy53aW4nLCB3b24pO1xuICB5b3VyQ3ViZUludGVybmFsLmFkZENsYXNzKCdwYy1zaG93Jyk7XG4gIGJvZHkub2ZmKCdjbGljaycsIHdlbGNvbWUpO1xuICBib2R5Lm9mZigna2V5ZG93bicsIHdlbGNvbWluZyk7XG4gIGJvZHkub24oJ2tleWRvd24nLCBrZCk7XG4gIGJvZHkub24oJ2tleXVwJywga3UpO1xuICBnYW1lbG9vcCgpO1xuICBsZXZlbHMoeW91KTtcbn1cblxuZnVuY3Rpb24gbGV2ZWxkb3duIChtLCBsZXZlbCkge1xuICBpZiAobSA9PT0geW91KSB7XG4gICAgZW1pdHRlci5lbWl0KCdwbGF5ZXIuZGVhdGgnLCBsZXZlbCk7XG4gICAgeW91LnBsYWNlbWVudCgpO1xuICAgIGJvZHkuYWRkQ2xhc3MoJ2RlYXRoZmxhc2gnKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGJvZHkucmVtb3ZlQ2xhc3MoJ2RlYXRoZmxhc2gnKTtcbiAgICB9LCA0MDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGtkIChlKSB7IGtleXNbZS53aGljaF0gPSB0cnVlOyB9XG5mdW5jdGlvbiBrdSAoZSkgeyBrZXlzW2Uud2hpY2hdID0gZmFsc2U7IH1cbmZ1bmN0aW9uIG5vUG93cyAobSkgeyByZXR1cm4gIW0ucG93OyB9XG5mdW5jdGlvbiBvbmx5UG93cyAobSkgeyByZXR1cm4gISFtLnBvdzsgfVxuZnVuY3Rpb24gdXNlUG93IChtKSB7IG0ucmVtb3ZlKCk7IH1cbmZ1bmN0aW9uIGdhbWVsb29wICgpIHtcbiAgdmFyIGwgPSBrZXlzW0xFRlRdO1xuICB2YXIgdCA9IGtleXNbVE9QXTtcbiAgdmFyIHIgPSBrZXlzW1JJR0hUXTtcbiAgdmFyIGIgPSBrZXlzW0JPVFRPTV07XG4gIHZhciB1ID0ga2V5c1tTUEFDRV07XG4gIGlmIChsICYmIHIpIHsgbCA9IHIgPSBmYWxzZTsgfVxuICBpZiAodCAmJiBiKSB7IHQgPSBiID0gZmFsc2U7IH1cbiAgeW91Lm1vdmUobCA/IC0xIDogKHIgPyAxIDogMCksIHQgPyAtMSA6IChiID8gMSA6IDApKTtcbiAgbnBjcy50aWNrKCk7XG4gIGJ1bGxldHMudGljaygpO1xuICB2YXIgY2QgPSB5b3UuY2QoKTtcbiAgdmFyIGNkTm9Qb3dzID0gY2QuZmlsdGVyKG5vUG93cyk7XG4gIGNkLmZpbHRlcihvbmx5UG93cykuZm9yRWFjaCh1c2VQb3cpO1xuICBpZiAoeW91LmtpYSB8fCBjZE5vUG93cy5sZW5ndGgpIHtcbiAgICBjZE5vUG93cy5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gICAgICB5b3UuZGFtYWdlKG0ubGV2ZWwpO1xuICAgIH0pO1xuICAgIGlmICh5b3Uua2lhKSB7XG4gICAgICBnYW1lb3ZlcignWU9VXFwnUkUgVkVSWSBNVUNIIERFQUQgV09XfiEnKTsgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAodSkge1xuICAgIHlvdS5maXJlKCk7XG4gIH1cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVsb29wKTtcbn1cblxuZnVuY3Rpb24gZ2FtZW92ZXIgKG1lc3NhZ2UsIGNsYXNzZXMpIHtcbiAgZW1pdHRlci5vZmYoJ2xldmVscy53aW4nLCB3b24pO1xuICAkKCcucnQtdGludCcpLmFkZENsYXNzKFsncnQtc2hvdyddLmNvbmNhdChjbGFzc2VzIHx8IFtdKS5qb2luKCcgJykpO1xuICAkKCcucnQtdGV4dCcpLnRleHQobWVzc2FnZSk7XG4gIGNsZWFudXAoKTtcbiAgY29uc29sZS5sb2coJyVjJXMnLCAnZm9udC1mYW1pbHk6IFwiQ29taWMgU2FucyBNU1wiOyBmb250LXNpemU6IDI1cHg7IGNvbG9yOiAjZDExOTExOycsIG1lc3NhZ2UpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGJvZHkub24oJ2tleWRvd24nLCByZXN0YXJ0KTtcbiAgfSwgNTAwKTtcbn1cblxuZnVuY3Rpb24gY2xlYW51cCAoKSB7XG4gIGlmICh5b3VyQ3ViZUludGVybmFsKSB7IHlvdXJDdWJlSW50ZXJuYWwucmVtb3ZlQ2xhc3MoJ3BjLXNob3cnKTsgfVxuICBib2R5Lm9mZigna2V5dXAnLCBrdSk7XG4gIGJvZHkub2ZmKCdrZXlkb3duJywga2QpO1xuICBlbWl0dGVyLm9mZignbW9iLmxldmVsZG93bicsIGxldmVsZG93bik7XG4gIGVtaXR0ZXIub2ZmKCdsZXZlbHMud2luJywgd29uKTtcbiAgbnBjcy5jbGVhcigpO1xuICBwb3dzLmNsZWFyKCk7XG4gIHlvdXJDdWJlLnJlbW92ZSgpO1xuICBtb2JzLnNwbGljZSgwLCBtb2JzLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIHdvbiAoKSB7XG4gIGdhbWVvdmVyKCdaT01HIFlPVSBXT04hJywgWydydC13b24nXSk7XG59XG5cbmZ1bmN0aW9uIHJlc3RhcnQgKGUpIHtcbiAgaWYgKGUud2hpY2ggPT09IFNQQUNFKSB7XG4gICAgYm9keS5vZmYoJ2tleWRvd24nLCByZXN0YXJ0KTtcbiAgICAkKCcucnQtdGludCcpLnJlbW92ZUNsYXNzKCdydC1zaG93Jyk7XG4gICAgc2V0VGltZW91dChzdGFydCwgMTAwMCk7XG4gIH1cbn1cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgZW1pdHRlciA9IHJlcXVpcmUoJ2NvbnRyYS5lbWl0dGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZW1pdHRlcigpO1xuIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgaW5jdWJhdG9yID0gJCgnI3lvdScpO1xudmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xuXG5mdW5jdGlvbiBpbmN1YmF0ZSAoKSB7XG4gIHZhciBjdWJlID0gaW5jdWJhdG9yLmNsb25lKCkuYXBwZW5kVG8oYm9keSk7XG4gIGN1YmVbMF0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICBjdWJlLmZpbmQoJy5wYy1jdWJlJykuYWRkQ2xhc3MoJ3BjLXNtb290aCcpO1xuICByZXR1cm4gY3ViZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmN1YmF0ZTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgbnBjKHlvdSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgcG93ZXJ1cCh5b3UpO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xudmFyIGJ1bGxldHJhaW4gPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9idWxsZXRyYWluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICBucGMoeW91LCB7IGFpOiByb29raWUgfSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1mdW5rJyk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBidWxsZXRyYWluKDEpIH0pO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBtYWNoaW5lZ3VuID0gcmVxdWlyZSgnLi4vYWkvbWFjaGluZWd1bicpO1xudmFyIGdyb3dpbmdwYWluID0gcmVxdWlyZSgnLi4vYWkvZ3Jvd2luZ3BhaW4nKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiBncm93aW5ncGFpbiwgbGV2ZWw6IDEgfSkubm9kZS5hZGRDbGFzcygnbnBjLW1hc3MnKTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biB9KTtcbiAgcG93ZXJ1cCh5b3UpO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgZ3Jvd2luZ3BhaW4gPSByZXF1aXJlKCcuLi9haS9ncm93aW5ncGFpbicpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG52YXIgYnVsbGV0cmFpbiA9IHJlcXVpcmUoJy4uL3Bvd2VydXBzL2J1bGxldHJhaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIHlvdS5hZGRMZXZlbCgxKTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBidWxsZXRyYWluKDEpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IGJ1bGxldHJhaW4oMikgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiByb29raWUgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pO1xuICBucGMoeW91LCB7IGFpOiBncm93aW5ncGFpbiwgbGV2ZWw6IDEgfSkubm9kZS5hZGRDbGFzcygnbnBjLW1hc3MnKTs7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KTtcbn07XG4iLCJ2YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgcm9va2llID0gcmVxdWlyZSgnLi4vYWkvcm9va2llJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG52YXIgcmFpbnN0b3JtID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvcmFpbnN0b3JtJyk7XG52YXIgbWFjaGluZWd1biA9IHJlcXVpcmUoJy4uL2FpL21hY2hpbmVndW4nKTtcbnZhciBncm93aW5ncGFpbiA9IHJlcXVpcmUoJy4uL2FpL2dyb3dpbmdwYWluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiBncm93aW5ncGFpbiwgbGV2ZWw6IDMgfSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llLCBsZXZlbDogMSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAyIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IHJhaW5zdG9ybSgxKSB9KTtcbn07XG4iLCJ2YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgcm9va2llID0gcmVxdWlyZSgnLi4vYWkvcm9va2llJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIG1hY2hpbmVndW4gPSByZXF1aXJlKCcuLi9haS9tYWNoaW5lZ3VuJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciBidWxsZXRyYWluID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvYnVsbGV0cmFpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgeW91LmFkZExldmVsKDEpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciwgbGV2ZWw6IDEgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMyB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDMgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAzIH0pO1xuICBucGMoeW91LCB7IGFpOiByb29raWUsIGxldmVsOiAyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1tYXNzJyk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogYnVsbGV0cmFpbigyKSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBidWxsZXRyYWluKDIpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IGJ1bGxldHJhaW4oMikgfSk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogYnVsbGV0cmFpbigyKSB9KTtcbn07XG4iLCJ2YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgbWFjaGluZWd1biA9IHJlcXVpcmUoJy4uL2FpL21hY2hpbmVndW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIHlvdS5hZGRMZXZlbCgxLCAyKTtcbiAgcG93ZXJ1cCh5b3UpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciwgbGV2ZWw6IDYgfSkubm9kZS5hZGRDbGFzcygnbnBjLWJvc3MnKTtcbn07XG4iLCJ2YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgcm9va2llID0gcmVxdWlyZSgnLi4vYWkvcm9va2llJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIG1hY2hpbmVndW4gPSByZXF1aXJlKCcuLi9haS9tYWNoaW5lZ3VuJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciByYWluc3Rvcm0gPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9yYWluc3Rvcm0nKTtcbnZhciBidWxsZXRyYWluID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvYnVsbGV0cmFpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgeW91LmFkZExldmVsKDEpO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IHJhaW5zdG9ybSgzKSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBidWxsZXRyYWluKDMpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IGJ1bGxldHJhaW4oMykgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyLCBsZXZlbDogMSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAzIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMiB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAyIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1mdW5rJyk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4gfSkubm9kZS5hZGRDbGFzcygnbnBjLWZ1bmsnKTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSwgbGV2ZWw6IDIgfSkubm9kZS5hZGRDbGFzcygnbnBjLW1hc3MnKTtcbn07XG4iLCJ2YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgcm9va2llID0gcmVxdWlyZSgnLi4vYWkvcm9va2llJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG52YXIgcmFpbnN0b3JtID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvcmFpbnN0b3JtJyk7XG52YXIgY2hhb3NicmluZ2VyID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvY2hhb3NicmluZ2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICB5b3UuYWRkTGV2ZWwoMSk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogcmFpbnN0b3JtKDIpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IHJhaW5zdG9ybSgyKSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBjaGFvc2JyaW5nZXIoMikgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyLCBsZXZlbDogMSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1tYXNzJyk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAzIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMiB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAyIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1mdW5rJyk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4gfSkubm9kZS5hZGRDbGFzcygnbnBjLWZ1bmsnKTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llLCBsZXZlbDogMiB9KS5ub2RlLmFkZENsYXNzKCducGMtbWFzcycpO1xufTtcbiIsInZhciAkID0gcmVxdWlyZSgnZG9taW51cycpO1xudmFyIHBvd3MgPSByZXF1aXJlKCcuL3Bvd2VydXBzJyk7XG52YXIgbnBjcyA9IHJlcXVpcmUoJy4vbnBjcycpO1xudmFyIG5wYyA9IHJlcXVpcmUoJy4vbnBjJyk7XG52YXIgc2NvcmVib2FyZCA9IHJlcXVpcmUoJy4vc2NvcmVib2FyZCcpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciBsaXN0ZW5lcnMgPSBbXTtcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGRpc2NhcmRlZDtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZGlzY2FyZGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRpc2NhcmRlZCA9IHRydWU7XG4gICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICB2YXIgbGV2ZWwgPSAwO1xuICB2YXIgbGV2ZWxzID0ge1xuICAgIDA6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC8wJykpLFxuICAgIDE6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC8xJykpLFxuICAgIDI6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC8yJykpLFxuICAgIDM6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC8zJykpLFxuICAgIDQ6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC80JykpLFxuICAgIDU6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC81JykpLFxuICAgIDY6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC82JykpLFxuICAgIDc6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC83JykpLFxuICAgIDg6IG9uY2UocmVxdWlyZSgnLi9sZXZlbC84JykpLFxuICB9O1xuXG4gIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIGVtaXR0ZXIub2ZmKCducGMua2lsbCcsIGxpc3RlbmVyKTtcbiAgfSk7XG4gIGxpc3RlbmVycy5wdXNoKG5wY0tpbGwpO1xuICBlbWl0dGVyLm9uKCducGMua2lsbCcsIG5wY0tpbGwpO1xuICBzY29yZWJvYXJkLnJlc2V0KHlvdSk7XG4gIHJlc2V0KCk7XG5cbiAgZnVuY3Rpb24gbnBjS2lsbCAoY2xlYXJlZCkge1xuICAgIHZhciBuZXh0ID0gbGV2ZWwgKyAxO1xuICAgIGlmIChjbGVhcmVkKSB7XG4gICAgICBpZiAobGV2ZWxzW25leHRdKSB7XG4gICAgICAgICsrbGV2ZWw7XG4gICAgICAgIGNvbnNvbGUubG9nKCclY0xFVkVMICVzIENMRUFSIFdPV34hJywgJ2ZvbnQtZmFtaWx5OiBcIkNhcmRvXCI7IGZvbnQtc2l6ZTogMjVweDsgY29sb3I6ICNmZmQyZDI7JywgbmV4dCk7XG4gICAgICAgIHNldFRpbWVvdXQocmVzZXQsIDYwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnJWNMRVZFTCAlcyBDTEVBUiBaT01HIFNVQ0ggR0FNRVJ+IScsICdmb250LWZhbWlseTogXCJDYXJkb1wiOyBmb250LXNpemU6IDI1cHg7IGNvbG9yOiAjYTRkNGU2OycsIG5leHQpO1xuICAgICAgICBzZXRUaW1lb3V0KHdvbiwgNjAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNldCAoKSB7XG4gICAgZW1pdHRlci5lbWl0KCdsZXZlbHMuY2hhbmdlJywgbGV2ZWwpO1xuICAgIHNjb3JlYm9hcmQuYWRkKGxldmVsICogMTUpO1xuICAgIHlvdS5zZXQoNTAsIDUwKTtcbiAgICBpZiAobGV2ZWxzW2xldmVsXSkge1xuICAgICAgbnBjcy5jbGVhcigpO1xuICAgICAgcG93cy5jbGVhcigpO1xuICAgICAgJCgnLnBjLXBhcmVudCcpLmJ1dCgnI3lvdSwgLnRoZS1tYW4nKS5yZW1vdmUoKTtcbiAgICAgIGxldmVsc1tsZXZlbF0oeW91KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB3b24gKCkge1xuICAgIGVtaXR0ZXIuZW1pdCgnbGV2ZWxzLndpbicpO1xuICB9XG59O1xuIiwidmFyIG1vYnMgPSByZXF1aXJlKCcuL21vYnMnKTtcbnZhciBidWxsZXQgPSByZXF1aXJlKCcuL2J1bGxldCcpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciB1cyA9IHJlcXVpcmUoJy4vdXMnKTtcbnZhciBsYXN0YnVsbGV0ID0gRGF0ZS5ub3coKTtcbnZhciBidWxsZXRyYXRlID0gMzAwO1xudmFyIHNjcmVlbm1hcmdpbiA9IDMwO1xudmFyIGxhc3RJZCA9IDA7XG5cbmZ1bmN0aW9uIHIgKCkgeyByZXR1cm4gTWF0aC5yYW5kb20oKTsgfVxuXG5mdW5jdGlvbiBtb2IgKG5vZGUsIG9wdGlvbnMpIHtcbiAgdmFyIG8gPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgc3BlZWQgPSBvLnNwZWVkIHx8IDAuMztcbiAgdmFyIHRvcHNwZWVkID0gby50b3BzcGVlZCB8fCA0O1xuICB2YXIgYWNjZWwgPSB7XG4gICAgeDogby5hY2NlbCAmJiBvLmFjY2VsLnggfHwgMCwgeTogby5hY2NlbCAmJiBvLmFjY2VsLnkgfHwgMFxuICB9O1xuICB2YXIgZCA9IHtcbiAgICB4OiAwLCB5OiAwXG4gIH07XG4gIHZhciBsdHlwZTtcbiAgdmFyIG1lID0ge1xuICAgIGlkOiBsYXN0SWQrKyxcbiAgICB0eXBlOiBvLnR5cGUsXG4gICAgbm9kZTogbm9kZSxcbiAgICBtb3ZlOiBtb3ZlLFxuICAgIGxldmVsOiBvLmxldmVsIHx8IDAsXG4gICAgc2V0OiBzZXQsXG4gICAgY2Q6IGNkLFxuICAgIGZpcmU6IGZpcmUsXG4gICAgcGxhY2VtZW50OiBwbGFjZW1lbnQsXG4gICAgZGFtYWdlOiBkYW1hZ2UsXG4gICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgYWNjZWw6IGFjY2VsLFxuICAgIGQ6IGQsXG4gICAga2lhOiBmYWxzZSxcbiAgICBzZXRMZXZlbDogc2V0TGV2ZWwsXG4gICAgYWRkTGV2ZWw6IGFkZExldmVsXG4gIH07XG5cbiAgc2V0TGV2ZWwobWUubGV2ZWwpO1xuXG4gIG1vYnMucHVzaChtZSk7XG5cbiAgZnVuY3Rpb24gZiAodiwgZCkgeyByZXR1cm4gdiAqIChzcGVlZCArIGFjY2VsW2RdKTsgfVxuICBmdW5jdGlvbiBzYW5lICh2LCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodiwgc2NyZWVubWFyZ2luKSwgbWF4IC0gc2NyZWVubWFyZ2luKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdmUgKG94LCBveSkge1xuICAgIHZhciBjID0gbm9kZVswXTtcbiAgICB2YXIgcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGMpO1xuICAgIHZhciB4ID0gdXMudShzLmxlZnQpICsgZihveCwgJ3gnKTtcbiAgICB2YXIgeSA9IHVzLnUocy50b3ApICsgZihveSwgJ3knKTtcbiAgICB2YXIgc3ggPSBtZS5ndW5uZXIgPyB4IDogc2FuZSh4LCBpbm5lcldpZHRoKTtcbiAgICB2YXIgc3kgPSBtZS5ndW5uZXIgPyB5IDogc2FuZSh5LCBpbm5lckhlaWdodCk7XG4gICAgYy5zdHlsZS5sZWZ0ID0gdXMucChzeCk7XG4gICAgYy5zdHlsZS50b3AgPSB1cy5wKHN5KTtcbiAgICBtZS5kLnggPSBveDtcbiAgICBtZS5kLnkgPSBveTtcbiAgICBhY2NlbGVyYXRlKCd4Jywgb3gpO1xuICAgIGFjY2VsZXJhdGUoJ3knLCBveSk7XG4gICAgaGl0cyhzKTtcbiAgICByZXR1cm4geCA9PT0gc3ggJiYgeSA9PT0gc3k7XG4gIH1cblxuICBmdW5jdGlvbiBoaXRzIChjb21wdXRlZCkge1xuICAgIHZhciBzID0gY29tcHV0ZWQgfHwgd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZVswXSk7XG4gICAgbWUuaGl0Ym94ID0geyAvLyAxMCUgaGl0Ym94XG4gICAgICB4OiB1cy51KHMubGVmdCkgKiAwLjksXG4gICAgICB5OiB1cy51KHMudG9wKSAqIDAuOSxcbiAgICAgIHc6IHVzLnUocy53aWR0aCkgKiAxLjEsXG4gICAgICBoOiB1cy51KHMuaGVpZ2h0KSAqIDEuMVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBhY2NlbGVyYXRlIChkLCBtKSB7XG4gICAgYWNjZWxbZF0gKz0gbSA/IDAuMiA6IC0wLjY1O1xuICAgIGFjY2VsW2RdID0gTWF0aC5tYXgoTWF0aC5taW4odG9wc3BlZWQsIGFjY2VsW2RdKSwgMCk7XG4gIH1cblxuICBmdW5jdGlvbiBub3RNZSAobSkge1xuICAgIHJldHVybiBtICE9PSBtZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdE15QnVsbGV0IChtKSB7XG4gICAgcmV0dXJuIG0uZ3VubmVyICE9PSBtZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdE15R3VubmVyIChtKSB7XG4gICAgcmV0dXJuIG0gIT09IG1lLmd1bm5lcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdFNhbWVHdW5uZXIgKG0pIHtcbiAgICByZXR1cm4gIW0uZ3VubmVyIHx8ICFtZS5ndW5uZXIgfHwgbS5ndW5uZXIgIT09IG1lLmd1bm5lcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbGxpc2lvbiAobSkge1xuICAgIHZhciBsID0gbWUuaGl0Ym94O1xuICAgIHZhciByID0gbS5oaXRib3g7XG4gICAgdmFyIGIgPSBsICYmIHI7XG4gICAgaWYgKCFiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBseGIgPSBsLnggPj0gci54ICYmIGwueCA8IHIueCArIHIudztcbiAgICB2YXIgcnhiID0gci54ID49IGwueCAmJiByLnggPCBsLnggKyBsLnc7XG4gICAgdmFyIGx5YiA9IGwueSA+PSByLnkgJiYgbC55IDwgci55ICsgci5oO1xuICAgIHZhciByeWIgPSByLnkgPj0gbC55ICYmIHIueSA8IGwueSArIGwuaDtcbiAgICByZXR1cm4gKGx4YiB8fCByeGIpICYmIChseWIgfHwgcnliKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNkICgpIHtcbiAgICByZXR1cm4gbW9icy5maWx0ZXIobm90TWUpLmZpbHRlcihub3RNeUJ1bGxldCkuZmlsdGVyKG5vdE15R3VubmVyKS5maWx0ZXIobm90U2FtZUd1bm5lcikuZmlsdGVyKGNvbGxpc2lvbik7XG4gIH1cblxuICBmdW5jdGlvbiBzZXQgKHgsIHkpIHtcbiAgICB2YXIgYyA9IG5vZGVbMF07XG4gICAgYy5zdHlsZS5sZWZ0ID0gdXMucGMoeCwgaW5uZXJXaWR0aCk7XG4gICAgYy5zdHlsZS50b3AgPSB1cy5wYyh5LCBpbm5lckhlaWdodCk7XG4gICAgaGl0cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VtZW50ICgpIHtcbiAgICB2YXIgYXR0ZW1wdHMgPSAwO1xuICAgIHZhciB4ID0gcigpICogMTAwO1xuICAgIHZhciB5ID0gcigpICogMTAwO1xuICAgIHNldCh4LCB5KTtcblxuICAgIGlmICgrK2F0dGVtcHRzIDwgNSAmJiBjZCgpLmxlbmd0aCA+IDApIHtcbiAgICAgIHBsYWNlbWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpcmUgKCkge1xuICAgIGlmIChEYXRlLm5vdygpIC0gbGFzdGJ1bGxldCA+IGJ1bGxldHJhdGUpIHtcbiAgICAgIGxhc3RidWxsZXQgPSBEYXRlLm5vdygpO1xuICAgICAgYnVsbGV0KG1lLCB7IGxldmVsOiBNYXRoLmZsb29yKE1hdGgubWF4KDEsIG1lLmxldmVsICogMC41KSkgfSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlICgpIHtcbiAgICBpZiAobWUua2lhKSB7IC8vIHNhbml0eVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtZS5raWEgPSB0cnVlO1xuICAgIG5vZGUucmVtb3ZlKCk7XG4gICAgbW9icy5zcGxpY2UobW9icy5pbmRleE9mKG1lKSwgMSk7XG4gICAgZW1pdHRlci5lbWl0KCdtb2IucmVtb3ZlJywgbWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gbHYgKGwpIHtcbiAgICByZXR1cm4gbWUudHlwZSArICctJyArIGw7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRMZXZlbCAobCkge1xuICAgIG1lLm5vZGUuZmluZCgnLnBjLWN1YmUnKS5yZW1vdmVDbGFzcyhsdihtZS5sZXZlbCkpLmFkZENsYXNzKGx2KGwpKTtcbiAgICBtZS5sZXZlbCA9IGw7XG4gICAgZW1pdHRlci5lbWl0KCdtb2IubGV2ZWxjaGFuZ2UnLCBtZSwgbCk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRMZXZlbCAobCwgbSkge1xuICAgIHNldExldmVsKE1hdGgubWluKG1lLmxldmVsICsgbCwgbSB8fCBJbmZpbml0eSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGFtYWdlIChsKSB7XG4gICAgdmFyIGx2ID0gbCB8fCAxO1xuICAgIGlmIChtZS5sZXZlbCA+IGx2IC0gMSkge1xuICAgICAgc2V0TGV2ZWwobWUubGV2ZWwgLSBsdik7XG4gICAgICBlbWl0dGVyLmVtaXQoJ21vYi5sZXZlbGRvd24nLCBtZSwgbWUubGV2ZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbW9iO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIG1vYnMgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuY3ViZS5tb2IgPSBtb2JzO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvY29udHJhLmVtaXR0ZXIuanMnKTtcbiIsIihmdW5jdGlvbiAocHJvY2Vzcyl7XG4oZnVuY3Rpb24gKHJvb3QsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIHVuZGVmID0gJycgKyB1bmRlZmluZWQ7XG4gIGZ1bmN0aW9uIGF0b2EgKGEsIG4pIHsgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsIG4pOyB9XG4gIGZ1bmN0aW9uIGRlYm91bmNlIChmbiwgYXJncywgY3R4KSB7IGlmICghZm4pIHsgcmV0dXJuOyB9IHRpY2soZnVuY3Rpb24gcnVuICgpIHsgZm4uYXBwbHkoY3R4IHx8IG51bGwsIGFyZ3MgfHwgW10pOyB9KTsgfVxuXG4gIC8vIGNyb3NzLXBsYXRmb3JtIHRpY2tlclxuICB2YXIgc2kgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nLCB0aWNrO1xuICBpZiAoc2kpIHtcbiAgICB0aWNrID0gZnVuY3Rpb24gKGZuKSB7IHNldEltbWVkaWF0ZShmbik7IH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09IHVuZGVmICYmIHByb2Nlc3MubmV4dFRpY2spIHtcbiAgICB0aWNrID0gcHJvY2Vzcy5uZXh0VGljaztcbiAgfSBlbHNlIHtcbiAgICB0aWNrID0gZnVuY3Rpb24gKGZuKSB7IHNldFRpbWVvdXQoZm4sIDApOyB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2VtaXR0ZXIgKHRoaW5nLCBvcHRpb25zKSB7XG4gICAgdmFyIG9wdHMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHZhciBldnQgPSB7fTtcbiAgICBpZiAodGhpbmcgPT09IHVuZGVmaW5lZCkgeyB0aGluZyA9IHt9OyB9XG4gICAgdGhpbmcub24gPSBmdW5jdGlvbiAodHlwZSwgZm4pIHtcbiAgICAgIGlmICghZXZ0W3R5cGVdKSB7XG4gICAgICAgIGV2dFt0eXBlXSA9IFtmbl07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldnRbdHlwZV0ucHVzaChmbik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpbmc7XG4gICAgfTtcbiAgICB0aGluZy5vbmNlID0gZnVuY3Rpb24gKHR5cGUsIGZuKSB7XG4gICAgICBmbi5fb25jZSA9IHRydWU7IC8vIHRoaW5nLm9mZihmbikgc3RpbGwgd29ya3MhXG4gICAgICB0aGluZy5vbih0eXBlLCBmbik7XG4gICAgICByZXR1cm4gdGhpbmc7XG4gICAgfTtcbiAgICB0aGluZy5vZmYgPSBmdW5jdGlvbiAodHlwZSwgZm4pIHtcbiAgICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChjID09PSAxKSB7XG4gICAgICAgIGRlbGV0ZSBldnRbdHlwZV07XG4gICAgICB9IGVsc2UgaWYgKGMgPT09IDApIHtcbiAgICAgICAgZXZ0ID0ge307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXQgPSBldnRbdHlwZV07XG4gICAgICAgIGlmICghZXQpIHsgcmV0dXJuIHRoaW5nOyB9XG4gICAgICAgIGV0LnNwbGljZShldC5pbmRleE9mKGZuKSwgMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpbmc7XG4gICAgfTtcbiAgICB0aGluZy5lbWl0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGN0eCA9IHRoaXM7XG4gICAgICB2YXIgYXJncyA9IGF0b2EoYXJndW1lbnRzKTtcbiAgICAgIHZhciB0eXBlID0gYXJncy5zaGlmdCgpO1xuICAgICAgdmFyIGV0ID0gZXZ0W3R5cGVdO1xuICAgICAgaWYgKHR5cGUgPT09ICdlcnJvcicgJiYgb3B0cy50aHJvd3MgIT09IGZhbHNlICYmICFldCkgeyB0aHJvdyBhcmdzLmxlbmd0aCA9PT0gMSA/IGFyZ3NbMF0gOiBhcmdzOyB9XG4gICAgICBpZiAoIWV0KSB7IHJldHVybiB0aGluZzsgfVxuICAgICAgZXZ0W3R5cGVdID0gZXQuZmlsdGVyKGZ1bmN0aW9uIGVtaXR0ZXIgKGxpc3Rlbikge1xuICAgICAgICBpZiAob3B0cy5hc3luYykgeyBkZWJvdW5jZShsaXN0ZW4sIGFyZ3MsIGN0eCk7IH0gZWxzZSB7IGxpc3Rlbi5hcHBseShjdHgsIGFyZ3MpOyB9XG4gICAgICAgIHJldHVybiAhbGlzdGVuLl9vbmNlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpbmc7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpbmc7XG4gIH1cblxuICAvLyBjcm9zcy1wbGF0Zm9ybSBleHBvcnRcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09IHVuZGVmICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBfZW1pdHRlcjtcbiAgfSBlbHNlIHtcbiAgICByb290LmNvbnRyYSA9IHJvb3QuY29udHJhIHx8IHt9O1xuICAgIHJvb3QuY29udHJhLmVtaXR0ZXIgPSBfZW1pdHRlcjtcbiAgfVxufSkodGhpcyk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiL1VzZXJzL25pY28vLm52bS92MC4xMC4yNi9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiKSkiLCJ2YXIgcG9zZXIgPSByZXF1aXJlKCcuL3NyYy9ub2RlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcG9zZXI7XG5cblsnQXJyYXknLCAnRnVuY3Rpb24nLCAnT2JqZWN0JywgJ0RhdGUnLCAnU3RyaW5nJ10uZm9yRWFjaChwb3NlKTtcblxuZnVuY3Rpb24gcG9zZSAodHlwZSkge1xuICBwb3Nlclt0eXBlXSA9IGZ1bmN0aW9uIHBvc2VDb21wdXRlZFR5cGUgKCkgeyByZXR1cm4gcG9zZXIodHlwZSk7IH07XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBkID0gZ2xvYmFsLmRvY3VtZW50O1xuXG5mdW5jdGlvbiBwb3NlciAodHlwZSkge1xuICB2YXIgaWZyYW1lID0gZC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblxuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgZC5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG5cbiAgcmV0dXJuIG1hcCh0eXBlLCBpZnJhbWUuY29udGVudFdpbmRvdyk7XG59XG5cbmZ1bmN0aW9uIG1hcCAodHlwZSwgc291cmNlKSB7IC8vIGZvcndhcmQgcG9seWZpbGxzIHRvIHRoZSBzdG9sZW4gcmVmZXJlbmNlIVxuICB2YXIgb3JpZ2luYWwgPSB3aW5kb3dbdHlwZV0ucHJvdG90eXBlO1xuICB2YXIgdmFsdWUgPSBzb3VyY2VbdHlwZV07XG4gIHZhciBwcm9wO1xuXG4gIGZvciAocHJvcCBpbiBvcmlnaW5hbCkge1xuICAgIHZhbHVlLnByb3RvdHlwZVtwcm9wXSA9IG9yaWdpbmFsW3Byb3BdO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvc2VyO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGV4cGFuZG8gPSAnc2VrdG9yLScgKyBEYXRlLm5vdygpO1xudmFyIHJzaWJsaW5ncyA9IC9bK35dLztcbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbnZhciBkZWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG52YXIgbWF0Y2ggPSBkZWwubWF0Y2hlcyB8fFxuICAgICAgICAgICAgZGVsLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgZGVsLm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgZGVsLm9NYXRjaGVzU2VsZWN0b3IgfHxcbiAgICAgICAgICAgIGRlbC5tc01hdGNoZXNTZWxlY3RvcjtcblxuZnVuY3Rpb24gcXNhIChzZWxlY3RvciwgY29udGV4dCkge1xuICB2YXIgZXhpc3RlZCwgaWQsIHByZWZpeCwgcHJlZml4ZWQsIGFkYXB0ZXIsIGhhY2sgPSBjb250ZXh0ICE9PSBkb2N1bWVudDtcbiAgaWYgKGhhY2spIHsgLy8gaWQgaGFjayBmb3IgY29udGV4dC1yb290ZWQgcXVlcmllc1xuICAgIGV4aXN0ZWQgPSBjb250ZXh0LmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICBpZCA9IGV4aXN0ZWQgfHwgZXhwYW5kbztcbiAgICBwcmVmaXggPSAnIycgKyBpZCArICcgJztcbiAgICBwcmVmaXhlZCA9IHByZWZpeCArIHNlbGVjdG9yLnJlcGxhY2UoLywvZywgJywnICsgcHJlZml4KTtcbiAgICBhZGFwdGVyID0gcnNpYmxpbmdzLnRlc3Qoc2VsZWN0b3IpICYmIGNvbnRleHQucGFyZW50Tm9kZTtcbiAgICBpZiAoIWV4aXN0ZWQpIHsgY29udGV4dC5zZXRBdHRyaWJ1dGUoJ2lkJywgaWQpOyB9XG4gIH1cbiAgdHJ5IHtcbiAgICByZXR1cm4gKGFkYXB0ZXIgfHwgY29udGV4dCkucXVlcnlTZWxlY3RvckFsbChwcmVmaXhlZCB8fCBzZWxlY3Rvcik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gW107XG4gIH0gZmluYWxseSB7XG4gICAgaWYgKGV4aXN0ZWQgPT09IG51bGwpIHsgY29udGV4dC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7IH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kIChzZWxlY3RvciwgY3R4LCBjb2xsZWN0aW9uLCBzZWVkKSB7XG4gIHZhciBlbGVtZW50O1xuICB2YXIgY29udGV4dCA9IGN0eCB8fCBkb2N1bWVudDtcbiAgdmFyIHJlc3VsdHMgPSBjb2xsZWN0aW9uIHx8IFtdO1xuICB2YXIgaSA9IDA7XG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cbiAgaWYgKGNvbnRleHQubm9kZVR5cGUgIT09IDEgJiYgY29udGV4dC5ub2RlVHlwZSAhPT0gOSkge1xuICAgIHJldHVybiBbXTsgLy8gYmFpbCBpZiBjb250ZXh0IGlzIG5vdCBhbiBlbGVtZW50IG9yIGRvY3VtZW50XG4gIH1cbiAgaWYgKHNlZWQpIHtcbiAgICB3aGlsZSAoKGVsZW1lbnQgPSBzZWVkW2krK10pKSB7XG4gICAgICBpZiAobWF0Y2hlc1NlbGVjdG9yKGVsZW1lbnQsIHNlbGVjdG9yKSkge1xuICAgICAgICByZXN1bHRzLnB1c2goZWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdHMucHVzaC5hcHBseShyZXN1bHRzLCBxc2Eoc2VsZWN0b3IsIGNvbnRleHQpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyAoc2VsZWN0b3IsIGVsZW1lbnRzKSB7XG4gIHJldHVybiBmaW5kKHNlbGVjdG9yLCBudWxsLCBudWxsLCBlbGVtZW50cyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXNTZWxlY3RvciAoZWxlbWVudCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIG1hdGNoLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmQ7XG5cbmZpbmQubWF0Y2hlcyA9IG1hdGNoZXM7XG5maW5kLm1hdGNoZXNTZWxlY3RvciA9IG1hdGNoZXNTZWxlY3RvcjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBwb3NlciA9IHJlcXVpcmUoJ3Bvc2VyJyk7XG52YXIgRG9taW51cyA9IHBvc2VyLkFycmF5KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRG9taW51cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyICQgPSByZXF1aXJlKCcuL3B1YmxpYycpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL2NvcmUnKTtcbnZhciBkb20gPSByZXF1aXJlKCcuL2RvbScpO1xudmFyIGNsYXNzZXMgPSByZXF1aXJlKCcuL2NsYXNzZXMnKTtcbnZhciBEb21pbnVzID0gcmVxdWlyZSgnLi9Eb21pbnVzLmN0b3InKTtcblxuZnVuY3Rpb24gZXF1YWxzIChzZWxlY3Rvcikge1xuICByZXR1cm4gZnVuY3Rpb24gZXF1YWxzIChlbGVtKSB7XG4gICAgcmV0dXJuIGRvbS5tYXRjaGVzKGVsZW0sIHNlbGVjdG9yKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RyYWlnaHQgKHByb3AsIG9uZSkge1xuICByZXR1cm4gZnVuY3Rpb24gZG9tTWFwcGluZyAoc2VsZWN0b3IpIHtcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5tYXAoZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgIHJldHVybiBkb21bcHJvcF0oZWxlbSwgc2VsZWN0b3IpO1xuICAgIH0pO1xuICAgIHZhciByZXN1bHRzID0gY29yZS5mbGF0dGVuKHJlc3VsdCk7XG4gICAgcmV0dXJuIG9uZSA/IHJlc3VsdHNbMF0gOiByZXN1bHRzO1xuICB9O1xufVxuXG5Eb21pbnVzLnByb3RvdHlwZS5wcmV2ID0gc3RyYWlnaHQoJ3ByZXYnKTtcbkRvbWludXMucHJvdG90eXBlLm5leHQgPSBzdHJhaWdodCgnbmV4dCcpO1xuRG9taW51cy5wcm90b3R5cGUucGFyZW50ID0gc3RyYWlnaHQoJ3BhcmVudCcpO1xuRG9taW51cy5wcm90b3R5cGUucGFyZW50cyA9IHN0cmFpZ2h0KCdwYXJlbnRzJyk7XG5Eb21pbnVzLnByb3RvdHlwZS5jaGlsZHJlbiA9IHN0cmFpZ2h0KCdjaGlsZHJlbicpO1xuRG9taW51cy5wcm90b3R5cGUuZmluZCA9IHN0cmFpZ2h0KCdxc2EnKTtcbkRvbWludXMucHJvdG90eXBlLmZpbmRPbmUgPSBzdHJhaWdodCgncXMnLCB0cnVlKTtcblxuRG9taW51cy5wcm90b3R5cGUud2hlcmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHRoaXMuZmlsdGVyKGVxdWFscyhzZWxlY3RvcikpO1xufTtcblxuRG9taW51cy5wcm90b3R5cGUuaXMgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHRoaXMuc29tZShlcXVhbHMoc2VsZWN0b3IpKTtcbn07XG5cbkRvbWludXMucHJvdG90eXBlLmkgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgcmV0dXJuIG5ldyBEb21pbnVzKHRoaXNbaW5kZXhdKTtcbn07XG5cbmZ1bmN0aW9uIGNvbXBhcmVGYWN0b3J5IChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gY29tcGFyZSAoKSB7XG4gICAgJC5hcHBseShudWxsLCBhcmd1bWVudHMpLmZvckVhY2goZm4sIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufVxuXG5Eb21pbnVzLnByb3RvdHlwZS5hbmQgPSBjb21wYXJlRmFjdG9yeShmdW5jdGlvbiBhZGRPbmUgKGVsZW0pIHtcbiAgaWYgKHRoaXMuaW5kZXhPZihlbGVtKSA9PT0gLTEpIHtcbiAgICB0aGlzLnB1c2goZWxlbSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59KTtcblxuRG9taW51cy5wcm90b3R5cGUuYnV0ID0gY29tcGFyZUZhY3RvcnkoZnVuY3Rpb24gYWRkT25lIChlbGVtKSB7XG4gIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihlbGVtKTtcbiAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn0pO1xuXG5Eb21pbnVzLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uICh0eXBlcywgZmlsdGVyLCBmbikge1xuICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICB0eXBlcy5zcGxpdCgnICcpLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgIGRvbS5vbihlbGVtLCB0eXBlLCBmaWx0ZXIsIGZuKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRG9taW51cy5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKHR5cGVzLCBmaWx0ZXIsIGZuKSB7XG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xuICAgIHR5cGVzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgZG9tLm9mZihlbGVtLCB0eXBlLCBmaWx0ZXIsIGZuKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuW1xuICBbJ2FkZENsYXNzJywgY2xhc3Nlcy5hZGRdLFxuICBbJ3JlbW92ZUNsYXNzJywgY2xhc3Nlcy5yZW1vdmVdLFxuICBbJ3NldENsYXNzJywgY2xhc3Nlcy5zZXRdLFxuICBbJ3JlbW92ZUNsYXNzJywgY2xhc3Nlcy5yZW1vdmVdLFxuICBbJ3JlbW92ZScsIGRvbS5yZW1vdmVdXG5dLmZvckVhY2gobWFwTWV0aG9kcyk7XG5cbmZ1bmN0aW9uIG1hcE1ldGhvZHMgKGRhdGEpIHtcbiAgRG9taW51cy5wcm90b3R5cGVbZGF0YVswXV0gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgIGRhdGFbMV0oZWxlbSwgdmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufVxuXG5bXG4gIFsnYXBwZW5kJywgZG9tLmFwcGVuZF0sXG4gIFsnYXBwZW5kVG8nLCBkb20uYXBwZW5kVG9dLFxuICBbJ3ByZXBlbmQnLCBkb20ucHJlcGVuZF0sXG4gIFsncHJlcGVuZFRvJywgZG9tLnByZXBlbmRUb10sXG4gIFsnYmVmb3JlJywgZG9tLmJlZm9yZV0sXG4gIFsnYmVmb3JlT2YnLCBkb20uYmVmb3JlT2ZdLFxuICBbJ2FmdGVyJywgZG9tLmFmdGVyXSxcbiAgWydhZnRlck9mJywgZG9tLmFmdGVyT2ZdLFxuICBbJ3Nob3cnLCBkb20uc2hvd10sXG4gIFsnaGlkZScsIGRvbS5oaWRlXVxuXS5mb3JFYWNoKG1hcE1hbmlwdWxhdGlvbik7XG5cbmZ1bmN0aW9uIG1hcE1hbmlwdWxhdGlvbiAoZGF0YSkge1xuICBEb21pbnVzLnByb3RvdHlwZVtkYXRhWzBdXSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGRhdGFbMV0odGhpcywgdmFsdWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufVxuXG5Eb21pbnVzLnByb3RvdHlwZS5oYXNDbGFzcyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5zb21lKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgcmV0dXJuIGNsYXNzZXMuY29udGFpbnMoZWxlbSwgdmFsdWUpO1xuICB9KTtcbn07XG5cbkRvbWludXMucHJvdG90eXBlLmF0dHIgPSBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgdmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAyO1xuICB2YXIgcmVzdWx0ID0gdGhpcy5tYXAoZnVuY3Rpb24gKGVsZW0pIHtcbiAgICByZXR1cm4gZ2V0dGVyID8gZG9tLmF0dHIoZWxlbSwgbmFtZSkgOiBkb20uYXR0cihlbGVtLCBuYW1lLCB2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gZ2V0dGVyID8gcmVzdWx0WzBdIDogdGhpcztcbn07XG5cbmZ1bmN0aW9uIGtleVZhbHVlIChrZXksIHZhbHVlKSB7XG4gIHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMjtcbiAgaWYgKGdldHRlcikge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA/IGRvbVtrZXldKHRoaXNbMF0pIDogJyc7XG4gIH1cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgZG9tW2tleV0oZWxlbSwgdmFsdWUpO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbmZ1bmN0aW9uIGtleVZhbHVlUHJvcGVydHkgKHByb3ApIHtcbiAgRG9taW51cy5wcm90b3R5cGVbcHJvcF0gPSBmdW5jdGlvbiBhY2Nlc3NvciAodmFsdWUpIHtcbiAgICB2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDE7XG4gICAgaWYgKGdldHRlcikge1xuICAgICAgcmV0dXJuIGtleVZhbHVlLmNhbGwodGhpcywgcHJvcCk7XG4gICAgfVxuICAgIHJldHVybiBrZXlWYWx1ZS5jYWxsKHRoaXMsIHByb3AsIHZhbHVlKTtcbiAgfTtcbn1cblxuWydodG1sJywgJ3RleHQnLCAndmFsdWUnXS5mb3JFYWNoKGtleVZhbHVlUHJvcGVydHkpO1xuXG5Eb21pbnVzLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgcmV0dXJuIGRvbS5jbG9uZShlbGVtKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vcHVibGljJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0cmltID0gL15cXHMrfFxccyskL2c7XG52YXIgd2hpdGVzcGFjZSA9IC9cXHMrL2c7XG5cbmZ1bmN0aW9uIGludGVycHJldCAoaW5wdXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyBpbnB1dC5yZXBsYWNlKHRyaW0sICcnKS5zcGxpdCh3aGl0ZXNwYWNlKSA6IGlucHV0O1xufVxuXG5mdW5jdGlvbiBjbGFzc2VzIChub2RlKSB7XG4gIHJldHVybiBub2RlLmNsYXNzTmFtZS5yZXBsYWNlKHRyaW0sICcnKS5zcGxpdCh3aGl0ZXNwYWNlKTtcbn1cblxuZnVuY3Rpb24gc2V0IChub2RlLCBpbnB1dCkge1xuICBub2RlLmNsYXNzTmFtZSA9IGludGVycHJldChpbnB1dCkuam9pbignICcpO1xufVxuXG5mdW5jdGlvbiBhZGQgKG5vZGUsIGlucHV0KSB7XG4gIHZhciBjdXJyZW50ID0gcmVtb3ZlKG5vZGUsIGlucHV0KTtcbiAgdmFyIHZhbHVlcyA9IGludGVycHJldChpbnB1dCk7XG4gIGN1cnJlbnQucHVzaC5hcHBseShjdXJyZW50LCB2YWx1ZXMpO1xuICBzZXQobm9kZSwgY3VycmVudCk7XG4gIHJldHVybiBjdXJyZW50O1xufVxuXG5mdW5jdGlvbiByZW1vdmUgKG5vZGUsIGlucHV0KSB7XG4gIHZhciBjdXJyZW50ID0gY2xhc3Nlcyhub2RlKTtcbiAgdmFyIHZhbHVlcyA9IGludGVycHJldChpbnB1dCk7XG4gIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBpID0gY3VycmVudC5pbmRleE9mKHZhbHVlKTtcbiAgICBpZiAoaSAhPT0gLTEpIHtcbiAgICAgIGN1cnJlbnQuc3BsaWNlKGksIDEpO1xuICAgIH1cbiAgfSk7XG4gIHNldChub2RlLCBjdXJyZW50KTtcbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIGNvbnRhaW5zIChub2RlLCBpbnB1dCkge1xuICB2YXIgY3VycmVudCA9IGNsYXNzZXMobm9kZSk7XG4gIHZhciB2YWx1ZXMgPSBpbnRlcnByZXQoaW5wdXQpO1xuXG4gIHJldHVybiB2YWx1ZXMuZXZlcnkoZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIGN1cnJlbnQuaW5kZXhPZih2YWx1ZSkgIT09IC0xO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFkZDogYWRkLFxuICByZW1vdmU6IHJlbW92ZSxcbiAgY29udGFpbnM6IGNvbnRhaW5zLFxuICBzZXQ6IHNldCxcbiAgZ2V0OiBjbGFzc2VzXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdGVzdCA9IHJlcXVpcmUoJy4vdGVzdCcpO1xudmFyIERvbWludXMgPSByZXF1aXJlKCcuL0RvbWludXMuY3RvcicpO1xudmFyIHByb3RvID0gRG9taW51cy5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIEFwcGxpZWQgKGFyZ3MpIHtcbiAgcmV0dXJuIERvbWludXMuYXBwbHkodGhpcywgYXJncyk7XG59XG5cbkFwcGxpZWQucHJvdG90eXBlID0gcHJvdG87XG5cblsnbWFwJywgJ2ZpbHRlcicsICdjb25jYXQnXS5mb3JFYWNoKGVuc3VyZSk7XG5cbmZ1bmN0aW9uIGVuc3VyZSAoa2V5KSB7XG4gIHZhciBvcmlnaW5hbCA9IHByb3RvW2tleV07XG4gIHByb3RvW2tleV0gPSBmdW5jdGlvbiBhcHBsaWVkICgpIHtcbiAgICByZXR1cm4gYXBwbHkob3JpZ2luYWwuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGFwcGx5IChhKSB7XG4gIHJldHVybiBuZXcgQXBwbGllZChhKTtcbn1cblxuZnVuY3Rpb24gY2FzdCAoYSkge1xuICBpZiAoYSBpbnN0YW5jZW9mIERvbWludXMpIHtcbiAgICByZXR1cm4gYTtcbiAgfVxuICBpZiAoIWEpIHtcbiAgICByZXR1cm4gbmV3IERvbWludXMoKTtcbiAgfVxuICBpZiAodGVzdC5pc0VsZW1lbnQoYSkpIHtcbiAgICByZXR1cm4gbmV3IERvbWludXMoYSk7XG4gIH1cbiAgaWYgKCF0ZXN0LmlzQXJyYXkoYSkpIHtcbiAgICByZXR1cm4gbmV3IERvbWludXMoKTtcbiAgfVxuICByZXR1cm4gYXBwbHkoYSkuZmlsdGVyKGZ1bmN0aW9uIChpKSB7XG4gICAgcmV0dXJuIHRlc3QuaXNFbGVtZW50KGkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZmxhdHRlbiAoYSwgY2FjaGUpIHtcbiAgcmV0dXJuIGEucmVkdWNlKGZ1bmN0aW9uIChjdXJyZW50LCBpdGVtKSB7XG4gICAgaWYgKERvbWludXMuaXNBcnJheShpdGVtKSkge1xuICAgICAgcmV0dXJuIGZsYXR0ZW4oaXRlbSwgY3VycmVudCk7XG4gICAgfSBlbHNlIGlmIChjdXJyZW50LmluZGV4T2YoaXRlbSkgPT09IC0xKSB7XG4gICAgICByZXR1cm4gY3VycmVudC5jb25jYXQoaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiBjdXJyZW50O1xuICB9LCBjYWNoZSB8fCBuZXcgRG9taW51cygpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwcGx5OiBhcHBseSxcbiAgY2FzdDogY2FzdCxcbiAgZmxhdHRlbjogZmxhdHRlblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHNla3RvciA9IHJlcXVpcmUoJ3Nla3RvcicpO1xudmFyIERvbWludXMgPSByZXF1aXJlKCcuL0RvbWludXMuY3RvcicpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL2NvcmUnKTtcbnZhciBldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xudmFyIHRleHQgPSByZXF1aXJlKCcuL3RleHQnKTtcbnZhciB0ZXN0ID0gcmVxdWlyZSgnLi90ZXN0Jyk7XG52YXIgYXBpID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBkZWxlZ2F0ZXMgPSB7fTtcblxuZnVuY3Rpb24gY2FzdENvbnRleHQgKGNvbnRleHQpIHtcbiAgaWYgKHR5cGVvZiBjb250ZXh0ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBhcGkucXMobnVsbCwgY29udGV4dCk7XG4gIH1cbiAgaWYgKHRlc3QuaXNFbGVtZW50KGNvbnRleHQpKSB7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cbiAgaWYgKGNvbnRleHQgaW5zdGFuY2VvZiBEb21pbnVzKSB7XG4gICAgcmV0dXJuIGNvbnRleHRbMF07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmFwaS5xc2EgPSBmdW5jdGlvbiAoZWxlbSwgc2VsZWN0b3IpIHtcbiAgdmFyIHJlc3VsdHMgPSBuZXcgRG9taW51cygpO1xuICByZXR1cm4gc2VrdG9yKHNlbGVjdG9yLCBjYXN0Q29udGV4dChlbGVtKSwgcmVzdWx0cyk7XG59O1xuXG5hcGkucXMgPSBmdW5jdGlvbiAoZWxlbSwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGFwaS5xc2EoZWxlbSwgc2VsZWN0b3IpWzBdO1xufTtcblxuYXBpLm1hdGNoZXMgPSBmdW5jdGlvbiAoZWxlbSwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNla3Rvci5tYXRjaGVzU2VsZWN0b3IoZWxlbSwgc2VsZWN0b3IpO1xufTtcblxuZnVuY3Rpb24gcmVsYXRlZEZhY3RvcnkgKHByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHJlbGF0ZWQgKGVsZW0sIHNlbGVjdG9yKSB7XG4gICAgdmFyIHJlbGF0aXZlID0gZWxlbVtwcm9wXTtcbiAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgIGlmICghc2VsZWN0b3IgfHwgYXBpLm1hdGNoZXMocmVsYXRpdmUsIHNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gY29yZS5jYXN0KHJlbGF0aXZlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEb21pbnVzKCk7XG4gIH07XG59XG5cbmFwaS5wcmV2ID0gcmVsYXRlZEZhY3RvcnkoJ3ByZXZpb3VzU2libGluZycpO1xuYXBpLm5leHQgPSByZWxhdGVkRmFjdG9yeSgnbmV4dFNpYmxpbmcnKTtcbmFwaS5wYXJlbnQgPSByZWxhdGVkRmFjdG9yeSgncGFyZW50RWxlbWVudCcpO1xuXG5mdW5jdGlvbiBtYXRjaGVzIChlbGVtLCB2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRG9taW51cykge1xuICAgIHJldHVybiB2YWx1ZS5pbmRleE9mKGVsZW0pICE9PSAtMTtcbiAgfVxuICBpZiAodGVzdC5pc0VsZW1lbnQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGVsZW0gPT09IHZhbHVlO1xuICB9XG4gIHJldHVybiBhcGkubWF0Y2hlcyhlbGVtLCB2YWx1ZSk7XG59XG5cbmFwaS5wYXJlbnRzID0gZnVuY3Rpb24gKGVsZW0sIHZhbHVlKSB7XG4gIHZhciBub2RlcyA9IFtdO1xuICB2YXIgbm9kZSA9IGVsZW07XG4gIHdoaWxlIChub2RlLnBhcmVudEVsZW1lbnQpIHtcbiAgICBpZiAobWF0Y2hlcyhub2RlLnBhcmVudEVsZW1lbnQsIHZhbHVlKSkge1xuICAgICAgbm9kZXMucHVzaChub2RlLnBhcmVudEVsZW1lbnQpO1xuICAgIH1cbiAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBjb3JlLmFwcGx5KG5vZGVzKTtcbn07XG5cbmFwaS5jaGlsZHJlbiA9IGZ1bmN0aW9uIChlbGVtLCB2YWx1ZSkge1xuICB2YXIgbm9kZXMgPSBbXTtcbiAgdmFyIGNoaWxkcmVuID0gZWxlbS5jaGlsZHJlbjtcbiAgdmFyIGNoaWxkO1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICBpZiAobWF0Y2hlcyhjaGlsZCwgdmFsdWUpKSB7XG4gICAgICBub2Rlcy5wdXNoKGNoaWxkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvcmUuYXBwbHkobm9kZXMpO1xufTtcblxuLy8gdGhpcyBtZXRob2QgY2FjaGVzIGRlbGVnYXRlcyBzbyB0aGF0IC5vZmYoKSB3b3JrcyBzZWFtbGVzc2x5XG5mdW5jdGlvbiBkZWxlZ2F0ZSAocm9vdCwgZmlsdGVyLCBmbikge1xuICBpZiAoZGVsZWdhdGVzW2ZuLl9kZF0pIHtcbiAgICByZXR1cm4gZGVsZWdhdGVzW2ZuLl9kZF07XG4gIH1cbiAgZm4uX2RkID0gRGF0ZS5ub3coKTtcbiAgZGVsZWdhdGVzW2ZuLl9kZF0gPSBkZWxlZ2F0b3I7XG4gIGZ1bmN0aW9uIGRlbGVnYXRvciAoZSkge1xuICAgIHZhciBlbGVtID0gZS50YXJnZXQ7XG4gICAgd2hpbGUgKGVsZW0gJiYgZWxlbSAhPT0gcm9vdCkge1xuICAgICAgaWYgKGFwaS5tYXRjaGVzKGVsZW0sIGZpbHRlcikpIHtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZWxlbSA9IGVsZW0ucGFyZW50RWxlbWVudDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlbGVnYXRvcjtcbn1cblxuYXBpLm9uID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGZpbHRlciwgZm4pIHtcbiAgaWYgKGZuID09PSB2b2lkIDApIHtcbiAgICBldmVudHMuYWRkKGVsZW0sIHR5cGUsIGZpbHRlcik7IC8vIGZpbHRlciBfaXNfIGZuXG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLmFkZChlbGVtLCB0eXBlLCBkZWxlZ2F0ZShlbGVtLCBmaWx0ZXIsIGZuKSk7XG4gIH1cbn07XG5cbmFwaS5vZmYgPSBmdW5jdGlvbiAoZWxlbSwgdHlwZSwgZmlsdGVyLCBmbikge1xuICBpZiAoZm4gPT09IHZvaWQgMCkge1xuICAgIGV2ZW50cy5yZW1vdmUoZWxlbSwgdHlwZSwgZmlsdGVyKTsgLy8gZmlsdGVyIF9pc18gZm5cbiAgfSBlbHNlIHtcbiAgICBldmVudHMucmVtb3ZlKGVsZW0sIHR5cGUsIGRlbGVnYXRlKGVsZW0sIGZpbHRlciwgZm4pKTtcbiAgfVxufTtcblxuYXBpLmh0bWwgPSBmdW5jdGlvbiAoZWxlbSwgaHRtbCkge1xuICB2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDI7XG4gIGlmIChnZXR0ZXIpIHtcbiAgICByZXR1cm4gZWxlbS5pbm5lckhUTUw7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5pbm5lckhUTUwgPSBodG1sO1xuICB9XG59O1xuXG5hcGkudGV4dCA9IGZ1bmN0aW9uIChlbGVtLCB0ZXh0KSB7XG4gIHZhciBjaGVja2FibGUgPSB0ZXN0LmlzQ2hlY2thYmxlKGVsZW0pO1xuICB2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDI7XG4gIGlmIChnZXR0ZXIpIHtcbiAgICByZXR1cm4gY2hlY2thYmxlID8gZWxlbS52YWx1ZSA6IGVsZW0uaW5uZXJUZXh0IHx8IGVsZW0udGV4dENvbnRlbnQ7XG4gIH0gZWxzZSBpZiAoY2hlY2thYmxlKSB7XG4gICAgZWxlbS52YWx1ZSA9IHRleHQ7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5pbm5lclRleHQgPSBlbGVtLnRleHRDb250ZW50ID0gdGV4dDtcbiAgfVxufTtcblxuYXBpLnZhbHVlID0gZnVuY3Rpb24gKGVsZW0sIHZhbHVlKSB7XG4gIHZhciBjaGVja2FibGUgPSB0ZXN0LmlzQ2hlY2thYmxlKGVsZW0pO1xuICB2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDI7XG4gIGlmIChnZXR0ZXIpIHtcbiAgICByZXR1cm4gY2hlY2thYmxlID8gZWxlbS5jaGVja2VkIDogZWxlbS52YWx1ZTtcbiAgfSBlbHNlIGlmIChjaGVja2FibGUpIHtcbiAgICBlbGVtLmNoZWNrZWQgPSB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLnZhbHVlID0gdmFsdWU7XG4gIH1cbn07XG5cbmFwaS5hdHRyID0gZnVuY3Rpb24gKGVsZW0sIG5hbWUsIHZhbHVlKSB7XG4gIHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMztcbiAgdmFyIGNhbWVsID0gdGV4dC5oeXBoZW5Ub0NhbWVsKG5hbWUpO1xuICBpZiAoZ2V0dGVyKSB7XG4gICAgaWYgKGNhbWVsIGluIGVsZW0pIHtcbiAgICAgIHJldHVybiBlbGVtW2NhbWVsXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgaWYgKGNhbWVsIGluIGVsZW0pIHtcbiAgICBlbGVtW2NhbWVsXSA9IHZhbHVlO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB2b2lkIDApIHtcbiAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG4gIH1cbn07XG5cbmFwaS5tYWtlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgcmV0dXJuIG5ldyBEb21pbnVzKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSkpO1xufTtcblxuYXBpLmNsb25lID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgcmV0dXJuIGVsZW0uY2xvbmVOb2RlKHRydWUpO1xufTtcblxuYXBpLnJlbW92ZSA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gIGlmIChlbGVtLnBhcmVudEVsZW1lbnQpIHtcbiAgICBlbGVtLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQoZWxlbSk7XG4gIH1cbn07XG5cbmFwaS5hcHBlbmQgPSBmdW5jdGlvbiAoZWxlbSwgdGFyZ2V0KSB7XG4gIGlmIChtYW5pcHVsYXRpb25HdWFyZChlbGVtLCB0YXJnZXQsIGFwaS5hcHBlbmQpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsZW0uYXBwZW5kQ2hpbGQodGFyZ2V0KTtcbn07XG5cbmFwaS5wcmVwZW5kID0gZnVuY3Rpb24gKGVsZW0sIHRhcmdldCkge1xuICBpZiAobWFuaXB1bGF0aW9uR3VhcmQoZWxlbSwgdGFyZ2V0LCBhcGkucHJlcGVuZCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxlbS5pbnNlcnRCZWZvcmUodGFyZ2V0LCBlbGVtLmZpcnN0Q2hpbGQpO1xufTtcblxuYXBpLmJlZm9yZSA9IGZ1bmN0aW9uIChlbGVtLCB0YXJnZXQpIHtcbiAgaWYgKG1hbmlwdWxhdGlvbkd1YXJkKGVsZW0sIHRhcmdldCwgYXBpLmJlZm9yZSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVsZW0ucGFyZW50RWxlbWVudCkge1xuICAgIGVsZW0ucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGFyZ2V0LCBlbGVtKTtcbiAgfVxufTtcblxuYXBpLmFmdGVyID0gZnVuY3Rpb24gKGVsZW0sIHRhcmdldCkge1xuICBpZiAobWFuaXB1bGF0aW9uR3VhcmQoZWxlbSwgdGFyZ2V0LCBhcGkuYWZ0ZXIpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChlbGVtLnBhcmVudEVsZW1lbnQpIHtcbiAgICBlbGVtLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhcmdldCwgZWxlbS5uZXh0U2libGluZyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIG1hbmlwdWxhdGlvbkd1YXJkIChlbGVtLCB0YXJnZXQsIGZuKSB7XG4gIHZhciByaWdodCA9IHRhcmdldCBpbnN0YW5jZW9mIERvbWludXM7XG4gIHZhciBsZWZ0ID0gZWxlbSBpbnN0YW5jZW9mIERvbWludXM7XG4gIGlmIChsZWZ0KSB7XG4gICAgZWxlbS5mb3JFYWNoKG1hbmlwdWxhdGVNYW55KTtcbiAgfSBlbHNlIGlmIChyaWdodCkge1xuICAgIG1hbmlwdWxhdGUoZWxlbSwgdHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIGxlZnQgfHwgcmlnaHQ7XG5cbiAgZnVuY3Rpb24gbWFuaXB1bGF0ZSAoZWxlbSwgcHJlY29uZGl0aW9uKSB7XG4gICAgaWYgKHJpZ2h0KSB7XG4gICAgICB0YXJnZXQuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0LCBqKSB7XG4gICAgICAgIGZuKGVsZW0sIGNsb25lVW5sZXNzKHRhcmdldCwgcHJlY29uZGl0aW9uICYmIGogPT09IDApKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbihlbGVtLCBjbG9uZVVubGVzcyh0YXJnZXQsIHByZWNvbmRpdGlvbikpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1hbmlwdWxhdGVNYW55IChlbGVtLCBpKSB7XG4gICAgbWFuaXB1bGF0ZShlbGVtLCBpID09PSAwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbG9uZVVubGVzcyAodGFyZ2V0LCBjb25kaXRpb24pIHtcbiAgcmV0dXJuIGNvbmRpdGlvbiA/IHRhcmdldCA6IGFwaS5jbG9uZSh0YXJnZXQpO1xufVxuXG5bJ2FwcGVuZFRvJywgJ3ByZXBlbmRUbycsICdiZWZvcmVPZicsICdhZnRlck9mJ10uZm9yRWFjaChmbGlwKTtcblxuZnVuY3Rpb24gZmxpcCAoa2V5KSB7XG4gIHZhciBvcmlnaW5hbCA9IGtleS5zcGxpdCgvW0EtWl0vKVswXTtcbiAgYXBpW2tleV0gPSBmdW5jdGlvbiAoZWxlbSwgdGFyZ2V0KSB7XG4gICAgYXBpW29yaWdpbmFsXSh0YXJnZXQsIGVsZW0pO1xuICB9O1xufVxuXG5hcGkuc2hvdyA9IGZ1bmN0aW9uIChlbGVtLCBzaG91bGQsIGludmVydCkge1xuICBpZiAoZWxlbSBpbnN0YW5jZW9mIERvbWludXMpIHtcbiAgICBlbGVtLmZvckVhY2goc2hvd1Rlc3QpO1xuICB9IGVsc2Uge1xuICAgIHNob3dUZXN0KGVsZW0pO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd1Rlc3QgKGN1cnJlbnQpIHtcbiAgICB2YXIgb2sgPSBzaG91bGQgPT09IHZvaWQgMCB8fCBzaG91bGQgPT09IHRydWUgfHwgdHlwZW9mIHNob3VsZCA9PT0gJ2Z1bmN0aW9uJyAmJiBzaG91bGQuY2FsbChjdXJyZW50KTtcbiAgICBkaXNwbGF5KGN1cnJlbnQsIGludmVydCA/ICFvayA6IG9rKTtcbiAgfVxufTtcblxuYXBpLmhpZGUgPSBmdW5jdGlvbiAoZWxlbSwgc2hvdWxkKSB7XG4gIGFwaS5zaG93KGVsZW0sIHNob3VsZCwgdHJ1ZSk7XG59O1xuXG5mdW5jdGlvbiBkaXNwbGF5IChlbGVtLCBzaG91bGQpIHtcbiAgaWYgKHNob3VsZCkge1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0gZWxzZSB7XG4gICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9Eb21pbnVzLnByb3RvdHlwZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYWRkRXZlbnQgPSBhZGRFdmVudEVhc3k7XG52YXIgcmVtb3ZlRXZlbnQgPSByZW1vdmVFdmVudEVhc3k7XG52YXIgaGFyZENhY2hlID0gW107XG5cbmlmICghd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgYWRkRXZlbnQgPSBhZGRFdmVudEhhcmQ7XG59XG5cbmlmICghd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgcmVtb3ZlRXZlbnQgPSByZW1vdmVFdmVudEhhcmQ7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50RWFzeSAoZWxlbWVudCwgZXZ0LCBmbikge1xuICByZXR1cm4gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2dCwgZm4pO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudEhhcmQgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgcmV0dXJuIGVsZW1lbnQuYXR0YWNoRXZlbnQoJ29uJyArIGV2dCwgd3JhcChlbGVtZW50LCBldnQsIGZuKSk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50RWFzeSAoZWxlbWVudCwgZXZ0LCBmbikge1xuICByZXR1cm4gZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZm4pO1xufVxuXG5mdW5jdGlvbiByZW1vdmVFdmVudEhhcmQgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgcmV0dXJuIGVsZW1lbnQuZGV0YWNoRXZlbnQoJ29uJyArIGV2dCwgdW53cmFwKGVsZW1lbnQsIGV2dCwgZm4pKTtcbn1cblxuZnVuY3Rpb24gd3JhcHBlckZhY3RvcnkgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZXIgKG9yaWdpbmFsRXZlbnQpIHtcbiAgICB2YXIgZSA9IG9yaWdpbmFsRXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgIGUudGFyZ2V0ID0gZS50YXJnZXQgfHwgZS5zcmNFbGVtZW50O1xuICAgIGUucHJldmVudERlZmF1bHQgID0gZS5wcmV2ZW50RGVmYXVsdCAgfHwgZnVuY3Rpb24gcHJldmVudERlZmF1bHQgKCkgeyBlLnJldHVyblZhbHVlID0gZmFsc2U7IH07XG4gICAgZS5zdG9wUHJvcGFnYXRpb24gPSBlLnN0b3BQcm9wYWdhdGlvbiB8fCBmdW5jdGlvbiBzdG9wUHJvcGFnYXRpb24gKCkgeyBlLmNhbmNlbEJ1YmJsZSA9IHRydWU7IH07XG4gICAgZm4uY2FsbChlbGVtZW50LCBlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcCAoZWxlbWVudCwgZXZ0LCBmbikge1xuICB2YXIgd3JhcHBlciA9IHVud3JhcChlbGVtZW50LCBldnQsIGZuKSB8fCB3cmFwcGVyRmFjdG9yeShlbGVtZW50LCBldnQsIGZuKTtcbiAgaGFyZENhY2hlLnB1c2goe1xuICAgIHdyYXBwZXI6IHdyYXBwZXIsXG4gICAgZWxlbWVudDogZWxlbWVudCxcbiAgICBldnQ6IGV2dCxcbiAgICBmbjogZm5cbiAgfSk7XG4gIHJldHVybiB3cmFwcGVyO1xufVxuXG5mdW5jdGlvbiB1bndyYXAgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgdmFyIGkgPSBmaW5kKGVsZW1lbnQsIGV2dCwgZm4pO1xuICBpZiAoaSkge1xuICAgIHZhciB3cmFwcGVyID0gaGFyZENhY2hlW2ldLndyYXBwZXI7XG4gICAgaGFyZENhY2hlLnNwbGljZShpLCAxKTsgLy8gZnJlZSB1cCBhIHRhZCBvZiBtZW1vcnlcbiAgICByZXR1cm4gd3JhcHBlcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kIChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHZhciBpLCBpdGVtO1xuICBmb3IgKGkgPSAwOyBpIDwgaGFyZENhY2hlLmxlbmd0aDsgaSsrKSB7XG4gICAgaXRlbSA9IGhhcmRDYWNoZVtpXTtcbiAgICBpZiAoaXRlbS5lbGVtZW50ID09PSBlbGVtZW50ICYmIGl0ZW0uZXZ0ID09PSBldnQgJiYgaXRlbS5mbiA9PT0gZm4pIHtcbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkOiBhZGRFdmVudCxcbiAgcmVtb3ZlOiByZW1vdmVFdmVudFxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGRvbSA9IHJlcXVpcmUoJy4vZG9tJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vY29yZScpO1xudmFyIERvbWludXMgPSByZXF1aXJlKCcuL0RvbWludXMuY3RvcicpO1xudmFyIHRhZyA9IC9eXFxzKjwoW2Etel0rKD86LVthLXpdKyk/KVxccypcXC8/PlxccyokL2k7XG5cbmZ1bmN0aW9uIGFwaSAoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgdmFyIG5vdFRleHQgPSB0eXBlb2Ygc2VsZWN0b3IgIT09ICdzdHJpbmcnO1xuICBpZiAobm90VGV4dCAmJiBhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgIHJldHVybiBjb3JlLmNhc3Qoc2VsZWN0b3IpO1xuICB9XG4gIGlmIChub3RUZXh0KSB7XG4gICAgcmV0dXJuIG5ldyBEb21pbnVzKCk7XG4gIH1cbiAgdmFyIG1hdGNoZXMgPSBzZWxlY3Rvci5tYXRjaCh0YWcpO1xuICBpZiAobWF0Y2hlcykge1xuICAgIHJldHVybiBkb20ubWFrZShtYXRjaGVzWzFdKTtcbiAgfVxuICByZXR1cm4gYXBpLmZpbmQoc2VsZWN0b3IsIGNvbnRleHQpO1xufVxuXG5hcGkuZmluZCA9IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICByZXR1cm4gZG9tLnFzYShjb250ZXh0LCBzZWxlY3Rvcik7XG59O1xuXG5hcGkuZmluZE9uZSA9IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICByZXR1cm4gZG9tLnFzKGNvbnRleHQsIHNlbGVjdG9yKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXBpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgbm9kZU9iamVjdHMgPSB0eXBlb2YgTm9kZSA9PT0gJ29iamVjdCc7XG52YXIgZWxlbWVudE9iamVjdHMgPSB0eXBlb2YgSFRNTEVsZW1lbnQgPT09ICdvYmplY3QnO1xuXG5mdW5jdGlvbiBpc05vZGUgKG8pIHtcbiAgcmV0dXJuIG5vZGVPYmplY3RzID8gbyBpbnN0YW5jZW9mIE5vZGUgOiBpc05vZGVPYmplY3Qobyk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZU9iamVjdCAobykge1xuICByZXR1cm4gbyAmJlxuICAgIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJlxuICAgIHR5cGVvZiBvLm5vZGVOYW1lID09PSAnc3RyaW5nJyAmJlxuICAgIHR5cGVvZiBvLm5vZGVUeXBlID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50IChvKSB7XG4gIHJldHVybiBlbGVtZW50T2JqZWN0cyA/IG8gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA6IGlzRWxlbWVudE9iamVjdChvKTtcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50T2JqZWN0IChvKSB7XG4gIHJldHVybiBvICYmXG4gICAgdHlwZW9mIG8gPT09ICdvYmplY3QnICYmXG4gICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgby5ub2RlVHlwZSA9PT0gMTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoYSkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5mdW5jdGlvbiBpc0NoZWNrYWJsZSAoZWxlbSkge1xuICByZXR1cm4gJ2NoZWNrZWQnIGluIGVsZW0gJiYgZWxlbS50eXBlID09PSAncmFkaW8nIHx8IGVsZW0udHlwZSA9PT0gJ2NoZWNrYm94Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlzTm9kZTogaXNOb2RlLFxuICBpc0VsZW1lbnQ6IGlzRWxlbWVudCxcbiAgaXNBcnJheTogaXNBcnJheSxcbiAgaXNDaGVja2FibGU6IGlzQ2hlY2thYmxlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBoeXBoZW5Ub0NhbWVsIChoeXBoZW5zKSB7XG4gIHZhciBwYXJ0ID0gLy0oW2Etel0pL2c7XG4gIHJldHVybiBoeXBoZW5zLnJlcGxhY2UocGFydCwgZnVuY3Rpb24gKGcsIG0pIHtcbiAgICByZXR1cm4gbS50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGh5cGhlblRvQ2FtZWw6IGh5cGhlblRvQ2FtZWxcbn07XG4iLCIvKipcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgbW9kZXJuIGV4cG9ydHM9XCJucG1cIiAtbyAuL25wbS9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGRlYm91bmNlID0gcmVxdWlyZSgnbG9kYXNoLmRlYm91bmNlJyksXG4gICAgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC5pc2Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCdsb2Rhc2guaXNvYmplY3QnKTtcblxuLyoqIFVzZWQgYXMgYW4gaW50ZXJuYWwgYF8uZGVib3VuY2VgIG9wdGlvbnMgb2JqZWN0ICovXG52YXIgZGVib3VuY2VPcHRpb25zID0ge1xuICAnbGVhZGluZyc6IGZhbHNlLFxuICAnbWF4V2FpdCc6IDAsXG4gICd0cmFpbGluZyc6IGZhbHNlXG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGV4ZWN1dGVkLCB3aWxsIG9ubHkgY2FsbCB0aGUgYGZ1bmNgIGZ1bmN0aW9uXG4gKiBhdCBtb3N0IG9uY2UgcGVyIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFByb3ZpZGUgYW4gb3B0aW9ucyBvYmplY3QgdG9cbiAqIGluZGljYXRlIHRoYXQgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlXG4gKiBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsXG4gKiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgY2FsbC5cbiAqXG4gKiBOb3RlOiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgIGBmdW5jYCB3aWxsIGJlIGNhbGxlZFxuICogb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhlIHRocm90dGxlZCBmdW5jdGlvbiBpc1xuICogaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB0aHJvdHRsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB3YWl0IFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGV4ZWN1dGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gYXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZ1xuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCk7XG4gKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgdGhyb3R0bGVkKTtcbiAqXG4gKiAvLyBleGVjdXRlIGByZW5ld1Rva2VuYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgYnV0IG5vdCBtb3JlIHRoYW4gb25jZSBldmVyeSA1IG1pbnV0ZXNcbiAqIGpRdWVyeSgnLmludGVyYWN0aXZlJykub24oJ2NsaWNrJywgXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHtcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcjtcbiAgfVxuICBpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICBsZWFkaW5nID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG4gIGRlYm91bmNlT3B0aW9ucy5sZWFkaW5nID0gbGVhZGluZztcbiAgZGVib3VuY2VPcHRpb25zLm1heFdhaXQgPSB3YWl0O1xuICBkZWJvdW5jZU9wdGlvbnMudHJhaWxpbmcgPSB0cmFpbGluZztcblxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwgZGVib3VuY2VPcHRpb25zKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcbiIsIi8qKlxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBtb2Rlcm4gZXhwb3J0cz1cIm5wbVwiIC1vIC4vbnBtL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvZGFzaC5pc2Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCdsb2Rhc2guaXNvYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCdsb2Rhc2gubm93Jyk7XG5cbi8qIE5hdGl2ZSBtZXRob2Qgc2hvcnRjdXRzIGZvciBtZXRob2RzIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBkZWxheSB0aGUgZXhlY3V0aW9uIG9mIGBmdW5jYCB1bnRpbCBhZnRlclxuICogYHdhaXRgIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSBpdCB3YXMgaW52b2tlZC5cbiAqIFByb3ZpZGUgYW4gb3B0aW9ucyBvYmplY3QgdG8gaW5kaWNhdGUgdGhhdCBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb25cbiAqIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gU3Vic2VxdWVudCBjYWxsc1xuICogdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBjYWxsLlxuICpcbiAqIE5vdGU6IElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAgYGZ1bmNgIHdpbGwgYmUgY2FsbGVkXG4gKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIGlzXG4gKiBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IHdhaXQgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV0gU3BlY2lmeSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XSBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgY2FsbGVkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gYXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eFxuICogdmFyIGxhenlMYXlvdXQgPSBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKTtcbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBsYXp5TGF5b3V0KTtcbiAqXG4gKiAvLyBleGVjdXRlIGBzZW5kTWFpbGAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxsc1xuICogalF1ZXJ5KCcjcG9zdGJveCcpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KTtcbiAqXG4gKiAvLyBlbnN1cmUgYGJhdGNoTG9nYCBpcyBleGVjdXRlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxsc1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogc291cmNlLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHtcbiAqICAgJ21heFdhaXQnOiAxMDAwXG4gKiB9LCBmYWxzZSk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGFyZ3MsXG4gICAgICBtYXhUaW1lb3V0SWQsXG4gICAgICByZXN1bHQsXG4gICAgICBzdGFtcCxcbiAgICAgIHRoaXNBcmcsXG4gICAgICB0aW1lb3V0SWQsXG4gICAgICB0cmFpbGluZ0NhbGwsXG4gICAgICBsYXN0Q2FsbGVkID0gMCxcbiAgICAgIG1heFdhaXQgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICB9XG4gIHdhaXQgPSBuYXRpdmVNYXgoMCwgd2FpdCkgfHwgMDtcbiAgaWYgKG9wdGlvbnMgPT09IHRydWUpIHtcbiAgICB2YXIgbGVhZGluZyA9IHRydWU7XG4gICAgdHJhaWxpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSBvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4V2FpdCA9ICdtYXhXYWl0JyBpbiBvcHRpb25zICYmIChuYXRpdmVNYXgod2FpdCwgb3B0aW9ucy5tYXhXYWl0KSB8fCAwKTtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/IG9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICB2YXIgZGVsYXllZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdygpIC0gc3RhbXApO1xuICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQobWF4VGltZW91dElkKTtcbiAgICAgIH1cbiAgICAgIHZhciBpc0NhbGxlZCA9IHRyYWlsaW5nQ2FsbDtcbiAgICAgIG1heFRpbWVvdXRJZCA9IHRpbWVvdXRJZCA9IHRyYWlsaW5nQ2FsbCA9IHVuZGVmaW5lZDtcbiAgICAgIGlmIChpc0NhbGxlZCkge1xuICAgICAgICBsYXN0Q2FsbGVkID0gbm93KCk7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICBhcmdzID0gdGhpc0FyZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChkZWxheWVkLCByZW1haW5pbmcpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgbWF4RGVsYXllZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH1cbiAgICBtYXhUaW1lb3V0SWQgPSB0aW1lb3V0SWQgPSB0cmFpbGluZ0NhbGwgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHRyYWlsaW5nIHx8IChtYXhXYWl0ICE9PSB3YWl0KSkge1xuICAgICAgbGFzdENhbGxlZCA9IG5vdygpO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgYXJncyA9IHRoaXNBcmcgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICBzdGFtcCA9IG5vdygpO1xuICAgIHRoaXNBcmcgPSB0aGlzO1xuICAgIHRyYWlsaW5nQ2FsbCA9IHRyYWlsaW5nICYmICh0aW1lb3V0SWQgfHwgIWxlYWRpbmcpO1xuXG4gICAgaWYgKG1heFdhaXQgPT09IGZhbHNlKSB7XG4gICAgICB2YXIgbGVhZGluZ0NhbGwgPSBsZWFkaW5nICYmICF0aW1lb3V0SWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbWF4VGltZW91dElkICYmICFsZWFkaW5nKSB7XG4gICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgIH1cbiAgICAgIHZhciByZW1haW5pbmcgPSBtYXhXYWl0IC0gKHN0YW1wIC0gbGFzdENhbGxlZCksXG4gICAgICAgICAgaXNDYWxsZWQgPSByZW1haW5pbmcgPD0gMDtcblxuICAgICAgaWYgKGlzQ2FsbGVkKSB7XG4gICAgICAgIGlmIChtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgICBtYXhUaW1lb3V0SWQgPSBjbGVhclRpbWVvdXQobWF4VGltZW91dElkKTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghbWF4VGltZW91dElkKSB7XG4gICAgICAgIG1heFRpbWVvdXRJZCA9IHNldFRpbWVvdXQobWF4RGVsYXllZCwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzQ2FsbGVkICYmIHRpbWVvdXRJZCkge1xuICAgICAgdGltZW91dElkID0gY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aW1lb3V0SWQgJiYgd2FpdCAhPT0gbWF4V2FpdCkge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChkZWxheWVkLCB3YWl0KTtcbiAgICB9XG4gICAgaWYgKGxlYWRpbmdDYWxsKSB7XG4gICAgICBpc0NhbGxlZCA9IHRydWU7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIH1cbiAgICBpZiAoaXNDYWxsZWQgJiYgIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICBhcmdzID0gdGhpc0FyZyA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKipcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgbW9kZXJuIGV4cG9ydHM9XCJucG1cIiAtbyAuL25wbS9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzTmF0aXZlID0gcmVxdWlyZSgnbG9kYXNoLl9pc25hdGl2ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIFVuaXggZXBvY2hcbiAqICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0aWVzXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBzdGFtcCA9IF8ubm93KCk7XG4gKiBfLmRlZmVyKGZ1bmN0aW9uKCkgeyBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApOyB9KTtcbiAqIC8vID0+IGxvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZFxuICovXG52YXIgbm93ID0gaXNOYXRpdmUobm93ID0gRGF0ZS5ub3cpICYmIG5vdyB8fCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG4iLCIvKipcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgbW9kZXJuIGV4cG9ydHM9XCJucG1cIiAtbyAuL25wbS9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBpbnRlcm5hbCBbW0NsYXNzXV0gb2YgdmFsdWVzICovXG52YXIgdG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZSAqL1xudmFyIHJlTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIFN0cmluZyh0b1N0cmluZylcbiAgICAucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKVxuICAgIC5yZXBsYWNlKC90b1N0cmluZ3wgZm9yIFteXFxdXSsvZywgJy4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgJiYgcmVOYXRpdmUudGVzdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOYXRpdmU7XG4iLCIvKipcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgbW9kZXJuIGV4cG9ydHM9XCJucG1cIiAtbyAuL25wbS9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDEzIFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjUuMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTMgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cDovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RzXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbic7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKlxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBtb2Rlcm4gZXhwb3J0cz1cIm5wbVwiIC1vIC4vbnBtL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgb2JqZWN0VHlwZXMgPSByZXF1aXJlKCdsb2Rhc2guX29iamVjdHR5cGVzJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIGxhbmd1YWdlIHR5cGUgb2YgT2JqZWN0LlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RzXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBjaGVjayBpZiB0aGUgdmFsdWUgaXMgdGhlIEVDTUFTY3JpcHQgbGFuZ3VhZ2UgdHlwZSBvZiBPYmplY3RcbiAgLy8gaHR0cDovL2VzNS5naXRodWIuaW8vI3g4XG4gIC8vIGFuZCBhdm9pZCBhIFY4IGJ1Z1xuICAvLyBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxXG4gIHJldHVybiAhISh2YWx1ZSAmJiBvYmplY3RUeXBlc1t0eXBlb2YgdmFsdWVdKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBtb2Rlcm4gZXhwb3J0cz1cIm5wbVwiIC1vIC4vbnBtL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIHRvIGRldGVybWluZSBpZiB2YWx1ZXMgYXJlIG9mIHRoZSBsYW5ndWFnZSB0eXBlIE9iamVjdCAqL1xudmFyIG9iamVjdFR5cGVzID0ge1xuICAnYm9vbGVhbic6IGZhbHNlLFxuICAnZnVuY3Rpb24nOiB0cnVlLFxuICAnb2JqZWN0JzogdHJ1ZSxcbiAgJ251bWJlcic6IGZhbHNlLFxuICAnc3RyaW5nJzogZmFsc2UsXG4gICd1bmRlZmluZWQnOiBmYWxzZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUeXBlcztcbiIsInZhciAkID0gcmVxdWlyZSgnZG9taW51cycpO1xudmFyIGluY3ViYXRlID0gcmVxdWlyZSgnLi9pbmN1YmF0ZScpO1xudmFyIG5wY3MgPSByZXF1aXJlKCcuL25wY3MnKTtcbnZhciBtb2IgPSByZXF1aXJlKCcuL21vYicpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcbnZhciBiYWJvb24gPSByZXF1aXJlKCcuL2FpL2JhYm9vbicpO1xuXG5mdW5jdGlvbiBucGMgKGVuZW15LCBvcHRpb25zKSB7XG4gIHZhciBvID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIGxldmVsID0gby5sZXZlbCB8fCAwO1xuICB2YXIgbm9kZSA9IGluY3ViYXRlKCk7XG4gIHZhciBtID0gbW9iKG5vZGUsIHsgbGV2ZWw6IGxldmVsLCB0eXBlOiAnbnBjJyB9KTtcbiAgdmFyIG1lID0ge1xuICAgIG5vZGU6IG5vZGUsXG4gICAgbW9iOiBtXG4gIH07XG4gIHZhciBsYXJnZXN0TGV2ZWwgPSBsZXZlbDtcbiAgdmFyIG1ldHJpY3MgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCducGMtbWV0cmljcycpO1xuICB2YXIgbGlmZWJhciA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25wYy1saWZlJykuYXBwZW5kVG8obWV0cmljcyk7XG4gIG5vZGUuZmluZCgnLnBjLWN1YmUnKS5hZGRDbGFzcygncGMtc21vb3RoIHBjLXNob3cnKTtcbiAgbm9kZS5hcHBlbmQobWV0cmljcyk7XG4gIG0ubnBjID0gbWU7XG4gIG0ucGxhY2VtZW50KCk7XG5cbiAgZW1pdHRlci5vbignbW9iLnJlbW92ZScsIGZ1bmN0aW9uICh3aG8pIHtcbiAgICBpZiAod2hvID09PSBtKSB7XG4gICAgICBucGNzLnNwbGljZShucGNzLmluZGV4T2YobWUpLCAxKTtcbiAgICAgIGlmIChtLmNsZWFyICE9PSB0cnVlKSB7XG4gICAgICAgIGVtaXR0ZXIuZW1pdCgnbnBjLmtpbGwnLCBucGNzLmxlbmd0aCA9PT0gMCwgbS5sZXZlbCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAoby5haSB8fCBiYWJvb24pKG1lLCBlbmVteSk7XG4gIG5wY3MucHVzaChtZSk7XG5cbiAgcmV0dXJuIG1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5wYztcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBucGNzID0gW107XG5cbmZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgdmFyIG5wYztcbiAgd2hpbGUgKChucGMgPSBucGNzLnNoaWZ0KCkpKSB7XG4gICAgbnBjLm1vYi5jbGVhciA9IHRydWU7XG4gICAgbnBjLm1vYi5yZW1vdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB0aWNrICgpIHtcbiAgbnBjcy5mb3JFYWNoKGZ1bmN0aW9uIChucGMpIHtcbiAgICBucGMudGhpbmsoKTtcbiAgfSk7XG59XG5cbm5wY3MuY2xlYXIgPSBjbGVhcjtcbm5wY3MudGljayA9IHRpY2s7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLmN1YmUubnBjID0gbnBjcztcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBpbmN1YmF0ZSA9IHJlcXVpcmUoJy4vaW5jdWJhdGUnKTtcbnZhciBwb3dzID0gcmVxdWlyZSgnLi9wb3dlcnVwcycpO1xudmFyIG1vYiA9IHJlcXVpcmUoJy4vbW9iJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xudmFyIGxpZmVzYXZlciA9IHJlcXVpcmUoJy4vcG93ZXJ1cHMvbGlmZXNhdmVyJyk7XG5cbmZ1bmN0aW9uIHBvdyAocGxheWVyLCBvcHRpb25zKSB7XG4gIHZhciBvID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIGxldmVsID0gby5sZXZlbCB8fCAwO1xuICB2YXIgbm9kZSA9IGluY3ViYXRlKCk7XG4gIHZhciBtID0gbW9iKG5vZGUsIHsgbGV2ZWw6IGxldmVsLCB0eXBlOiAncG93JyB9KTtcbiAgdmFyIG1lID0ge1xuICAgIG5vZGU6IG5vZGUsXG4gICAgbW9iOiBtXG4gIH07XG4gIHZhciBlZmZlY3QgPSBvLmVmZmVjdCB8fCBsaWZlc2F2ZXIoMSk7XG4gIG5vZGUuZmluZCgnLnBjLWN1YmUnKS5hZGRDbGFzcygncGMtc21vb3RoIHBjLXNob3cnKTtcbiAgbS5wb3cgPSBtZTtcbiAgbS5wbGFjZW1lbnQoKTtcblxuICBlbWl0dGVyLm9uKCdtb2IucmVtb3ZlJywgZnVuY3Rpb24gKHdobykge1xuICAgIGlmICh3aG8gPT09IG0pIHtcbiAgICAgIHBvd3Muc3BsaWNlKHBvd3MuaW5kZXhPZihtZSksIDEpO1xuICAgICAgaWYgKG1lLmNsZWFudXAgIT09IHRydWUpIHtcbiAgICAgICAgZWZmZWN0KHBsYXllciwgbWUpO1xuICAgICAgICBlbWl0dGVyLmVtaXQoJ3Bvdy51c2UnLCBtLmxldmVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHdvcmR1cCAoZmFjZSkge1xuICAgIGZhY2UuaW5uZXJUZXh0ID0gZWZmZWN0LndvcmRzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGVmZmVjdC53b3Jkcy5sZW5ndGgpXTtcbiAgfVxuXG4gIG5vZGUuZmluZCgnLnBjLWZhY2UnKS5mb3JFYWNoKHdvcmR1cCk7XG4gIHBvd3MucHVzaChtZSk7XG5cbiAgcmV0dXJuIG1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvdztcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwb3dlcnVwcyA9IFtdO1xuXG5mdW5jdGlvbiBjbGVhciAoKSB7XG4gIHZhciBwb3c7XG4gIHdoaWxlICgocG93ID0gcG93ZXJ1cHMuc2hpZnQoKSkpIHtcbiAgICBwb3cuY2xlYW51cCA9IHRydWU7XG4gICAgcG93Lm5vZGUucmVtb3ZlKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuY3ViZS5wb3dlcnVwID0gcG93ZXJ1cHM7XG5cbnBvd2VydXBzLmNsZWFyID0gY2xlYXI7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG52YXIgbnBjcyA9IHJlcXVpcmUoJy4uL25wY3MnKTtcbnZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgYnVsbGV0ID0gcmVxdWlyZSgnLi4vYnVsbGV0Jyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjaGFvc2JyaW5nZXIgKGxldmVsKSB7XG4gIGZ1bmN0aW9uIGVmZmVjdCAocGxheWVyLCBwb3cpIHtcbiAgICBmaXJlKDAsIC0xKTtcbiAgICBmaXJlKDAsIDEpO1xuICAgIGZpcmUoMSwgMSk7XG4gICAgZmlyZSgxLCAwKTtcbiAgICBmaXJlKDEsIC0xKTtcbiAgICBmaXJlKC0xLCAtMSk7XG4gICAgZmlyZSgtMSwgMSk7XG4gICAgZmlyZSgtMSwgMCk7XG4gIH1cblxuICBmdW5jdGlvbiBmaXJlICh4LCB5KSB7XG4gICAgYnVsbGV0KHBsYXllciwgeyBsZXZlbDogbGV2ZWwsIGRpeTogeyBkeDogeCwgZHk6IHkgfSB9KTtcbiAgfVxuXG4gIGVmZmVjdC53b3JkcyA9IFsnQlVMTEVUUkFJTiEnLCAnVFJBSU4gT0YgQlVMTEVUUy4nLCAnWUVTIScsICdCRUFTVExZJywgJ01BSkVTVFVPVVMhJywgJ0RJRSBESUUgRElFJ107XG5cbiAgcmV0dXJuIGVmZmVjdDtcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcbnZhciBucGNzID0gcmVxdWlyZSgnLi4vbnBjcycpO1xudmFyIG5wYyA9IHJlcXVpcmUoJy4uL25wYycpO1xudmFyIGFpbWVyID0gcmVxdWlyZSgnLi4vYWkvYWltZXInKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNoYW9zYnJpbmdlciAobGV2ZWwpIHtcbiAgZnVuY3Rpb24gZWZmZWN0IChwbGF5ZXIsIHBvdykge1xuICAgIHZhciBjb3VudCA9IE1hdGgubWluKGxldmVsLCA0KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgbnBjKHBsYXllciwgeyBhaTogYWltZXIsIGxldmVsOiBNYXRoLmZsb29yKE1hdGgubWF4KDEsIGkgLyAyKSkgfSk7XG4gICAgfVxuICAgIGlmICgtLWxldmVsID4gMCkge1xuICAgICAgcG93ZXJ1cChwbGF5ZXIsIHsgZWZmZWN0OiBjaGFvc2JyaW5nZXIobGV2ZWwpIH0pO1xuICAgIH1cbiAgfVxuXG4gIGVmZmVjdC53b3JkcyA9IFsnRklFUlkgREVBVEghJywgJ0FOR1JZIFRISU5HUy4nLCAnT0ggTk8nLCAnQ0hBT1MgQlJJTkdFUicsICdhbmdyeSBraWxsIScsICdkZWF0aCBpcyBpbmV2aXRhYmxlJ107XG5cbiAgcmV0dXJuIGVmZmVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXZlcykge1xuICBmdW5jdGlvbiBlZmZlY3QgKHBsYXllciwgcG93KSB7XG4gICAgcGxheWVyLmFkZExldmVsKGxpdmVzKTtcbiAgfVxuXG4gIGVmZmVjdC53b3JkcyA9IFsnTElGRSEnLCAnU2F2ZXIuJ107XG5cbiAgcmV0dXJuIGVmZmVjdDtcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcbnZhciBucGNzID0gcmVxdWlyZSgnLi4vbnBjcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICBmdW5jdGlvbiBlZmZlY3QgKHBsYXllciwgcG93KSB7XG4gICAgdmFyIG5wYztcblxuICAgIGJvZHkuYWRkQ2xhc3MoJ3JhaW5zdG9ybScpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgYm9keS5yZW1vdmVDbGFzcygncmFpbnN0b3JtJyk7XG4gICAgfSwgMzAwKTtcblxuICAgIHdoaWxlIChsZXZlbC0tICYmIG5wY3MubGVuZ3RoKSB7XG4gICAgICBucGMgPSBucGNzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGVmZmVjdC53b3Jkcy5sZW5ndGgpXTtcbiAgICAgIGlmIChucGMpIHtcbiAgICAgICAgc2V0VGltZW91dChkYW1hZ2UsIE1hdGgucmFuZG9tKCkgKiAzMDApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uICBkYW1hZ2UgKCkge1xuICAgICAgbnBjLm1vYi5kYW1hZ2UobGV2ZWwpO1xuICAgIH1cblxuICAgIG5wY3MuZm9yRWFjaChmdW5jdGlvbiAobnBjLCBpKSB7XG4gICAgICBpZiAoaSA8IGxldmVsKSB7XG4gICAgICAgIG5wYy5tb2IuZGFtYWdlKGxldmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGVmZmVjdC53b3JkcyA9IFsnU1RPUk0hJywgJ1Nob3dlci4nLCAnREVBVEgnLCAnTWF5aGVtJywgJ1dPT08hJywgJ0tJTEwgXFwnRU0gQUxMJ107XG5cbiAgcmV0dXJuIGVmZmVjdDtcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciB1cyA9IHJlcXVpcmUoJy4vdXMnKTtcbnZhciBlbWl0dGVyID0gcmVxdWlyZSgnLi9lbWl0dGVyJyk7XG52YXIgbGV2ZWwgPSAkKCcuc2MtbGV2ZWwnKTtcbnZhciBwb2ludHMgPSAkKCcuc2MtcG9pbnRzJyk7XG52YXIgbGl2ZXMgPSAkKCcuc2MtbGl2ZXMnKTtcbnZhciBzY29yZSA9IDA7XG52YXIgZ2FtZUxldmVsID0gMDtcbnZhciBwbGF5ZXI7XG5cbmVtaXR0ZXIub24oJ3BsYXllci5zdGFydCcsIGZ1bmN0aW9uIChwKSB7XG4gIHBsYXllciA9IHA7XG59KTtcblxuZW1pdHRlci5vbignbnBjLmtpbGwnLCBmdW5jdGlvbiAoY2xlYXIsIGxldmVsKSB7XG4gIGFkZChNYXRoLmZsb29yKCsrbGV2ZWwgKiAxLjUpKTtcbn0pO1xuXG5lbWl0dGVyLm9uKCdwb3cudXNlJywgZnVuY3Rpb24gKGxldmVsKSB7XG4gIGFkZCgrK2xldmVsKTtcbn0pO1xuXG5lbWl0dGVyLm9uKCdwbGF5ZXIuZGVhdGgnLCBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgYWRkKC11cy5tbShnYW1lTGV2ZWwgKiA1LCBnYW1lTGV2ZWwgKiAyKSk7XG59KTtcblxuZW1pdHRlci5vbignbGV2ZWxzLmNoYW5nZScsIGZ1bmN0aW9uIChsZXZlbCkge1xuICBnYW1lTGV2ZWwgPSBsZXZlbCArIDE7XG4gIGFkZCh1cy5tbShnYW1lTGV2ZWwsIGdhbWVMZXZlbCAqIDIpKTtcbn0pO1xuXG5mdW5jdGlvbiByZXNldCAoKSB7XG4gIHNjb3JlID0gMDtcbiAgdXBkYXRlKCk7XG59XG5cbmZ1bmN0aW9uIGFkZCAocG9pbnRzKSB7XG4gIHNjb3JlICs9IHBvaW50cztcbiAgdXBkYXRlKCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gIGxldmVsLnRleHQoZ2FtZUxldmVsKTtcbiAgbGl2ZXMudGV4dChwbGF5ZXIubGV2ZWwgKyAxKTtcbiAgcG9pbnRzLnRleHQoc2NvcmUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVzZXQ6IHJlc2V0LFxuICBhZGQ6IGFkZCxcbiAgdXBkYXRlOiB1cGRhdGVcbn07XG4iLCJmdW5jdGlvbiBwYyAodiwgcikgeyByZXR1cm4gcChyIC8gMTAwICogdik7IH1cbmZ1bmN0aW9uIHUgKG0pIHsgcmV0dXJuIGEgPSBwYXJzZUludChtLnJlcGxhY2UoJ3B4JywgJycpLCAxMCksIGlzTmFOKGEpID8gMCA6IGE7IH1cbmZ1bmN0aW9uIHAgKHYpIHsgcmV0dXJuIHYgKyAncHgnOyB9XG5mdW5jdGlvbiBtbSAobWluLCBtYXgpIHsgcmV0dXJuIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW4pOyB9XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYzogcGMsXG4gIHU6IHUsXG4gIHA6IHAsXG4gIG1tOiBtbVxufTtcbiJdfQ==
