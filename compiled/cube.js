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
var audio = require('../audio');

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
    audio.play('npc-think');
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

},{"../audio":8,"../bullet":9,"lodash.throttle":43}],3:[function(require,module,exports){
var throttle = require('lodash.throttle');
var audio = require('../audio');

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
    audio.play('npc-think');
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

},{"../audio":8,"lodash.throttle":43}],4:[function(require,module,exports){
var throttle = require('lodash.throttle');
var bullet = require('../bullet');
var audio = require('../audio');

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
    audio.play('npc-think');
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

},{"../audio":8,"../bullet":9,"lodash.throttle":43}],5:[function(require,module,exports){
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

},{"../bullet":9,"lodash.throttle":43}],6:[function(require,module,exports){
var throttle = require('lodash.throttle');
var bullet = require('../bullet');
var audio = require('../audio');

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
    audio.play('npc-think');
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

},{"../audio":8,"../bullet":9,"lodash.throttle":43}],7:[function(require,module,exports){
var throttle = require('lodash.throttle');
var bulletrain = require('../powerups/bulletrain');
var audio = require('../audio');

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
    audio.play('npc-think');
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
      bulletrain(Math.floor(Math.max(1, mob.level * 0.5)))(mob);
      lastShooting = Date.now();
    }
  }

  redirect();
  npc.think = think;
};

},{"../audio":8,"../powerups/bulletrain":54,"lodash.throttle":43}],8:[function(require,module,exports){
var throttle = require('lodash.throttle');
var audio = {
  play: play,
  muted: false
};
var throttled = {};

t('npc-think', 8500);

function t (file, freq) {
  throttled[file] = throttle(play.bind(null, file), freq);
}

function play (file) {console.log(file);
  if (throttled[file]) {
    throttled[file](); return;
  }
  if (audio.muted === false) {
    new Audio('audio/' + file + '.wav').autoplay = true;
  }
}

module.exports = audio;

},{"lodash.throttle":43}],9:[function(require,module,exports){
var $ = require('dominus');
var audio = require('./audio');
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

  function sound () {
    if (o.audio !== false) {
      audio.play('bullet-' + Math.max(level, 5));
    }
  }

  emitter.on('mob.remove', function rm (who) {
    if (who === m) {
      bullets.splice(bullets.indexOf(me), 1);
      emitter.off('mob.remove', rm);
    }
  });

  function remove () {
    m.remove();
  }

  setTimeout(smooth, 0);
  setTimeout(sound, 50);
  setTimeout(remove, 2400);

  bullets.push(me);

  return me;
}


module.exports = bullet;

},{"./audio":8,"./bullets":10,"./emitter":12,"./incubate":15,"./mob":26,"./us":59,"dominus":38}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
var enchantments = require('./enchantments');
var bulletrain = require('./powerups/bulletrain');
var audio = require('./audio');
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
var M = 77;
var C = 67;

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
  if (e.which === M) { // mute sounds
    audio.muted = !audio.muted;
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

function addRain (c) {
  this.rain += c || 1;
  emitter.emit('player.rain', this.rain);
}

function rmRain (c) {
  this.rain -= c || 1;
  emitter.emit('player.rain', this.rain);
}

function start () {
  keys = {};
  audio.play('begin');
  incubateCube();
  you = mob(yourCube, { type: 'you', level: 1 });
  you.rain = 0;
  global.cube.you = you;
  emitter.emit('player.start', you);
  emitter.on('mob.leveldown', leveldown);
  emitter.on('levels.win', won);
  you.rmRain = rmRain.bind(you);
  you.addRain = addRain.bind(you);
  you.addRain(2);
  yourCubeInternal.addClass('pc-show');
  body.off('click', welcome);
  body.off('keydown', welcoming);
  body.on('keydown', kd);
  body.on('keyup', ku);
  levels(you);
  gameloop();
}

function leveldown (m, level) {
  if (m === you) {
    emitter.emit('player.death', level);
    audio.play('you-die');
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
  enchantments.tick();
  var cd = you.cd();
  var cdNoPows = cd.filter(noPows);
  cd.filter(onlyPows).forEach(usePow);
  if (you.kia || cdNoPows.length) {
    cdNoPows.forEach(function (m) {
      you.damage(m.level);
    });
    if (you.kia) {
      audio.play('you-die');
      gameover('YOU\'RE VERY MUCH DEAD WOW~!'); return;
    }
  }
  if (keys[C] && you.rain > 0) {
    keys[C] = false; // save precious rain!
    you.rmRain();
    bulletrain(you.level)(you);
  } else if (u) {
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
  keys = {};
  enchantments.set();
  body.off('keyup', ku);
  body.off('keydown', kd);
  emitter.off('mob.leveldown', leveldown);
  emitter.off('levels.win', won);
  npcs.clear();
  pows.clear();
  mobs.splice(0, mobs.length);
  if (yourCubeInternal) { yourCubeInternal.removeClass('pc-show'); }
  if (yourCube) { yourCube.remove(); }
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
},{"./audio":8,"./bullets":10,"./emitter":12,"./enchantments":13,"./incubate":15,"./levels":25,"./mob":26,"./mobs":27,"./npc":50,"./npcs":51,"./powerups":53,"./powerups/bulletrain":54,"dominus":38}],12:[function(require,module,exports){
var emitter = require('contra.emitter');

module.exports = emitter();

},{"contra.emitter":28}],13:[function(require,module,exports){
var enchantments;

function set (v) {
  enchantments = v || [];
}

function tick () {
  enchantments.forEach(function (enchantment) {
    enchantment();
  });
}

module.exports = {
  tick: tick,
  set: set
};

},{}],14:[function(require,module,exports){
var throttle = require('lodash.throttle');
var npcs = require('../npcs');
var us = require('../us');

module.exports = function (level) {
  var freq = Math.max(12000 / (level + 1), 1000);

  return throttle(function () {
    var n = us.r(npcs);
    if (n) {
      n.mob.addLevel(1, level);
    }
  }, freq);
};

},{"../npcs":51,"../us":59,"lodash.throttle":43}],15:[function(require,module,exports){
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

},{"dominus":38}],16:[function(require,module,exports){
var npc = require('../npc');
var powerup = require('../powerup');

module.exports = function (you) {
  npc(you).node.addClass('npc-disc');
  powerup(you);
};

var growatog = require('../enchantments/growatog');

module.exports.enchantments = [
  growatog(1)
];

},{"../enchantments/growatog":14,"../npc":50,"../powerup":52}],17:[function(require,module,exports){
var npc = require('../npc');
var rookie = require('../ai/rookie');
var unescapable = require('../ai/unescapable');
var powerup = require('../powerup');
var bulletrain = require('../powerups/bulletrain');

module.exports = function (you) {
  npc(you, { ai: rookie }).node.addClass('npc-disc');
  npc(you, { ai: rookie }).node.addClass('npc-funk');
  npc(you, { ai: unescapable });
  powerup(you, { effect: bulletrain(1) });
};

},{"../ai/rookie":6,"../ai/unescapable":7,"../npc":50,"../powerup":52,"../powerups/bulletrain":54}],18:[function(require,module,exports){
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

},{"../ai/growingpain":4,"../ai/machinegun":5,"../ai/rookie":6,"../enchantments/growatog":14,"../npc":50,"../powerup":52}],19:[function(require,module,exports){
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

},{"../ai/aimer":2,"../ai/growingpain":4,"../ai/rookie":6,"../npc":50,"../powerup":52,"../powerups/bulletrain":54}],20:[function(require,module,exports){
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

},{"../ai/aimer":2,"../ai/growingpain":4,"../ai/machinegun":5,"../ai/rookie":6,"../npc":50,"../powerup":52,"../powerups/rainstorm":57}],21:[function(require,module,exports){
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
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
  powerup(you, { effect: bulletrain(2) });
  powerup(you, { effect: bulletrain(2) });
  powerup(you, { effect: bulletrain(2) });
};

},{"../ai/aimer":2,"../ai/machinegun":5,"../ai/rookie":6,"../npc":50,"../powerup":52,"../powerups/bulletrain":54}],22:[function(require,module,exports){
var npc = require('../npc');
var powerup = require('../powerup');
var rookie = require('../ai/rookie');
var aimer = require('../ai/aimer');
var machinegun = require('../ai/machinegun');
var growatog = require('../enchantments/growatog');

module.exports = function (you) {
  you.addLevel(1, 2);
  powerup(you);
  npc(you, { ai: aimer, level: 6 }).node.addClass('npc-boss');
};

module.exports.enchantments = [
  growatog(3)
];

},{"../ai/aimer":2,"../ai/machinegun":5,"../ai/rookie":6,"../enchantments/growatog":14,"../npc":50,"../powerup":52}],23:[function(require,module,exports){
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
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: aimer });
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};

},{"../ai/aimer":2,"../ai/machinegun":5,"../ai/rookie":6,"../npc":50,"../powerup":52,"../powerups/bulletrain":54,"../powerups/rainstorm":57}],24:[function(require,module,exports){
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
  npc(you, { ai: aimer, level: 1 });
  npc(you, { ai: aimer });
  npc(you, { ai: aimer }).node.addClass('npc-mass');
  npc(you, { ai: machinegun, level: 3 });
  npc(you, { ai: machinegun }).node.addClass('npc-funk');
  npc(you, { ai: rookie, level: 2 }).node.addClass('npc-mass');
};

},{"../ai/aimer":2,"../ai/rookie":6,"../npc":50,"../powerup":52,"../powerups/chaosbringer":55,"../powerups/rainstorm":57}],25:[function(require,module,exports){
var $ = require('dominus');
var pows = require('./powerups');
var npcs = require('./npcs');
var npc = require('./npc');
var scoreboard = require('./scoreboard');
var emitter = require('./emitter');
var enchantments = require('./enchantments');
var listeners = [];

function once (fn) {
  var discarded;
  var f = function () {
    if (discarded) {
      return;
    }
    discarded = true;
    return fn.apply(null, arguments);
  };
  Object.keys(fn).forEach(function (key) {
    f[key] = fn[key];
  });
  return f;
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
    enchantments.set();
    emitter.emit('levels.change', level);
    scoreboard.add(level * 15);
    you.set(50, 50);
    if (levels[level]) {
      you.addRain();
      npcs.clear();
      pows.clear();
      $('.pc-parent').but('#you, .the-man').remove();
      levels[level](you);
      enchantments.set(levels[level].enchantments);
    }
  }

  function won () {
    emitter.emit('levels.win');
  }
};

},{"./emitter":12,"./enchantments":13,"./level/0":16,"./level/1":17,"./level/2":18,"./level/3":19,"./level/4":20,"./level/5":21,"./level/6":22,"./level/7":23,"./level/8":24,"./npc":50,"./npcs":51,"./powerups":53,"./scoreboard":58,"dominus":38}],26:[function(require,module,exports){
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

  function notFriendlyFire (m) {
    var left = m.npc || (m.gunner && m.gunner.npc);
    var right = me.npc || (me.gunner && me.gunner.npc);
    return !(left && right);
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
    return mobs
      .filter(notMe)
      .filter(notMyBullet)
      .filter(notMyGunner)
      .filter(notSameGunner)
      .filter(notFriendlyFire)
      .filter(collision);
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
    var old = me.level;
    me.node.find('.pc-cube').removeClass(lv(me.level)).addClass(lv(l));
    me.level = l;
    emitter.emit('mob.levelchange', me, l, old);
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

},{"./bullet":9,"./emitter":12,"./mobs":27,"./us":59}],27:[function(require,module,exports){
(function (global){
var mobs = [];

module.exports = global.cube.mob = mobs;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
module.exports = require('./src/contra.emitter.js');

},{"./src/contra.emitter.js":29}],29:[function(require,module,exports){
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
},{"/Users/nico/.nvm/v0.10.26/lib/node_modules/watchify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":1}],30:[function(require,module,exports){
var poser = require('./src/node');

module.exports = poser;

['Array', 'Function', 'Object', 'Date', 'String'].forEach(pose);

function pose (type) {
  poser[type] = function poseComputedType () { return poser(type); };
}

},{"./src/node":31}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
'use strict';

var poser = require('poser');
var Dominus = poser.Array();

module.exports = Dominus;

},{"poser":30}],34:[function(require,module,exports){
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

},{"./Dominus.ctor":33,"./classes":35,"./core":36,"./dom":37,"./public":40}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./Dominus.ctor":33,"./test":41}],37:[function(require,module,exports){
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

},{"./Dominus.ctor":33,"./core":36,"./events":39,"./test":41,"./text":42,"sektor":32}],38:[function(require,module,exports){
'use strict';

module.exports = require('./Dominus.prototype');

},{"./Dominus.prototype":34}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{"./Dominus.ctor":33,"./core":36,"./dom":37}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{"lodash.debounce":44,"lodash.isfunction":47,"lodash.isobject":48}],44:[function(require,module,exports){
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

},{"lodash.isfunction":47,"lodash.isobject":48,"lodash.now":45}],45:[function(require,module,exports){
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

},{"lodash._isnative":46}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{"lodash._objecttypes":49}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{"./ai/baboon":3,"./audio":8,"./emitter":12,"./incubate":15,"./mob":26,"./npcs":51,"dominus":38}],51:[function(require,module,exports){
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
},{}],52:[function(require,module,exports){
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

},{"./emitter":12,"./incubate":15,"./mob":26,"./powerups":53,"./powerups/lifesaver":56,"./us":59,"dominus":38}],53:[function(require,module,exports){
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
},{}],54:[function(require,module,exports){
var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var npc = require('../npc');
var aimer = require('../ai/aimer');
var bullet = require('../bullet');
var powerup = require('../powerup');
var audio = require('../audio');

module.exports = function bulletrain (level) {
  function effect (player) {
    fire(0, -1);
    fire(0, 1);
    fire(1, 1);
    fire(1, 0);
    fire(1, -1);
    fire(-1, -1);
    fire(-1, 1);
    fire(-1, 0);

    function fire (x, y) {
      bullet(player, { level: level, diy: { dx: x, dy: y }, audio: false });
    }

    function sound () {
      audio.play('bulletrain');
    }

    setTimeout(sound, 50);
  }

  effect.words = ['BULLETRAIN!', 'TRAIN OF BULLETS.', 'YES!', 'BEASTLY', 'MAJESTUOUS!', 'DIE DIE DIE'];

  return effect;
};

},{"../ai/aimer":2,"../audio":8,"../bullet":9,"../npc":50,"../npcs":51,"../powerup":52,"dominus":38}],55:[function(require,module,exports){
var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var npc = require('../npc');
var aimer = require('../ai/aimer');
var powerup = require('../powerup');
var audio = require('../audio');

module.exports = function chaosbringer (level) {
  function effect (player, pow) {
    var count = Math.min(level, 4);
    for (i = 0; i < count; i++) {
      npc(player, { ai: aimer, level: Math.floor(Math.max(1, i / 2)) });
    }
    if (--level > 0) {
      powerup(player, { effect: chaosbringer(level) });
    }
    audio.play('chaosbringer');
  }

  effect.words = ['FIERY DEATH!', 'ANGRY THINGS.', 'OH NO', 'CHAOS BRINGER', 'angry kill!', 'death is inevitable'];

  return effect;
};

},{"../ai/aimer":2,"../audio":8,"../npc":50,"../npcs":51,"../powerup":52,"dominus":38}],56:[function(require,module,exports){
var audio = require('../audio');

module.exports = function (lives) {
  function effect (player, pow) {
    player.addLevel(lives);
    audio.play('lifesaver');
  }

  effect.words = ['LIFE!', 'Saver.'];

  return effect;
};

},{"../audio":8}],57:[function(require,module,exports){
var $ = require('dominus');
var body = $(document.body);
var npcs = require('../npcs');
var us = require('../us');
var audio = require('../audio');

module.exports = function (level) {
  function effect (player, pow) {
    var npc;

    body.addClass('rainstorm');

    setTimeout(function () {
      body.removeClass('rainstorm');
    }, 300);

    while (level-- && npcs.length) {
      setTimeout(damage.bind(null, us.r(npcs)), Math.random() * 300);
    }

    function  damage (npc) {
      npc.mob.damage(level);
    }

    npcs.forEach(function (npc, i) {
      if (i < level) {
        npc.mob.damage(level);
      }
    });
    audio.play('rainstorm');
  }

  effect.words = ['STORM!', 'Shower.', 'DEATH', 'Mayhem', 'WOOO!', 'KILL \'EM ALL'];

  return effect;
};

},{"../audio":8,"../npcs":51,"../us":59,"dominus":38}],58:[function(require,module,exports){
var $ = require('dominus');
var us = require('./us');
var emitter = require('./emitter');
var level = $('.sc-level');
var points = $('.sc-points');
var lives = $('.sc-lives');
var cbomb = $('.sc-bombs');
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

emitter.on('player.rain', function (r) {
  rain = r;
  update();
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
  cbomb.text(rain);
}

module.exports = {
  reset: reset,
  add: add,
  update: update
};

},{"./emitter":12,"./us":59,"dominus":38}],59:[function(require,module,exports){
function pc (v, r) { return p(r / 100 * v); }
function u (m) { return a = parseInt(m.replace('px', ''), 10), isNaN(a) ? 0 : a; }
function p (v) { return v + 'px'; }
function mm (min, max) { return Math.floor((Math.random() * (max - min)) + min); }
function r (c) { return c[Math.floor(Math.random() * c.length)]; }

module.exports = {
  pc: pc,
  u: u,
  p: p,
  mm: mm,
  r: r
};

},{}]},{},[11])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbmljby8ubnZtL3YwLjEwLjI2L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9uaWNvLy5udm0vdjAuMTAuMjYvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9haS9haW1lci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL2JhYm9vbi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL2dyb3dpbmdwYWluLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvYWkvbWFjaGluZWd1bi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL3Jvb2tpZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2FpL3VuZXNjYXBhYmxlLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvYXVkaW8uanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9idWxsZXQuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9idWxsZXRzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvY3ViZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2VtaXR0ZXIuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9lbmNoYW50bWVudHMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9lbmNoYW50bWVudHMvZ3Jvd2F0b2cuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9pbmN1YmF0ZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzAuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC8xLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvMi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC80LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvNS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVsLzYuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9sZXZlbC83LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbGV2ZWwvOC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL2xldmVscy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL21vYi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL21vYnMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvY29udHJhLmVtaXR0ZXIvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvY29udHJhLmVtaXR0ZXIvc3JjL2NvbnRyYS5lbWl0dGVyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvbm9kZV9tb2R1bGVzL3Bvc2VyL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvbm9kZV9tb2R1bGVzL3Bvc2VyL3NyYy9icm93c2VyLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvbm9kZV9tb2R1bGVzL3Nla3Rvci9zcmMvc2VrdG9yLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL0RvbWludXMuY3Rvci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy9Eb21pbnVzLnByb3RvdHlwZS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy9jbGFzc2VzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL2NvcmUuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvZG9tLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL2RvbWludXMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvZG9taW51cy9zcmMvZXZlbnRzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL3B1YmxpYy5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL25vZGVfbW9kdWxlcy9kb21pbnVzL3NyYy90ZXN0LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2RvbWludXMvc3JjL3RleHQuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL25vZGVfbW9kdWxlcy9sb2Rhc2gubm93L2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL25vZGVfbW9kdWxlcy9sb2Rhc2gubm93L25vZGVfbW9kdWxlcy9sb2Rhc2guX2lzbmF0aXZlL2luZGV4LmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvbm9kZV9tb2R1bGVzL2xvZGFzaC50aHJvdHRsZS9ub2RlX21vZHVsZXMvbG9kYXNoLmlzZnVuY3Rpb24vaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ub2RlX21vZHVsZXMvbG9kYXNoLnRocm90dGxlL25vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3Qvbm9kZV9tb2R1bGVzL2xvZGFzaC5fb2JqZWN0dHlwZXMvaW5kZXguanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ucGMuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS9ucGNzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cC5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3Bvd2VydXBzLmpzIiwiL1VzZXJzL25pY28vZGV2L2N1YmUvcG93ZXJ1cHMvYnVsbGV0cmFpbi5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3Bvd2VydXBzL2NoYW9zYnJpbmdlci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3Bvd2VydXBzL2xpZmVzYXZlci5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3Bvd2VydXBzL3JhaW5zdG9ybS5qcyIsIi9Vc2Vycy9uaWNvL2Rldi9jdWJlL3Njb3JlYm9hcmQuanMiLCIvVXNlcnMvbmljby9kZXYvY3ViZS91cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuIiwidmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG52YXIgYnVsbGV0ID0gcmVxdWlyZSgnLi4vYnVsbGV0Jyk7XG52YXIgYXVkaW8gPSByZXF1aXJlKCcuLi9hdWRpbycpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYywgZW5lbXkpIHtcbiAgdmFyIG1vYiA9IG5wYy5tb2I7XG4gIHZhciBpbnRlbGxpZ2VuY2UgPSAwLjM7XG4gIHZhciBnb2FsID0gNzAwO1xuICB2YXIgaWRsZSA9IDA7XG4gIHZhciBkO1xuICB2YXIgcmVkaXJlY3QgPSB0aHJvdHRsZShjaGFuZ2VEaXJlY3Rpb24sIDMwMCArIHIoKSAqIDYwMCk7XG4gIHZhciBzaG9vdHJhdGUgPSAxMDAwO1xuICB2YXIgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKSArIHNob290cmF0ZTtcblxuICBmdW5jdGlvbiBjaGFuZ2VEaXJlY3Rpb24gKCkge1xuICAgIGF1ZGlvLnBsYXkoJ25wYy10aGluaycpO1xuICAgIGQgPSB7IHg6IHJzKCksIHk6IHJzKCkgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRoaW5rICgpIHtcbiAgICBpZiAoaWRsZSA+IGdvYWwpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgICBpZGxlID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWRsZSArPSByKCkgKiAxMDAgKiBpbnRlbGxpZ2VuY2U7XG4gICAgfVxuICAgIHZhciBwZXJmZWN0ID0gbW9iLm1vdmUoZC54LCBkLnkpO1xuICAgIGlmIChwZXJmZWN0ID09PSBmYWxzZSkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICB9XG4gICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgaWYgKG5vdyAtIGxhc3RTaG9vdGluZyA+IHNob290cmF0ZSkge1xuICAgICAgYnVsbGV0KG1vYiwgeyBsZXZlbDogTWF0aC5mbG9vcihNYXRoLm1heCgxLCBtb2IubGV2ZWwgKiAwLjUpKSwgYWltOiBlbmVteSB9KTtcbiAgICAgIGxhc3RTaG9vdGluZyA9IERhdGUubm93KCk7XG4gICAgfVxuICB9XG5cbiAgcmVkaXJlY3QoKTtcbiAgbnBjLnRoaW5rID0gdGhpbms7XG59O1xuIiwidmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG52YXIgYXVkaW8gPSByZXF1aXJlKCcuLi9hdWRpbycpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYykge1xuICB2YXIgbW9iID0gbnBjLm1vYjtcbiAgdmFyIGludGVsbGlnZW5jZSA9IDAuMztcbiAgdmFyIGdvYWwgPSA3MDA7XG4gIHZhciBpZGxlID0gMDtcbiAgdmFyIGQ7XG4gIHZhciByZWRpcmVjdCA9IHRocm90dGxlKGNoYW5nZURpcmVjdGlvbiwgMzAwICsgcigpICogMTAwMCk7XG5cbiAgZnVuY3Rpb24gY2hhbmdlRGlyZWN0aW9uICgpIHtcbiAgICBhdWRpby5wbGF5KCducGMtdGhpbmsnKTtcbiAgICBkID0geyB4OiBycygpLCB5OiBycygpIH07XG4gIH1cblxuICBmdW5jdGlvbiB0aGluayAoKSB7XG4gICAgaWYgKGlkbGUgPiBnb2FsKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgICAgaWRsZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkbGUgKz0gcigpICogMTAwICogaW50ZWxsaWdlbmNlO1xuICAgIH1cbiAgICB2YXIgcGVyZmVjdCA9IG1vYi5tb3ZlKGQueCwgZC55KTtcbiAgICBpZiAocGVyZmVjdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgcmVkaXJlY3QoKTtcbiAgbnBjLnRoaW5rID0gdGhpbms7XG59O1xuIiwidmFyIHRocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoLnRocm90dGxlJyk7XG52YXIgYnVsbGV0ID0gcmVxdWlyZSgnLi4vYnVsbGV0Jyk7XG52YXIgYXVkaW8gPSByZXF1aXJlKCcuLi9hdWRpbycpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYywgZW5lbXkpIHtcbiAgdmFyIG1vYiA9IG5wYy5tb2I7XG4gIHZhciBpbnRlbGxpZ2VuY2UgPSAwLjM7XG4gIHZhciBnb2FsID0gNzAwO1xuICB2YXIgaWRsZSA9IDA7XG4gIHZhciBkO1xuICB2YXIgcmVkaXJlY3QgPSB0aHJvdHRsZShjaGFuZ2VEaXJlY3Rpb24sIDMwMCArIHIoKSAqIDYwMCk7XG4gIHZhciBzaG9vdHJhdGUgPSAxMDAwO1xuICB2YXIgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKSArIHNob290cmF0ZTtcblxuICBmdW5jdGlvbiBjaGFuZ2VEaXJlY3Rpb24gKCkge1xuICAgIGF1ZGlvLnBsYXkoJ25wYy10aGluaycpO1xuICAgIGQgPSB7IHg6IHJzKCksIHk6IHJzKCkgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRoaW5rICgpIHtcbiAgICBpZiAoaWRsZSA+IGdvYWwpIHtcbiAgICAgIGlmIChyKCkgPiAwLjUpIHtcbiAgICAgICAgbW9iLmFkZExldmVsKDEsIDgpO1xuICAgICAgfVxuICAgICAgcmVkaXJlY3QoKTtcbiAgICAgIGlkbGUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGxlICs9IHIoKSAqIDEwMCAqIGludGVsbGlnZW5jZTtcbiAgICB9XG4gICAgdmFyIHBlcmZlY3QgPSBtb2IubW92ZShkLngsIGQueSk7XG4gICAgaWYgKHBlcmZlY3QgPT09IGZhbHNlKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgIH1cbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAobm93IC0gbGFzdFNob290aW5nID4gc2hvb3RyYXRlKSB7XG4gICAgICBidWxsZXQobW9iLCB7IGxldmVsOiBNYXRoLm1pbihtb2IubGV2ZWwsIDIpLCBhaW06IGVuZW15IH0pO1xuICAgICAgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gIH1cblxuICByZWRpcmVjdCgpO1xuICBucGMudGhpbmsgPSB0aGluaztcbn07XG4iLCJ2YXIgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKTtcbnZhciBidWxsZXQgPSByZXF1aXJlKCcuLi9idWxsZXQnKTtcblxuZnVuY3Rpb24gciAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpOyB9XG5mdW5jdGlvbiBycyAoKSB7IHJldHVybiBNYXRoLnNpZ24ocigpIC0gMC41KTsgfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChucGMsIGVuZW15KSB7XG4gIHZhciBtb2IgPSBucGMubW9iO1xuICB2YXIgaW50ZWxsaWdlbmNlID0gMC4zO1xuICB2YXIgZ29hbCA9IDcwMDtcbiAgdmFyIGlkbGUgPSAwO1xuICB2YXIgZDtcbiAgdmFyIHJlZGlyZWN0ID0gdGhyb3R0bGUoY2hhbmdlRGlyZWN0aW9uLCA1MCArIHIoKSAqIDIwMCk7XG4gIHZhciBzaG9vdHJhdGUgPSA1MDA7XG4gIHZhciBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpICsgc2hvb3RyYXRlO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZURpcmVjdGlvbiAoKSB7XG4gICAgZCA9IHsgeDogcnMoKSwgeTogcnMoKSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpbmsgKCkge1xuICAgIGlmIChpZGxlID4gZ29hbCkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICAgIGlkbGUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGxlICs9IHIoKSAqIDEwMCAqIGludGVsbGlnZW5jZTtcbiAgICB9XG4gICAgdmFyIHBlcmZlY3QgPSBtb2IubW92ZShkLngsIGQueSk7XG4gICAgaWYgKHBlcmZlY3QgPT09IGZhbHNlKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgIH1cbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAobm93IC0gbGFzdFNob290aW5nID4gc2hvb3RyYXRlKSB7XG4gICAgICBidWxsZXQobW9iLCB7IGxldmVsOiBNYXRoLmZsb29yKE1hdGgubWF4KDEsIG1vYi5sZXZlbCAqIDAuNSkpLCBhaW06IGVuZW15IH0pO1xuICAgICAgbGFzdFNob290aW5nID0gRGF0ZS5ub3coKTtcbiAgICB9XG4gIH1cblxuICByZWRpcmVjdCgpO1xuICBucGMudGhpbmsgPSB0aGluaztcbn07XG4iLCJ2YXIgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKTtcbnZhciBidWxsZXQgPSByZXF1aXJlKCcuLi9idWxsZXQnKTtcbnZhciBhdWRpbyA9IHJlcXVpcmUoJy4uL2F1ZGlvJyk7XG5cbmZ1bmN0aW9uIHIgKCkgeyByZXR1cm4gTWF0aC5yYW5kb20oKTsgfVxuZnVuY3Rpb24gcnMgKCkgeyByZXR1cm4gTWF0aC5zaWduKHIoKSAtIDAuNSk7IH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobnBjKSB7XG4gIHZhciBtb2IgPSBucGMubW9iO1xuICB2YXIgaW50ZWxsaWdlbmNlID0gMC4zO1xuICB2YXIgZ29hbCA9IDcwMDtcbiAgdmFyIGlkbGUgPSAwO1xuICB2YXIgZDtcbiAgdmFyIHJlZGlyZWN0ID0gdGhyb3R0bGUoY2hhbmdlRGlyZWN0aW9uLCAzMDAgKyByKCkgKiAzMDApO1xuICB2YXIgc2hvb3RyYXRlID0gMTUwMDtcbiAgdmFyIGxhc3RTaG9vdGluZyA9IERhdGUubm93KCkgKyBzaG9vdHJhdGU7XG5cbiAgZnVuY3Rpb24gY2hhbmdlRGlyZWN0aW9uICgpIHtcbiAgICBhdWRpby5wbGF5KCducGMtdGhpbmsnKTtcbiAgICBkID0geyB4OiBycygpLCB5OiBycygpIH07XG4gIH1cblxuICBmdW5jdGlvbiB0aGluayAoKSB7XG4gICAgaWYgKGlkbGUgPiBnb2FsKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgICAgaWRsZSA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlkbGUgKz0gcigpICogMTAwICogaW50ZWxsaWdlbmNlO1xuICAgIH1cbiAgICB2YXIgcGVyZmVjdCA9IG1vYi5tb3ZlKGQueCwgZC55KTtcbiAgICBpZiAocGVyZmVjdCA9PT0gZmFsc2UpIHtcbiAgICAgIHJlZGlyZWN0KCk7XG4gICAgfVxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xuICAgIGlmIChub3cgLSBsYXN0U2hvb3RpbmcgPiBzaG9vdHJhdGUpIHtcbiAgICAgIGJ1bGxldChtb2IsIHsgbGV2ZWw6IE1hdGguZmxvb3IoTWF0aC5tYXgoMSwgbW9iLmxldmVsICogMC41KSkgfSk7XG4gICAgICBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgfVxuXG4gIHJlZGlyZWN0KCk7XG4gIG5wYy50aGluayA9IHRoaW5rO1xufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xudmFyIGJ1bGxldHJhaW4gPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9idWxsZXRyYWluJyk7XG52YXIgYXVkaW8gPSByZXF1aXJlKCcuLi9hdWRpbycpO1xuXG5mdW5jdGlvbiByICgpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCk7IH1cbmZ1bmN0aW9uIHJzICgpIHsgcmV0dXJuIE1hdGguc2lnbihyKCkgLSAwLjUpOyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5wYykge1xuICB2YXIgbW9iID0gbnBjLm1vYjtcbiAgdmFyIGludGVsbGlnZW5jZSA9IDAuMztcbiAgdmFyIGdvYWwgPSA3MDA7XG4gIHZhciBpZGxlID0gMDtcbiAgdmFyIGQ7XG4gIHZhciByZWRpcmVjdCA9IHRocm90dGxlKGNoYW5nZURpcmVjdGlvbiwgMzAwICsgcigpICogMzAwKTtcbiAgdmFyIHNob290cmF0ZSA9IDE1MDA7XG4gIHZhciBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpICsgc2hvb3RyYXRlO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZURpcmVjdGlvbiAoKSB7XG4gICAgYXVkaW8ucGxheSgnbnBjLXRoaW5rJyk7XG4gICAgZCA9IHsgeDogcnMoKSwgeTogcnMoKSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gdGhpbmsgKCkge1xuICAgIGlmIChpZGxlID4gZ29hbCkge1xuICAgICAgcmVkaXJlY3QoKTtcbiAgICAgIGlkbGUgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZGxlICs9IHIoKSAqIDEwMCAqIGludGVsbGlnZW5jZTtcbiAgICB9XG4gICAgdmFyIHBlcmZlY3QgPSBtb2IubW92ZShkLngsIGQueSk7XG4gICAgaWYgKHBlcmZlY3QgPT09IGZhbHNlKSB7XG4gICAgICByZWRpcmVjdCgpO1xuICAgIH1cbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAobm93IC0gbGFzdFNob290aW5nID4gc2hvb3RyYXRlKSB7XG4gICAgICBidWxsZXRyYWluKE1hdGguZmxvb3IoTWF0aC5tYXgoMSwgbW9iLmxldmVsICogMC41KSkpKG1vYik7XG4gICAgICBsYXN0U2hvb3RpbmcgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgfVxuXG4gIHJlZGlyZWN0KCk7XG4gIG5wYy50aGluayA9IHRoaW5rO1xufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xudmFyIGF1ZGlvID0ge1xuICBwbGF5OiBwbGF5LFxuICBtdXRlZDogZmFsc2Vcbn07XG52YXIgdGhyb3R0bGVkID0ge307XG5cbnQoJ25wYy10aGluaycsIDg1MDApO1xuXG5mdW5jdGlvbiB0IChmaWxlLCBmcmVxKSB7XG4gIHRocm90dGxlZFtmaWxlXSA9IHRocm90dGxlKHBsYXkuYmluZChudWxsLCBmaWxlKSwgZnJlcSk7XG59XG5cbmZ1bmN0aW9uIHBsYXkgKGZpbGUpIHtjb25zb2xlLmxvZyhmaWxlKTtcbiAgaWYgKHRocm90dGxlZFtmaWxlXSkge1xuICAgIHRocm90dGxlZFtmaWxlXSgpOyByZXR1cm47XG4gIH1cbiAgaWYgKGF1ZGlvLm11dGVkID09PSBmYWxzZSkge1xuICAgIG5ldyBBdWRpbygnYXVkaW8vJyArIGZpbGUgKyAnLndhdicpLmF1dG9wbGF5ID0gdHJ1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGF1ZGlvO1xuIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgYXVkaW8gPSByZXF1aXJlKCcuL2F1ZGlvJyk7XG52YXIgaW5jdWJhdGUgPSByZXF1aXJlKCcuL2luY3ViYXRlJyk7XG52YXIgYnVsbGV0cyA9IHJlcXVpcmUoJy4vYnVsbGV0cycpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciB1cyA9IHJlcXVpcmUoJy4vdXMnKTtcblxuZnVuY3Rpb24gciAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpOyB9XG5mdW5jdGlvbiByc3RhbGUgKCkgeyB2YXIgdiA9IHIoKTsgcmV0dXJuIHYgPiAwLjY2ID8gLTEgOiB2ID4gMC4zMyA/IDEgOiAwOyB9XG5cbmZ1bmN0aW9uIGJ1bGxldCAoc291cmNlLCBvcHRpb25zKSB7XG4gIHZhciBvID0gb3B0aW9ucyB8fCB7fTtcbiAgdmFyIGxldmVsID0gby5sZXZlbCB8fCAwO1xuICB2YXIgbW9iID0gcmVxdWlyZSgnLi9tb2InKTtcbiAgdmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xuICB2YXIgcyA9IGdldENvbXB1dGVkU3R5bGUoc291cmNlLm5vZGVbMF0pO1xuICB2YXIgbm9kZSA9IGluY3ViYXRlKCk7XG4gIG5vZGVbMF0uc3R5bGUudG9wID0gcy50b3A7XG4gIG5vZGVbMF0uc3R5bGUubGVmdCA9IHMubGVmdDtcbiAgdmFyIHRzID0gMTI7XG4gIHZhciBkeCA9IHNvdXJjZS5kLng7XG4gIHZhciBkeSA9IHNvdXJjZS5kLnk7XG4gIHZhciBjdWJlID0gbm9kZS5maW5kKCcucGMtY3ViZScpLmFkZENsYXNzKCdwYy1zaG93Jyk7XG4gIGlmIChvLmRpeSkge1xuICAgIGR4ID0gby5kaXkuZHg7XG4gICAgZHkgPSBvLmRpeS5keTtcbiAgfSBlbHNlIGlmIChvLmFpbSkge1xuICAgIHZhciBhID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlWzBdKTtcbiAgICB2YXIgYiA9IGdldENvbXB1dGVkU3R5bGUoby5haW0ubm9kZVswXSk7XG4gICAgdmFyIHggPSB1cy51KGIubGVmdCkgLSB1cy51KGEubGVmdCk7XG4gICAgdmFyIHkgPSB1cy51KGIudG9wKSAtIHVzLnUoYS50b3ApO1xuICAgIGR4ID0gTWF0aC5hYnMoeCkgPiA0MCA/IHggOiAwO1xuICAgIGR5ID0gTWF0aC5hYnMoeSkgPiA0MCA/IHkgOiAwO1xuICB9IGVsc2UgaWYgKGR4ID09PSAwICYmIGR5ID09PSAwKSB7XG4gICAgZHggPSByc3RhbGUoKTtcbiAgICBkeSA9IHJzdGFsZSgpO1xuICAgIGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkge1xuICAgICAgZHggPSByc3RhbGUoKTtcbiAgICAgIGR5ID0gZHggPT09IDAgPyAxIDogcnN0YWxlKCk7XG4gICAgfVxuICB9XG4gIHZhciBtID0gbW9iKG5vZGUsIHtcbiAgICB0eXBlOiAnYnVsbGV0JyxcbiAgICBsZXZlbDogbGV2ZWwsXG4gICAgdG9wc3BlZWQ6IHRzLFxuICAgIGFjY2VsOiB7XG4gICAgICB4OiBNYXRoLmFicyhkeCkgKiB0cyxcbiAgICAgIHk6IE1hdGguYWJzKGR5KSAqIHRzXG4gICAgfVxuICB9KTtcbiAgdmFyIG1lID0ge1xuICAgIHJlbW92ZTogcmVtb3ZlLFxuICAgIG5vZGU6IG5vZGUsXG4gICAgbW9iOiBtLFxuICAgIHY6IHtcbiAgICAgIHg6IE1hdGguc2lnbihkeCksXG4gICAgICB5OiBNYXRoLnNpZ24oZHkpXG4gICAgfVxuICB9O1xuICBtLmd1bm5lciA9IHNvdXJjZTtcblxuICBmdW5jdGlvbiBzbW9vdGggKCkge1xuICAgIGN1YmUuYWRkQ2xhc3MoJ3BjLXNtb290aCcpO1xuICB9XG5cbiAgZnVuY3Rpb24gc291bmQgKCkge1xuICAgIGlmIChvLmF1ZGlvICE9PSBmYWxzZSkge1xuICAgICAgYXVkaW8ucGxheSgnYnVsbGV0LScgKyBNYXRoLm1heChsZXZlbCwgNSkpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXR0ZXIub24oJ21vYi5yZW1vdmUnLCBmdW5jdGlvbiBybSAod2hvKSB7XG4gICAgaWYgKHdobyA9PT0gbSkge1xuICAgICAgYnVsbGV0cy5zcGxpY2UoYnVsbGV0cy5pbmRleE9mKG1lKSwgMSk7XG4gICAgICBlbWl0dGVyLm9mZignbW9iLnJlbW92ZScsIHJtKTtcbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHJlbW92ZSAoKSB7XG4gICAgbS5yZW1vdmUoKTtcbiAgfVxuXG4gIHNldFRpbWVvdXQoc21vb3RoLCAwKTtcbiAgc2V0VGltZW91dChzb3VuZCwgNTApO1xuICBzZXRUaW1lb3V0KHJlbW92ZSwgMjQwMCk7XG5cbiAgYnVsbGV0cy5wdXNoKG1lKTtcblxuICByZXR1cm4gbWU7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBidWxsZXQ7XG4iLCJ2YXIgYnVsbGV0cyA9IFtdO1xuXG5mdW5jdGlvbiB0aWNrICgpIHtcbiAgYnVsbGV0cy5mb3JFYWNoKGZ1bmN0aW9uIChidWxsZXQpIHtcbiAgICBpZiAoYnVsbGV0LmJvb3QpIHtcbiAgICAgIGJ1bGxldC5tb2IubW92ZShidWxsZXQudi54LCBidWxsZXQudi55KTtcbiAgICAgIGJ1bGxldC5tb2IuY2QoKS5mb3JFYWNoKGRhbWFnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoYm9vdCwgMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm9vdCAoKSB7XG4gICAgICBidWxsZXQuYm9vdCA9IHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGFtYWdlICh0YXJnZXQpIHtcbiAgICAgIHRhcmdldC5kYW1hZ2UoYnVsbGV0LmxldmVsKTtcbiAgICAgIGJ1bGxldC5yZW1vdmUoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1bGxldHM7XG5cbmJ1bGxldHMudGljayA9IHRpY2s7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcblxuZ2xvYmFsLiQgPSAkO1xuZ2xvYmFsLmN1YmUgPSB7fTtcblxudmFyIG1vYiA9IHJlcXVpcmUoJy4vbW9iJyk7XG52YXIgbW9icyA9IHJlcXVpcmUoJy4vbW9icycpO1xudmFyIG5wYyA9IHJlcXVpcmUoJy4vbnBjJyk7XG52YXIgbnBjcyA9IHJlcXVpcmUoJy4vbnBjcycpO1xudmFyIHBvd3MgPSByZXF1aXJlKCcuL3Bvd2VydXBzJyk7XG52YXIgYnVsbGV0cyA9IHJlcXVpcmUoJy4vYnVsbGV0cycpO1xudmFyIGxldmVscyA9IHJlcXVpcmUoJy4vbGV2ZWxzJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIGluY3ViYXRlID0gcmVxdWlyZSgnLi9pbmN1YmF0ZScpO1xudmFyIGVuY2hhbnRtZW50cyA9IHJlcXVpcmUoJy4vZW5jaGFudG1lbnRzJyk7XG52YXIgYnVsbGV0cmFpbiA9IHJlcXVpcmUoJy4vcG93ZXJ1cHMvYnVsbGV0cmFpbicpO1xudmFyIGF1ZGlvID0gcmVxdWlyZSgnLi9hdWRpbycpO1xudmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xudmFyIHlvdXJDdWJlO1xudmFyIHlvdXJDdWJlSW50ZXJuYWw7XG52YXIgeW91O1xudmFyIGZsYXNoaW5nO1xudmFyIGtleXM7XG52YXIgU1BBQ0UgPSAzMjtcbnZhciBMRUZUID0gMzc7XG52YXIgVE9QID0gMzg7XG52YXIgUklHSFQgPSAzOTtcbnZhciBCT1RUT00gPSA0MDtcbnZhciBSID0gODI7XG52YXIgTSA9IDc3O1xudmFyIEMgPSA2NztcblxuY29uc29sZS5sb2coJyVjV2VsY29tZSB0byBQb255IEN1YmUhIFVzZSB0aGUgYXJyb3cga2V5cy4nLCAnZm9udC1mYW1pbHk6IFwiTWVycml3ZWF0aGVyXCI7IGZvbnQtc2l6ZTogNjBweDsgY29sb3I6ICNlOTJjNmM7Jyk7XG5cbmJvZHkub24oJ2NsaWNrJywgd2VsY29tZSk7XG5ib2R5Lm9uKCdrZXlkb3duJywgd2VsY29taW5nKTtcbmJvZHkub24oJ2tleWRvd24nLCBzcGVjaWFscyk7XG5cbmZ1bmN0aW9uIHdlbGNvbWluZyAoZSkge1xuICBpZiAoZS53aGljaCA9PT0gU1BBQ0UpIHtcbiAgICB3ZWxjb21lKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3BlY2lhbHMgKGUpIHtcbiAgaWYgKGUud2hpY2ggPT09IFIpIHtcbiAgICBnYW1lb3ZlcignT0suIFRSWSBBR0FJTiEnKTtcbiAgfVxuICBpZiAoZS53aGljaCA9PT0gTSkgeyAvLyBtdXRlIHNvdW5kc1xuICAgIGF1ZGlvLm11dGVkID0gIWF1ZGlvLm11dGVkO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluY3ViYXRlQ3ViZSAoKSB7XG4gIHlvdXJDdWJlID0gaW5jdWJhdGUoKS5hZGRDbGFzcygndGhlLW1hbicpO1xuICB5b3VyQ3ViZUludGVybmFsID0geW91ckN1YmUuZmluZCgnLnBjLWN1YmUnKTtcbn1cblxuZnVuY3Rpb24gd2VsY29tZSAoKSB7XG4gIGlmIChmbGFzaGluZykge1xuICAgICQoJyN3ZWxjb21lLXR3bycpLnJlbW92ZSgpO1xuICAgIGJvZHkucmVtb3ZlQ2xhc3MoJ2ZsYXNoeScpO1xuICAgIHN0YXJ0KCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgJCgnI3dlbGNvbWUtb25lJykucmVtb3ZlKCk7XG4gICAgYm9keS5yZW1vdmVDbGFzcygnd2VsY29tZScpO1xuICAgIGJvZHkuYWRkQ2xhc3MoJ2ZsYXNoeScpO1xuICAgIGZsYXNoaW5nID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRSYWluIChjKSB7XG4gIHRoaXMucmFpbiArPSBjIHx8IDE7XG4gIGVtaXR0ZXIuZW1pdCgncGxheWVyLnJhaW4nLCB0aGlzLnJhaW4pO1xufVxuXG5mdW5jdGlvbiBybVJhaW4gKGMpIHtcbiAgdGhpcy5yYWluIC09IGMgfHwgMTtcbiAgZW1pdHRlci5lbWl0KCdwbGF5ZXIucmFpbicsIHRoaXMucmFpbik7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0ICgpIHtcbiAga2V5cyA9IHt9O1xuICBhdWRpby5wbGF5KCdiZWdpbicpO1xuICBpbmN1YmF0ZUN1YmUoKTtcbiAgeW91ID0gbW9iKHlvdXJDdWJlLCB7IHR5cGU6ICd5b3UnLCBsZXZlbDogMSB9KTtcbiAgeW91LnJhaW4gPSAwO1xuICBnbG9iYWwuY3ViZS55b3UgPSB5b3U7XG4gIGVtaXR0ZXIuZW1pdCgncGxheWVyLnN0YXJ0JywgeW91KTtcbiAgZW1pdHRlci5vbignbW9iLmxldmVsZG93bicsIGxldmVsZG93bik7XG4gIGVtaXR0ZXIub24oJ2xldmVscy53aW4nLCB3b24pO1xuICB5b3Uucm1SYWluID0gcm1SYWluLmJpbmQoeW91KTtcbiAgeW91LmFkZFJhaW4gPSBhZGRSYWluLmJpbmQoeW91KTtcbiAgeW91LmFkZFJhaW4oMik7XG4gIHlvdXJDdWJlSW50ZXJuYWwuYWRkQ2xhc3MoJ3BjLXNob3cnKTtcbiAgYm9keS5vZmYoJ2NsaWNrJywgd2VsY29tZSk7XG4gIGJvZHkub2ZmKCdrZXlkb3duJywgd2VsY29taW5nKTtcbiAgYm9keS5vbigna2V5ZG93bicsIGtkKTtcbiAgYm9keS5vbigna2V5dXAnLCBrdSk7XG4gIGxldmVscyh5b3UpO1xuICBnYW1lbG9vcCgpO1xufVxuXG5mdW5jdGlvbiBsZXZlbGRvd24gKG0sIGxldmVsKSB7XG4gIGlmIChtID09PSB5b3UpIHtcbiAgICBlbWl0dGVyLmVtaXQoJ3BsYXllci5kZWF0aCcsIGxldmVsKTtcbiAgICBhdWRpby5wbGF5KCd5b3UtZGllJyk7XG4gICAgeW91LnBsYWNlbWVudCgpO1xuICAgIGJvZHkuYWRkQ2xhc3MoJ2RlYXRoZmxhc2gnKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGJvZHkucmVtb3ZlQ2xhc3MoJ2RlYXRoZmxhc2gnKTtcbiAgICB9LCA0MDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGtkIChlKSB7IGtleXNbZS53aGljaF0gPSB0cnVlOyB9XG5mdW5jdGlvbiBrdSAoZSkgeyBrZXlzW2Uud2hpY2hdID0gZmFsc2U7IH1cbmZ1bmN0aW9uIG5vUG93cyAobSkgeyByZXR1cm4gIW0ucG93OyB9XG5mdW5jdGlvbiBvbmx5UG93cyAobSkgeyByZXR1cm4gISFtLnBvdzsgfVxuZnVuY3Rpb24gdXNlUG93IChtKSB7IG0ucmVtb3ZlKCk7IH1cbmZ1bmN0aW9uIGdhbWVsb29wICgpIHtcbiAgdmFyIGwgPSBrZXlzW0xFRlRdO1xuICB2YXIgdCA9IGtleXNbVE9QXTtcbiAgdmFyIHIgPSBrZXlzW1JJR0hUXTtcbiAgdmFyIGIgPSBrZXlzW0JPVFRPTV07XG4gIHZhciB1ID0ga2V5c1tTUEFDRV07XG4gIGlmIChsICYmIHIpIHsgbCA9IHIgPSBmYWxzZTsgfVxuICBpZiAodCAmJiBiKSB7IHQgPSBiID0gZmFsc2U7IH1cbiAgeW91Lm1vdmUobCA/IC0xIDogKHIgPyAxIDogMCksIHQgPyAtMSA6IChiID8gMSA6IDApKTtcbiAgbnBjcy50aWNrKCk7XG4gIGJ1bGxldHMudGljaygpO1xuICBlbmNoYW50bWVudHMudGljaygpO1xuICB2YXIgY2QgPSB5b3UuY2QoKTtcbiAgdmFyIGNkTm9Qb3dzID0gY2QuZmlsdGVyKG5vUG93cyk7XG4gIGNkLmZpbHRlcihvbmx5UG93cykuZm9yRWFjaCh1c2VQb3cpO1xuICBpZiAoeW91LmtpYSB8fCBjZE5vUG93cy5sZW5ndGgpIHtcbiAgICBjZE5vUG93cy5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gICAgICB5b3UuZGFtYWdlKG0ubGV2ZWwpO1xuICAgIH0pO1xuICAgIGlmICh5b3Uua2lhKSB7XG4gICAgICBhdWRpby5wbGF5KCd5b3UtZGllJyk7XG4gICAgICBnYW1lb3ZlcignWU9VXFwnUkUgVkVSWSBNVUNIIERFQUQgV09XfiEnKTsgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBpZiAoa2V5c1tDXSAmJiB5b3UucmFpbiA+IDApIHtcbiAgICBrZXlzW0NdID0gZmFsc2U7IC8vIHNhdmUgcHJlY2lvdXMgcmFpbiFcbiAgICB5b3Uucm1SYWluKCk7XG4gICAgYnVsbGV0cmFpbih5b3UubGV2ZWwpKHlvdSk7XG4gIH0gZWxzZSBpZiAodSkge1xuICAgIHlvdS5maXJlKCk7XG4gIH1cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGdhbWVsb29wKTtcbn1cblxuZnVuY3Rpb24gZ2FtZW92ZXIgKG1lc3NhZ2UsIGNsYXNzZXMpIHtcbiAgZW1pdHRlci5vZmYoJ2xldmVscy53aW4nLCB3b24pO1xuICAkKCcucnQtdGludCcpLmFkZENsYXNzKFsncnQtc2hvdyddLmNvbmNhdChjbGFzc2VzIHx8IFtdKS5qb2luKCcgJykpO1xuICAkKCcucnQtdGV4dCcpLnRleHQobWVzc2FnZSk7XG4gIGNsZWFudXAoKTtcbiAgY29uc29sZS5sb2coJyVjJXMnLCAnZm9udC1mYW1pbHk6IFwiQ29taWMgU2FucyBNU1wiOyBmb250LXNpemU6IDI1cHg7IGNvbG9yOiAjZDExOTExOycsIG1lc3NhZ2UpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGJvZHkub24oJ2tleWRvd24nLCByZXN0YXJ0KTtcbiAgfSwgNTAwKTtcbn1cblxuZnVuY3Rpb24gY2xlYW51cCAoKSB7XG4gIGtleXMgPSB7fTtcbiAgZW5jaGFudG1lbnRzLnNldCgpO1xuICBib2R5Lm9mZigna2V5dXAnLCBrdSk7XG4gIGJvZHkub2ZmKCdrZXlkb3duJywga2QpO1xuICBlbWl0dGVyLm9mZignbW9iLmxldmVsZG93bicsIGxldmVsZG93bik7XG4gIGVtaXR0ZXIub2ZmKCdsZXZlbHMud2luJywgd29uKTtcbiAgbnBjcy5jbGVhcigpO1xuICBwb3dzLmNsZWFyKCk7XG4gIG1vYnMuc3BsaWNlKDAsIG1vYnMubGVuZ3RoKTtcbiAgaWYgKHlvdXJDdWJlSW50ZXJuYWwpIHsgeW91ckN1YmVJbnRlcm5hbC5yZW1vdmVDbGFzcygncGMtc2hvdycpOyB9XG4gIGlmICh5b3VyQ3ViZSkgeyB5b3VyQ3ViZS5yZW1vdmUoKTsgfVxufVxuXG5mdW5jdGlvbiB3b24gKCkge1xuICBnYW1lb3ZlcignWk9NRyBZT1UgV09OIScsIFsncnQtd29uJ10pO1xufVxuXG5mdW5jdGlvbiByZXN0YXJ0IChlKSB7XG4gIGlmIChlLndoaWNoID09PSBTUEFDRSkge1xuICAgIGJvZHkub2ZmKCdrZXlkb3duJywgcmVzdGFydCk7XG4gICAgJCgnLnJ0LXRpbnQnKS5yZW1vdmVDbGFzcygncnQtc2hvdycpO1xuICAgIHNldFRpbWVvdXQoc3RhcnQsIDEwMDApO1xuICB9XG59XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIGVtaXR0ZXIgPSByZXF1aXJlKCdjb250cmEuZW1pdHRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVtaXR0ZXIoKTtcbiIsInZhciBlbmNoYW50bWVudHM7XG5cbmZ1bmN0aW9uIHNldCAodikge1xuICBlbmNoYW50bWVudHMgPSB2IHx8IFtdO1xufVxuXG5mdW5jdGlvbiB0aWNrICgpIHtcbiAgZW5jaGFudG1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVuY2hhbnRtZW50KSB7XG4gICAgZW5jaGFudG1lbnQoKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0aWNrOiB0aWNrLFxuICBzZXQ6IHNldFxufTtcbiIsInZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xudmFyIG5wY3MgPSByZXF1aXJlKCcuLi9ucGNzJyk7XG52YXIgdXMgPSByZXF1aXJlKCcuLi91cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsZXZlbCkge1xuICB2YXIgZnJlcSA9IE1hdGgubWF4KDEyMDAwIC8gKGxldmVsICsgMSksIDEwMDApO1xuXG4gIHJldHVybiB0aHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG4gPSB1cy5yKG5wY3MpO1xuICAgIGlmIChuKSB7XG4gICAgICBuLm1vYi5hZGRMZXZlbCgxLCBsZXZlbCk7XG4gICAgfVxuICB9LCBmcmVxKTtcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBpbmN1YmF0b3IgPSAkKCcjeW91Jyk7XG52YXIgYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG5cbmZ1bmN0aW9uIGluY3ViYXRlICgpIHtcbiAgdmFyIGN1YmUgPSBpbmN1YmF0b3IuY2xvbmUoKS5hcHBlbmRUbyhib2R5KTtcbiAgY3ViZVswXS5yZW1vdmVBdHRyaWJ1dGUoJ2lkJyk7XG4gIGN1YmUuZmluZCgnLnBjLWN1YmUnKS5hZGRDbGFzcygncGMtc21vb3RoJyk7XG4gIHJldHVybiBjdWJlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluY3ViYXRlO1xuIiwidmFyIG5wYyA9IHJlcXVpcmUoJy4uL25wYycpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICBucGMoeW91KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBwb3dlcnVwKHlvdSk7XG59O1xuXG52YXIgZ3Jvd2F0b2cgPSByZXF1aXJlKCcuLi9lbmNoYW50bWVudHMvZ3Jvd2F0b2cnKTtcblxubW9kdWxlLmV4cG9ydHMuZW5jaGFudG1lbnRzID0gW1xuICBncm93YXRvZygxKVxuXTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciB1bmVzY2FwYWJsZSA9IHJlcXVpcmUoJy4uL2FpL3VuZXNjYXBhYmxlJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciBidWxsZXRyYWluID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvYnVsbGV0cmFpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KS5ub2RlLmFkZENsYXNzKCducGMtZnVuaycpO1xuICBucGMoeW91LCB7IGFpOiB1bmVzY2FwYWJsZSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBidWxsZXRyYWluKDEpIH0pO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBtYWNoaW5lZ3VuID0gcmVxdWlyZSgnLi4vYWkvbWFjaGluZWd1bicpO1xudmFyIGdyb3dpbmdwYWluID0gcmVxdWlyZSgnLi4vYWkvZ3Jvd2luZ3BhaW4nKTtcbnZhciBncm93YXRvZyA9IHJlcXVpcmUoJy4uL2VuY2hhbnRtZW50cy9ncm93YXRvZycpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICBucGMoeW91LCB7IGFpOiByb29raWUgfSkubm9kZS5hZGRDbGFzcygnbnBjLWRpc2MnKTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IGdyb3dpbmdwYWluLCBsZXZlbDogMSB9KS5ub2RlLmFkZENsYXNzKCducGMtbWFzcycpO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuIH0pO1xuICBwb3dlcnVwKHlvdSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5lbmNoYW50bWVudHMgPSBbXG4gIGdyb3dhdG9nKDIpXG5dO1xuIiwidmFyIG5wYyA9IHJlcXVpcmUoJy4uL25wYycpO1xudmFyIHJvb2tpZSA9IHJlcXVpcmUoJy4uL2FpL3Jvb2tpZScpO1xudmFyIGFpbWVyID0gcmVxdWlyZSgnLi4vYWkvYWltZXInKTtcbnZhciBncm93aW5ncGFpbiA9IHJlcXVpcmUoJy4uL2FpL2dyb3dpbmdwYWluJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciBidWxsZXRyYWluID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvYnVsbGV0cmFpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgeW91LmFkZExldmVsKDEpO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IGJ1bGxldHJhaW4oMSkgfSk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogYnVsbGV0cmFpbigyKSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogcm9va2llIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGdyb3dpbmdwYWluLCBsZXZlbDogMSB9KS5ub2RlLmFkZENsYXNzKCducGMtbWFzcycpOztcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciByYWluc3Rvcm0gPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9yYWluc3Rvcm0nKTtcbnZhciBtYWNoaW5lZ3VuID0gcmVxdWlyZSgnLi4vYWkvbWFjaGluZWd1bicpO1xudmFyIGdyb3dpbmdwYWluID0gcmVxdWlyZSgnLi4vYWkvZ3Jvd2luZ3BhaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IGdyb3dpbmdwYWluLCBsZXZlbDogMyB9KS5ub2RlLmFkZENsYXNzKCducGMtZGlzYycpO1xuICBucGMoeW91LCB7IGFpOiByb29raWUsIGxldmVsOiAxIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuLCBsZXZlbDogMiB9KTtcbiAgbnBjKHlvdSwgeyBhaTogbWFjaGluZWd1biwgbGV2ZWw6IDIgfSk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogcmFpbnN0b3JtKDEpIH0pO1xufTtcbiIsInZhciBucGMgPSByZXF1aXJlKCcuLi9ucGMnKTtcbnZhciByb29raWUgPSByZXF1aXJlKCcuLi9haS9yb29raWUnKTtcbnZhciBhaW1lciA9IHJlcXVpcmUoJy4uL2FpL2FpbWVyJyk7XG52YXIgbWFjaGluZWd1biA9IHJlcXVpcmUoJy4uL2FpL21hY2hpbmVndW4nKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xudmFyIGJ1bGxldHJhaW4gPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9idWxsZXRyYWluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICB5b3UuYWRkTGV2ZWwoMSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyLCBsZXZlbDogMSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAzIH0pO1xuICBucGMoeW91LCB7IGFpOiByb29raWUsIGxldmVsOiAyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1tYXNzJyk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogYnVsbGV0cmFpbigyKSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBidWxsZXRyYWluKDIpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IGJ1bGxldHJhaW4oMikgfSk7XG59O1xuIiwidmFyIG5wYyA9IHJlcXVpcmUoJy4uL25wYycpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG52YXIgcm9va2llID0gcmVxdWlyZSgnLi4vYWkvcm9va2llJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIG1hY2hpbmVndW4gPSByZXF1aXJlKCcuLi9haS9tYWNoaW5lZ3VuJyk7XG52YXIgZ3Jvd2F0b2cgPSByZXF1aXJlKCcuLi9lbmNoYW50bWVudHMvZ3Jvd2F0b2cnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeW91KSB7XG4gIHlvdS5hZGRMZXZlbCgxLCAyKTtcbiAgcG93ZXJ1cCh5b3UpO1xuICBucGMoeW91LCB7IGFpOiBhaW1lciwgbGV2ZWw6IDYgfSkubm9kZS5hZGRDbGFzcygnbnBjLWJvc3MnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLmVuY2hhbnRtZW50cyA9IFtcbiAgZ3Jvd2F0b2coMylcbl07XG4iLCJ2YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgcm9va2llID0gcmVxdWlyZSgnLi4vYWkvcm9va2llJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIG1hY2hpbmVndW4gPSByZXF1aXJlKCcuLi9haS9tYWNoaW5lZ3VuJyk7XG52YXIgcG93ZXJ1cCA9IHJlcXVpcmUoJy4uL3Bvd2VydXAnKTtcbnZhciByYWluc3Rvcm0gPSByZXF1aXJlKCcuLi9wb3dlcnVwcy9yYWluc3Rvcm0nKTtcbnZhciBidWxsZXRyYWluID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvYnVsbGV0cmFpbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgeW91LmFkZExldmVsKDEpO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IHJhaW5zdG9ybSgzKSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBidWxsZXRyYWluKDMpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IGJ1bGxldHJhaW4oMykgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1kaXNjJyk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyLCBsZXZlbDogMSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAzIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1mdW5rJyk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4gfSkubm9kZS5hZGRDbGFzcygnbnBjLWZ1bmsnKTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSwgbGV2ZWw6IDIgfSkubm9kZS5hZGRDbGFzcygnbnBjLW1hc3MnKTtcbn07XG4iLCJ2YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgcm9va2llID0gcmVxdWlyZSgnLi4vYWkvcm9va2llJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG52YXIgcmFpbnN0b3JtID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvcmFpbnN0b3JtJyk7XG52YXIgY2hhb3NicmluZ2VyID0gcmVxdWlyZSgnLi4vcG93ZXJ1cHMvY2hhb3NicmluZ2VyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHlvdSkge1xuICB5b3UuYWRkTGV2ZWwoMSk7XG4gIHBvd2VydXAoeW91LCB7IGVmZmVjdDogcmFpbnN0b3JtKDIpIH0pO1xuICBwb3dlcnVwKHlvdSwgeyBlZmZlY3Q6IHJhaW5zdG9ybSgyKSB9KTtcbiAgcG93ZXJ1cCh5b3UsIHsgZWZmZWN0OiBjaGFvc2JyaW5nZXIoMikgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyLCBsZXZlbDogMSB9KTtcbiAgbnBjKHlvdSwgeyBhaTogYWltZXIgfSk7XG4gIG5wYyh5b3UsIHsgYWk6IGFpbWVyIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1tYXNzJyk7XG4gIG5wYyh5b3UsIHsgYWk6IG1hY2hpbmVndW4sIGxldmVsOiAzIH0pO1xuICBucGMoeW91LCB7IGFpOiBtYWNoaW5lZ3VuIH0pLm5vZGUuYWRkQ2xhc3MoJ25wYy1mdW5rJyk7XG4gIG5wYyh5b3UsIHsgYWk6IHJvb2tpZSwgbGV2ZWw6IDIgfSkubm9kZS5hZGRDbGFzcygnbnBjLW1hc3MnKTtcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBwb3dzID0gcmVxdWlyZSgnLi9wb3dlcnVwcycpO1xudmFyIG5wY3MgPSByZXF1aXJlKCcuL25wY3MnKTtcbnZhciBucGMgPSByZXF1aXJlKCcuL25wYycpO1xudmFyIHNjb3JlYm9hcmQgPSByZXF1aXJlKCcuL3Njb3JlYm9hcmQnKTtcbnZhciBlbWl0dGVyID0gcmVxdWlyZSgnLi9lbWl0dGVyJyk7XG52YXIgZW5jaGFudG1lbnRzID0gcmVxdWlyZSgnLi9lbmNoYW50bWVudHMnKTtcbnZhciBsaXN0ZW5lcnMgPSBbXTtcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGRpc2NhcmRlZDtcbiAgdmFyIGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGRpc2NhcmRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkaXNjYXJkZWQgPSB0cnVlO1xuICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICB9O1xuICBPYmplY3Qua2V5cyhmbikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgZltrZXldID0gZm5ba2V5XTtcbiAgfSk7XG4gIHJldHVybiBmO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh5b3UpIHtcbiAgdmFyIGxldmVsID0gMDtcbiAgdmFyIGxldmVscyA9IHtcbiAgICAwOiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvMCcpKSxcbiAgICAxOiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvMScpKSxcbiAgICAyOiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvMicpKSxcbiAgICAzOiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvMycpKSxcbiAgICA0OiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvNCcpKSxcbiAgICA1OiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvNScpKSxcbiAgICA2OiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvNicpKSxcbiAgICA3OiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvNycpKSxcbiAgICA4OiBvbmNlKHJlcXVpcmUoJy4vbGV2ZWwvOCcpKSxcbiAgfTtcblxuICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICBlbWl0dGVyLm9mZignbnBjLmtpbGwnLCBsaXN0ZW5lcik7XG4gIH0pO1xuICBsaXN0ZW5lcnMucHVzaChucGNLaWxsKTtcbiAgZW1pdHRlci5vbignbnBjLmtpbGwnLCBucGNLaWxsKTtcbiAgc2NvcmVib2FyZC5yZXNldCh5b3UpO1xuICByZXNldCgpO1xuXG4gIGZ1bmN0aW9uIG5wY0tpbGwgKGNsZWFyZWQpIHtcbiAgICB2YXIgbmV4dCA9IGxldmVsICsgMTtcbiAgICBpZiAoY2xlYXJlZCkge1xuICAgICAgaWYgKGxldmVsc1tuZXh0XSkge1xuICAgICAgICArK2xldmVsO1xuICAgICAgICBjb25zb2xlLmxvZygnJWNMRVZFTCAlcyBDTEVBUiBXT1d+IScsICdmb250LWZhbWlseTogXCJDYXJkb1wiOyBmb250LXNpemU6IDI1cHg7IGNvbG9yOiAjZmZkMmQyOycsIG5leHQpO1xuICAgICAgICBzZXRUaW1lb3V0KHJlc2V0LCA2MDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJyVjTEVWRUwgJXMgQ0xFQVIgWk9NRyBTVUNIIEdBTUVSfiEnLCAnZm9udC1mYW1pbHk6IFwiQ2FyZG9cIjsgZm9udC1zaXplOiAyNXB4OyBjb2xvcjogI2E0ZDRlNjsnLCBuZXh0KTtcbiAgICAgICAgc2V0VGltZW91dCh3b24sIDYwMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXQgKCkge1xuICAgIGVuY2hhbnRtZW50cy5zZXQoKTtcbiAgICBlbWl0dGVyLmVtaXQoJ2xldmVscy5jaGFuZ2UnLCBsZXZlbCk7XG4gICAgc2NvcmVib2FyZC5hZGQobGV2ZWwgKiAxNSk7XG4gICAgeW91LnNldCg1MCwgNTApO1xuICAgIGlmIChsZXZlbHNbbGV2ZWxdKSB7XG4gICAgICB5b3UuYWRkUmFpbigpO1xuICAgICAgbnBjcy5jbGVhcigpO1xuICAgICAgcG93cy5jbGVhcigpO1xuICAgICAgJCgnLnBjLXBhcmVudCcpLmJ1dCgnI3lvdSwgLnRoZS1tYW4nKS5yZW1vdmUoKTtcbiAgICAgIGxldmVsc1tsZXZlbF0oeW91KTtcbiAgICAgIGVuY2hhbnRtZW50cy5zZXQobGV2ZWxzW2xldmVsXS5lbmNoYW50bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHdvbiAoKSB7XG4gICAgZW1pdHRlci5lbWl0KCdsZXZlbHMud2luJyk7XG4gIH1cbn07XG4iLCJ2YXIgbW9icyA9IHJlcXVpcmUoJy4vbW9icycpO1xudmFyIGJ1bGxldCA9IHJlcXVpcmUoJy4vYnVsbGV0Jyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIHVzID0gcmVxdWlyZSgnLi91cycpO1xudmFyIGxhc3RidWxsZXQgPSBEYXRlLm5vdygpO1xudmFyIGJ1bGxldHJhdGUgPSAzMDA7XG52YXIgc2NyZWVubWFyZ2luID0gMzA7XG52YXIgbGFzdElkID0gMDtcblxuZnVuY3Rpb24gciAoKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpOyB9XG5cbmZ1bmN0aW9uIG1vYiAobm9kZSwgb3B0aW9ucykge1xuICB2YXIgbyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBzcGVlZCA9IG8uc3BlZWQgfHwgMC4zO1xuICB2YXIgdG9wc3BlZWQgPSBvLnRvcHNwZWVkIHx8IDQ7XG4gIHZhciBhY2NlbCA9IHtcbiAgICB4OiBvLmFjY2VsICYmIG8uYWNjZWwueCB8fCAwLCB5OiBvLmFjY2VsICYmIG8uYWNjZWwueSB8fCAwXG4gIH07XG4gIHZhciBkID0ge1xuICAgIHg6IDAsIHk6IDBcbiAgfTtcbiAgdmFyIGx0eXBlO1xuICB2YXIgbWUgPSB7XG4gICAgaWQ6IGxhc3RJZCsrLFxuICAgIHR5cGU6IG8udHlwZSxcbiAgICBub2RlOiBub2RlLFxuICAgIG1vdmU6IG1vdmUsXG4gICAgbGV2ZWw6IG8ubGV2ZWwgfHwgMCxcbiAgICBzZXQ6IHNldCxcbiAgICBjZDogY2QsXG4gICAgZmlyZTogZmlyZSxcbiAgICBwbGFjZW1lbnQ6IHBsYWNlbWVudCxcbiAgICBkYW1hZ2U6IGRhbWFnZSxcbiAgICByZW1vdmU6IHJlbW92ZSxcbiAgICBhY2NlbDogYWNjZWwsXG4gICAgZDogZCxcbiAgICBraWE6IGZhbHNlLFxuICAgIHNldExldmVsOiBzZXRMZXZlbCxcbiAgICBhZGRMZXZlbDogYWRkTGV2ZWxcbiAgfTtcblxuICBzZXRMZXZlbChtZS5sZXZlbCk7XG5cbiAgbW9icy5wdXNoKG1lKTtcblxuICBmdW5jdGlvbiBmICh2LCBkKSB7IHJldHVybiB2ICogKHNwZWVkICsgYWNjZWxbZF0pOyB9XG4gIGZ1bmN0aW9uIHNhbmUgKHYsIG1heCkge1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2LCBzY3JlZW5tYXJnaW4pLCBtYXggLSBzY3JlZW5tYXJnaW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZSAob3gsIG95KSB7XG4gICAgdmFyIGMgPSBub2RlWzBdO1xuICAgIHZhciBzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoYyk7XG4gICAgdmFyIHggPSB1cy51KHMubGVmdCkgKyBmKG94LCAneCcpO1xuICAgIHZhciB5ID0gdXMudShzLnRvcCkgKyBmKG95LCAneScpO1xuICAgIHZhciBzeCA9IG1lLmd1bm5lciA/IHggOiBzYW5lKHgsIGlubmVyV2lkdGgpO1xuICAgIHZhciBzeSA9IG1lLmd1bm5lciA/IHkgOiBzYW5lKHksIGlubmVySGVpZ2h0KTtcbiAgICBjLnN0eWxlLmxlZnQgPSB1cy5wKHN4KTtcbiAgICBjLnN0eWxlLnRvcCA9IHVzLnAoc3kpO1xuICAgIG1lLmQueCA9IG94O1xuICAgIG1lLmQueSA9IG95O1xuICAgIGFjY2VsZXJhdGUoJ3gnLCBveCk7XG4gICAgYWNjZWxlcmF0ZSgneScsIG95KTtcbiAgICBoaXRzKHMpO1xuICAgIHJldHVybiB4ID09PSBzeCAmJiB5ID09PSBzeTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpdHMgKGNvbXB1dGVkKSB7XG4gICAgdmFyIHMgPSBjb21wdXRlZCB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShub2RlWzBdKTtcbiAgICBtZS5oaXRib3ggPSB7IC8vIDEwJSBoaXRib3hcbiAgICAgIHg6IHVzLnUocy5sZWZ0KSAqIDAuOSxcbiAgICAgIHk6IHVzLnUocy50b3ApICogMC45LFxuICAgICAgdzogdXMudShzLndpZHRoKSAqIDEuMSxcbiAgICAgIGg6IHVzLnUocy5oZWlnaHQpICogMS4xXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFjY2VsZXJhdGUgKGQsIG0pIHtcbiAgICBhY2NlbFtkXSArPSBtID8gMC4yIDogLTAuNjU7XG4gICAgYWNjZWxbZF0gPSBNYXRoLm1heChNYXRoLm1pbih0b3BzcGVlZCwgYWNjZWxbZF0pLCAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vdE1lIChtKSB7XG4gICAgcmV0dXJuIG0gIT09IG1lO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90TXlCdWxsZXQgKG0pIHtcbiAgICByZXR1cm4gbS5ndW5uZXIgIT09IG1lO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90TXlHdW5uZXIgKG0pIHtcbiAgICByZXR1cm4gbSAhPT0gbWUuZ3VubmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90U2FtZUd1bm5lciAobSkge1xuICAgIHJldHVybiAhbS5ndW5uZXIgfHwgIW1lLmd1bm5lciB8fCBtLmd1bm5lciAhPT0gbWUuZ3VubmVyO1xuICB9XG5cbiAgZnVuY3Rpb24gbm90RnJpZW5kbHlGaXJlIChtKSB7XG4gICAgdmFyIGxlZnQgPSBtLm5wYyB8fCAobS5ndW5uZXIgJiYgbS5ndW5uZXIubnBjKTtcbiAgICB2YXIgcmlnaHQgPSBtZS5ucGMgfHwgKG1lLmd1bm5lciAmJiBtZS5ndW5uZXIubnBjKTtcbiAgICByZXR1cm4gIShsZWZ0ICYmIHJpZ2h0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbGxpc2lvbiAobSkge1xuICAgIHZhciBsID0gbWUuaGl0Ym94O1xuICAgIHZhciByID0gbS5oaXRib3g7XG4gICAgdmFyIGIgPSBsICYmIHI7XG4gICAgaWYgKCFiKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBseGIgPSBsLnggPj0gci54ICYmIGwueCA8IHIueCArIHIudztcbiAgICB2YXIgcnhiID0gci54ID49IGwueCAmJiByLnggPCBsLnggKyBsLnc7XG4gICAgdmFyIGx5YiA9IGwueSA+PSByLnkgJiYgbC55IDwgci55ICsgci5oO1xuICAgIHZhciByeWIgPSByLnkgPj0gbC55ICYmIHIueSA8IGwueSArIGwuaDtcbiAgICByZXR1cm4gKGx4YiB8fCByeGIpICYmIChseWIgfHwgcnliKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNkICgpIHtcbiAgICByZXR1cm4gbW9ic1xuICAgICAgLmZpbHRlcihub3RNZSlcbiAgICAgIC5maWx0ZXIobm90TXlCdWxsZXQpXG4gICAgICAuZmlsdGVyKG5vdE15R3VubmVyKVxuICAgICAgLmZpbHRlcihub3RTYW1lR3VubmVyKVxuICAgICAgLmZpbHRlcihub3RGcmllbmRseUZpcmUpXG4gICAgICAuZmlsdGVyKGNvbGxpc2lvbik7XG4gIH1cblxuICBmdW5jdGlvbiBzZXQgKHgsIHkpIHtcbiAgICB2YXIgYyA9IG5vZGVbMF07XG4gICAgYy5zdHlsZS5sZWZ0ID0gdXMucGMoeCwgaW5uZXJXaWR0aCk7XG4gICAgYy5zdHlsZS50b3AgPSB1cy5wYyh5LCBpbm5lckhlaWdodCk7XG4gICAgaGl0cygpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VtZW50ICgpIHtcbiAgICB2YXIgYXR0ZW1wdHMgPSAwO1xuICAgIHZhciB4ID0gcigpICogMTAwO1xuICAgIHZhciB5ID0gcigpICogMTAwO1xuICAgIHNldCh4LCB5KTtcblxuICAgIGlmICgrK2F0dGVtcHRzIDwgNSAmJiBjZCgpLmxlbmd0aCA+IDApIHtcbiAgICAgIHBsYWNlbWVudCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpcmUgKCkge1xuICAgIGlmIChEYXRlLm5vdygpIC0gbGFzdGJ1bGxldCA+IGJ1bGxldHJhdGUpIHtcbiAgICAgIGxhc3RidWxsZXQgPSBEYXRlLm5vdygpO1xuICAgICAgYnVsbGV0KG1lLCB7IGxldmVsOiBtZS5sZXZlbCB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmUgKCkge1xuICAgIGlmIChtZS5raWEpIHsgLy8gc2FuaXR5XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1lLmtpYSA9IHRydWU7XG4gICAgbm9kZS5yZW1vdmUoKTtcbiAgICBtb2JzLnNwbGljZShtb2JzLmluZGV4T2YobWUpLCAxKTtcbiAgICBlbWl0dGVyLmVtaXQoJ21vYi5yZW1vdmUnLCBtZSk7XG4gIH1cblxuICBmdW5jdGlvbiBsdiAobCkge1xuICAgIHJldHVybiBtZS50eXBlICsgJy0nICsgbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldExldmVsIChsKSB7XG4gICAgdmFyIG9sZCA9IG1lLmxldmVsO1xuICAgIG1lLm5vZGUuZmluZCgnLnBjLWN1YmUnKS5yZW1vdmVDbGFzcyhsdihtZS5sZXZlbCkpLmFkZENsYXNzKGx2KGwpKTtcbiAgICBtZS5sZXZlbCA9IGw7XG4gICAgZW1pdHRlci5lbWl0KCdtb2IubGV2ZWxjaGFuZ2UnLCBtZSwgbCwgb2xkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZExldmVsIChsLCBtKSB7XG4gICAgc2V0TGV2ZWwoTWF0aC5taW4obWUubGV2ZWwgKyBsLCBtIHx8IEluZmluaXR5KSk7XG4gIH1cblxuICBmdW5jdGlvbiBkYW1hZ2UgKGwpIHtcbiAgICB2YXIgbHYgPSBsIHx8IDE7XG4gICAgaWYgKG1lLmxldmVsID4gbHYgLSAxKSB7XG4gICAgICBzZXRMZXZlbChtZS5sZXZlbCAtIGx2KTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgnbW9iLmxldmVsZG93bicsIG1lLCBtZS5sZXZlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBtZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtb2I7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgbW9icyA9IFtdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5jdWJlLm1vYiA9IG1vYnM7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9jb250cmEuZW1pdHRlci5qcycpO1xuIiwiKGZ1bmN0aW9uIChwcm9jZXNzKXtcbihmdW5jdGlvbiAocm9vdCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgdW5kZWYgPSAnJyArIHVuZGVmaW5lZDtcbiAgZnVuY3Rpb24gYXRvYSAoYSwgbikgeyByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYSwgbik7IH1cbiAgZnVuY3Rpb24gZGVib3VuY2UgKGZuLCBhcmdzLCBjdHgpIHsgaWYgKCFmbikgeyByZXR1cm47IH0gdGljayhmdW5jdGlvbiBydW4gKCkgeyBmbi5hcHBseShjdHggfHwgbnVsbCwgYXJncyB8fCBbXSk7IH0pOyB9XG5cbiAgLy8gY3Jvc3MtcGxhdGZvcm0gdGlja2VyXG4gIHZhciBzaSA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicsIHRpY2s7XG4gIGlmIChzaSkge1xuICAgIHRpY2sgPSBmdW5jdGlvbiAoZm4pIHsgc2V0SW1tZWRpYXRlKGZuKTsgfTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gdW5kZWYgJiYgcHJvY2Vzcy5uZXh0VGljaykge1xuICAgIHRpY2sgPSBwcm9jZXNzLm5leHRUaWNrO1xuICB9IGVsc2Uge1xuICAgIHRpY2sgPSBmdW5jdGlvbiAoZm4pIHsgc2V0VGltZW91dChmbiwgMCk7IH07XG4gIH1cblxuICBmdW5jdGlvbiBfZW1pdHRlciAodGhpbmcsIG9wdGlvbnMpIHtcbiAgICB2YXIgb3B0cyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGV2dCA9IHt9O1xuICAgIGlmICh0aGluZyA9PT0gdW5kZWZpbmVkKSB7IHRoaW5nID0ge307IH1cbiAgICB0aGluZy5vbiA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgICAgaWYgKCFldnRbdHlwZV0pIHtcbiAgICAgICAgZXZ0W3R5cGVdID0gW2ZuXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV2dFt0eXBlXS5wdXNoKGZuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHRoaW5nLm9uY2UgPSBmdW5jdGlvbiAodHlwZSwgZm4pIHtcbiAgICAgIGZuLl9vbmNlID0gdHJ1ZTsgLy8gdGhpbmcub2ZmKGZuKSBzdGlsbCB3b3JrcyFcbiAgICAgIHRoaW5nLm9uKHR5cGUsIGZuKTtcbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHRoaW5nLm9mZiA9IGZ1bmN0aW9uICh0eXBlLCBmbikge1xuICAgICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgaWYgKGMgPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIGV2dFt0eXBlXTtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PT0gMCkge1xuICAgICAgICBldnQgPSB7fTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBldCA9IGV2dFt0eXBlXTtcbiAgICAgICAgaWYgKCFldCkgeyByZXR1cm4gdGhpbmc7IH1cbiAgICAgICAgZXQuc3BsaWNlKGV0LmluZGV4T2YoZm4pLCAxKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHRoaW5nLmVtaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcztcbiAgICAgIHZhciBhcmdzID0gYXRvYShhcmd1bWVudHMpO1xuICAgICAgdmFyIHR5cGUgPSBhcmdzLnNoaWZ0KCk7XG4gICAgICB2YXIgZXQgPSBldnRbdHlwZV07XG4gICAgICBpZiAodHlwZSA9PT0gJ2Vycm9yJyAmJiBvcHRzLnRocm93cyAhPT0gZmFsc2UgJiYgIWV0KSB7IHRocm93IGFyZ3MubGVuZ3RoID09PSAxID8gYXJnc1swXSA6IGFyZ3M7IH1cbiAgICAgIGlmICghZXQpIHsgcmV0dXJuIHRoaW5nOyB9XG4gICAgICBldnRbdHlwZV0gPSBldC5maWx0ZXIoZnVuY3Rpb24gZW1pdHRlciAobGlzdGVuKSB7XG4gICAgICAgIGlmIChvcHRzLmFzeW5jKSB7IGRlYm91bmNlKGxpc3RlbiwgYXJncywgY3R4KTsgfSBlbHNlIHsgbGlzdGVuLmFwcGx5KGN0eCwgYXJncyk7IH1cbiAgICAgICAgcmV0dXJuICFsaXN0ZW4uX29uY2U7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0aGluZztcbiAgICB9O1xuICAgIHJldHVybiB0aGluZztcbiAgfVxuXG4gIC8vIGNyb3NzLXBsYXRmb3JtIGV4cG9ydFxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gdW5kZWYgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IF9lbWl0dGVyO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuY29udHJhID0gcm9vdC5jb250cmEgfHwge307XG4gICAgcm9vdC5jb250cmEuZW1pdHRlciA9IF9lbWl0dGVyO1xuICB9XG59KSh0aGlzKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCIvVXNlcnMvbmljby8ubnZtL3YwLjEwLjI2L2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIpKSIsInZhciBwb3NlciA9IHJlcXVpcmUoJy4vc3JjL25vZGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBwb3NlcjtcblxuWydBcnJheScsICdGdW5jdGlvbicsICdPYmplY3QnLCAnRGF0ZScsICdTdHJpbmcnXS5mb3JFYWNoKHBvc2UpO1xuXG5mdW5jdGlvbiBwb3NlICh0eXBlKSB7XG4gIHBvc2VyW3R5cGVdID0gZnVuY3Rpb24gcG9zZUNvbXB1dGVkVHlwZSAoKSB7IHJldHVybiBwb3Nlcih0eXBlKTsgfTtcbn1cbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGQgPSBnbG9iYWwuZG9jdW1lbnQ7XG5cbmZ1bmN0aW9uIHBvc2VyICh0eXBlKSB7XG4gIHZhciBpZnJhbWUgPSBkLmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBkLmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcblxuICByZXR1cm4gbWFwKHR5cGUsIGlmcmFtZS5jb250ZW50V2luZG93KTtcbn1cblxuZnVuY3Rpb24gbWFwICh0eXBlLCBzb3VyY2UpIHsgLy8gZm9yd2FyZCBwb2x5ZmlsbHMgdG8gdGhlIHN0b2xlbiByZWZlcmVuY2UhXG4gIHZhciBvcmlnaW5hbCA9IHdpbmRvd1t0eXBlXS5wcm90b3R5cGU7XG4gIHZhciB2YWx1ZSA9IHNvdXJjZVt0eXBlXTtcbiAgdmFyIHByb3A7XG5cbiAgZm9yIChwcm9wIGluIG9yaWdpbmFsKSB7XG4gICAgdmFsdWUucHJvdG90eXBlW3Byb3BdID0gb3JpZ2luYWxbcHJvcF07XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcG9zZXI7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXhwYW5kbyA9ICdzZWt0b3ItJyArIERhdGUubm93KCk7XG52YXIgcnNpYmxpbmdzID0gL1srfl0vO1xudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIGRlbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbnZhciBtYXRjaCA9IGRlbC5tYXRjaGVzIHx8XG4gICAgICAgICAgICBkZWwud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICBkZWwubW96TWF0Y2hlc1NlbGVjdG9yIHx8XG4gICAgICAgICAgICBkZWwub01hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgZGVsLm1zTWF0Y2hlc1NlbGVjdG9yO1xuXG5mdW5jdGlvbiBxc2EgKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gIHZhciBleGlzdGVkLCBpZCwgcHJlZml4LCBwcmVmaXhlZCwgYWRhcHRlciwgaGFjayA9IGNvbnRleHQgIT09IGRvY3VtZW50O1xuICBpZiAoaGFjaykgeyAvLyBpZCBoYWNrIGZvciBjb250ZXh0LXJvb3RlZCBxdWVyaWVzXG4gICAgZXhpc3RlZCA9IGNvbnRleHQuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIGlkID0gZXhpc3RlZCB8fCBleHBhbmRvO1xuICAgIHByZWZpeCA9ICcjJyArIGlkICsgJyAnO1xuICAgIHByZWZpeGVkID0gcHJlZml4ICsgc2VsZWN0b3IucmVwbGFjZSgvLC9nLCAnLCcgKyBwcmVmaXgpO1xuICAgIGFkYXB0ZXIgPSByc2libGluZ3MudGVzdChzZWxlY3RvcikgJiYgY29udGV4dC5wYXJlbnROb2RlO1xuICAgIGlmICghZXhpc3RlZCkgeyBjb250ZXh0LnNldEF0dHJpYnV0ZSgnaWQnLCBpZCk7IH1cbiAgfVxuICB0cnkge1xuICAgIHJldHVybiAoYWRhcHRlciB8fCBjb250ZXh0KS5xdWVyeVNlbGVjdG9yQWxsKHByZWZpeGVkIHx8IHNlbGVjdG9yKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBbXTtcbiAgfSBmaW5hbGx5IHtcbiAgICBpZiAoZXhpc3RlZCA9PT0gbnVsbCkgeyBjb250ZXh0LnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTsgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmQgKHNlbGVjdG9yLCBjdHgsIGNvbGxlY3Rpb24sIHNlZWQpIHtcbiAgdmFyIGVsZW1lbnQ7XG4gIHZhciBjb250ZXh0ID0gY3R4IHx8IGRvY3VtZW50O1xuICB2YXIgcmVzdWx0cyA9IGNvbGxlY3Rpb24gfHwgW107XG4gIHZhciBpID0gMDtcbiAgaWYgKHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuICBpZiAoY29udGV4dC5ub2RlVHlwZSAhPT0gMSAmJiBjb250ZXh0Lm5vZGVUeXBlICE9PSA5KSB7XG4gICAgcmV0dXJuIFtdOyAvLyBiYWlsIGlmIGNvbnRleHQgaXMgbm90IGFuIGVsZW1lbnQgb3IgZG9jdW1lbnRcbiAgfVxuICBpZiAoc2VlZCkge1xuICAgIHdoaWxlICgoZWxlbWVudCA9IHNlZWRbaSsrXSkpIHtcbiAgICAgIGlmIChtYXRjaGVzU2VsZWN0b3IoZWxlbWVudCwgc2VsZWN0b3IpKSB7XG4gICAgICAgIHJlc3VsdHMucHVzaChlbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0cy5wdXNoLmFwcGx5KHJlc3VsdHMsIHFzYShzZWxlY3RvciwgY29udGV4dCkpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzIChzZWxlY3RvciwgZWxlbWVudHMpIHtcbiAgcmV0dXJuIGZpbmQoc2VsZWN0b3IsIG51bGwsIG51bGwsIGVsZW1lbnRzKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlc1NlbGVjdG9yIChlbGVtZW50LCBzZWxlY3Rvcikge1xuICByZXR1cm4gbWF0Y2guY2FsbChlbGVtZW50LCBzZWxlY3Rvcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZDtcblxuZmluZC5tYXRjaGVzID0gbWF0Y2hlcztcbmZpbmQubWF0Y2hlc1NlbGVjdG9yID0gbWF0Y2hlc1NlbGVjdG9yO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBvc2VyID0gcmVxdWlyZSgncG9zZXInKTtcbnZhciBEb21pbnVzID0gcG9zZXIuQXJyYXkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEb21pbnVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJCA9IHJlcXVpcmUoJy4vcHVibGljJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vY29yZScpO1xudmFyIGRvbSA9IHJlcXVpcmUoJy4vZG9tJyk7XG52YXIgY2xhc3NlcyA9IHJlcXVpcmUoJy4vY2xhc3NlcycpO1xudmFyIERvbWludXMgPSByZXF1aXJlKCcuL0RvbWludXMuY3RvcicpO1xuXG5mdW5jdGlvbiBlcXVhbHMgKHNlbGVjdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbiBlcXVhbHMgKGVsZW0pIHtcbiAgICByZXR1cm4gZG9tLm1hdGNoZXMoZWxlbSwgc2VsZWN0b3IpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzdHJhaWdodCAocHJvcCwgb25lKSB7XG4gIHJldHVybiBmdW5jdGlvbiBkb21NYXBwaW5nIChzZWxlY3Rvcikge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLm1hcChmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgcmV0dXJuIGRvbVtwcm9wXShlbGVtLCBzZWxlY3Rvcik7XG4gICAgfSk7XG4gICAgdmFyIHJlc3VsdHMgPSBjb3JlLmZsYXR0ZW4ocmVzdWx0KTtcbiAgICByZXR1cm4gb25lID8gcmVzdWx0c1swXSA6IHJlc3VsdHM7XG4gIH07XG59XG5cbkRvbWludXMucHJvdG90eXBlLnByZXYgPSBzdHJhaWdodCgncHJldicpO1xuRG9taW51cy5wcm90b3R5cGUubmV4dCA9IHN0cmFpZ2h0KCduZXh0Jyk7XG5Eb21pbnVzLnByb3RvdHlwZS5wYXJlbnQgPSBzdHJhaWdodCgncGFyZW50Jyk7XG5Eb21pbnVzLnByb3RvdHlwZS5wYXJlbnRzID0gc3RyYWlnaHQoJ3BhcmVudHMnKTtcbkRvbWludXMucHJvdG90eXBlLmNoaWxkcmVuID0gc3RyYWlnaHQoJ2NoaWxkcmVuJyk7XG5Eb21pbnVzLnByb3RvdHlwZS5maW5kID0gc3RyYWlnaHQoJ3FzYScpO1xuRG9taW51cy5wcm90b3R5cGUuZmluZE9uZSA9IHN0cmFpZ2h0KCdxcycsIHRydWUpO1xuXG5Eb21pbnVzLnByb3RvdHlwZS53aGVyZSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICByZXR1cm4gdGhpcy5maWx0ZXIoZXF1YWxzKHNlbGVjdG9yKSk7XG59O1xuXG5Eb21pbnVzLnByb3RvdHlwZS5pcyA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICByZXR1cm4gdGhpcy5zb21lKGVxdWFscyhzZWxlY3RvcikpO1xufTtcblxuRG9taW51cy5wcm90b3R5cGUuaSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICByZXR1cm4gbmV3IERvbWludXModGhpc1tpbmRleF0pO1xufTtcblxuZnVuY3Rpb24gY29tcGFyZUZhY3RvcnkgKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjb21wYXJlICgpIHtcbiAgICAkLmFwcGx5KG51bGwsIGFyZ3VtZW50cykuZm9yRWFjaChmbiwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59XG5cbkRvbWludXMucHJvdG90eXBlLmFuZCA9IGNvbXBhcmVGYWN0b3J5KGZ1bmN0aW9uIGFkZE9uZSAoZWxlbSkge1xuICBpZiAodGhpcy5pbmRleE9mKGVsZW0pID09PSAtMSkge1xuICAgIHRoaXMucHVzaChlbGVtKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn0pO1xuXG5Eb21pbnVzLnByb3RvdHlwZS5idXQgPSBjb21wYXJlRmFjdG9yeShmdW5jdGlvbiBhZGRPbmUgKGVsZW0pIHtcbiAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKGVsZW0pO1xuICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufSk7XG5cbkRvbWludXMucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKHR5cGVzLCBmaWx0ZXIsIGZuKSB7XG4gIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xuICAgIHR5cGVzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgZG9tLm9uKGVsZW0sIHR5cGUsIGZpbHRlciwgZm4pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Eb21pbnVzLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAodHlwZXMsIGZpbHRlciwgZm4pIHtcbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgdHlwZXMuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICBkb20ub2ZmKGVsZW0sIHR5cGUsIGZpbHRlciwgZm4pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5bXG4gIFsnYWRkQ2xhc3MnLCBjbGFzc2VzLmFkZF0sXG4gIFsncmVtb3ZlQ2xhc3MnLCBjbGFzc2VzLnJlbW92ZV0sXG4gIFsnc2V0Q2xhc3MnLCBjbGFzc2VzLnNldF0sXG4gIFsncmVtb3ZlQ2xhc3MnLCBjbGFzc2VzLnJlbW92ZV0sXG4gIFsncmVtb3ZlJywgZG9tLnJlbW92ZV1cbl0uZm9yRWFjaChtYXBNZXRob2RzKTtcblxuZnVuY3Rpb24gbWFwTWV0aG9kcyAoZGF0YSkge1xuICBEb21pbnVzLnByb3RvdHlwZVtkYXRhWzBdXSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgZGF0YVsxXShlbGVtLCB2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59XG5cbltcbiAgWydhcHBlbmQnLCBkb20uYXBwZW5kXSxcbiAgWydhcHBlbmRUbycsIGRvbS5hcHBlbmRUb10sXG4gIFsncHJlcGVuZCcsIGRvbS5wcmVwZW5kXSxcbiAgWydwcmVwZW5kVG8nLCBkb20ucHJlcGVuZFRvXSxcbiAgWydiZWZvcmUnLCBkb20uYmVmb3JlXSxcbiAgWydiZWZvcmVPZicsIGRvbS5iZWZvcmVPZl0sXG4gIFsnYWZ0ZXInLCBkb20uYWZ0ZXJdLFxuICBbJ2FmdGVyT2YnLCBkb20uYWZ0ZXJPZl0sXG4gIFsnc2hvdycsIGRvbS5zaG93XSxcbiAgWydoaWRlJywgZG9tLmhpZGVdXG5dLmZvckVhY2gobWFwTWFuaXB1bGF0aW9uKTtcblxuZnVuY3Rpb24gbWFwTWFuaXB1bGF0aW9uIChkYXRhKSB7XG4gIERvbWludXMucHJvdG90eXBlW2RhdGFbMF1dID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgZGF0YVsxXSh0aGlzLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59XG5cbkRvbWludXMucHJvdG90eXBlLmhhc0NsYXNzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLnNvbWUoZnVuY3Rpb24gKGVsZW0pIHtcbiAgICByZXR1cm4gY2xhc3Nlcy5jb250YWlucyhlbGVtLCB2YWx1ZSk7XG4gIH0pO1xufTtcblxuRG9taW51cy5wcm90b3R5cGUuYXR0ciA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICB2YXIgZ2V0dGVyID0gYXJndW1lbnRzLmxlbmd0aCA8IDI7XG4gIHZhciByZXN1bHQgPSB0aGlzLm1hcChmdW5jdGlvbiAoZWxlbSkge1xuICAgIHJldHVybiBnZXR0ZXIgPyBkb20uYXR0cihlbGVtLCBuYW1lKSA6IGRvbS5hdHRyKGVsZW0sIG5hbWUsIHZhbHVlKTtcbiAgfSk7XG4gIHJldHVybiBnZXR0ZXIgPyByZXN1bHRbMF0gOiB0aGlzO1xufTtcblxuZnVuY3Rpb24ga2V5VmFsdWUgKGtleSwgdmFsdWUpIHtcbiAgdmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAyO1xuICBpZiAoZ2V0dGVyKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoID8gZG9tW2tleV0odGhpc1swXSkgOiAnJztcbiAgfVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICBkb21ba2V5XShlbGVtLCB2YWx1ZSk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24ga2V5VmFsdWVQcm9wZXJ0eSAocHJvcCkge1xuICBEb21pbnVzLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uIGFjY2Vzc29yICh2YWx1ZSkge1xuICAgIHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMTtcbiAgICBpZiAoZ2V0dGVyKSB7XG4gICAgICByZXR1cm4ga2V5VmFsdWUuY2FsbCh0aGlzLCBwcm9wKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleVZhbHVlLmNhbGwodGhpcywgcHJvcCwgdmFsdWUpO1xuICB9O1xufVxuXG5bJ2h0bWwnLCAndGV4dCcsICd2YWx1ZSddLmZvckVhY2goa2V5VmFsdWVQcm9wZXJ0eSk7XG5cbkRvbWludXMucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGVsZW0pIHtcbiAgICByZXR1cm4gZG9tLmNsb25lKGVsZW0pO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9wdWJsaWMnKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRyaW0gPSAvXlxccyt8XFxzKyQvZztcbnZhciB3aGl0ZXNwYWNlID0gL1xccysvZztcblxuZnVuY3Rpb24gaW50ZXJwcmV0IChpbnB1dCkge1xuICByZXR1cm4gdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyA/IGlucHV0LnJlcGxhY2UodHJpbSwgJycpLnNwbGl0KHdoaXRlc3BhY2UpIDogaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIGNsYXNzZXMgKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUuY2xhc3NOYW1lLnJlcGxhY2UodHJpbSwgJycpLnNwbGl0KHdoaXRlc3BhY2UpO1xufVxuXG5mdW5jdGlvbiBzZXQgKG5vZGUsIGlucHV0KSB7XG4gIG5vZGUuY2xhc3NOYW1lID0gaW50ZXJwcmV0KGlucHV0KS5qb2luKCcgJyk7XG59XG5cbmZ1bmN0aW9uIGFkZCAobm9kZSwgaW5wdXQpIHtcbiAgdmFyIGN1cnJlbnQgPSByZW1vdmUobm9kZSwgaW5wdXQpO1xuICB2YXIgdmFsdWVzID0gaW50ZXJwcmV0KGlucHV0KTtcbiAgY3VycmVudC5wdXNoLmFwcGx5KGN1cnJlbnQsIHZhbHVlcyk7XG4gIHNldChub2RlLCBjdXJyZW50KTtcbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSAobm9kZSwgaW5wdXQpIHtcbiAgdmFyIGN1cnJlbnQgPSBjbGFzc2VzKG5vZGUpO1xuICB2YXIgdmFsdWVzID0gaW50ZXJwcmV0KGlucHV0KTtcbiAgdmFsdWVzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGkgPSBjdXJyZW50LmluZGV4T2YodmFsdWUpO1xuICAgIGlmIChpICE9PSAtMSkge1xuICAgICAgY3VycmVudC5zcGxpY2UoaSwgMSk7XG4gICAgfVxuICB9KTtcbiAgc2V0KG5vZGUsIGN1cnJlbnQpO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuZnVuY3Rpb24gY29udGFpbnMgKG5vZGUsIGlucHV0KSB7XG4gIHZhciBjdXJyZW50ID0gY2xhc3Nlcyhub2RlKTtcbiAgdmFyIHZhbHVlcyA9IGludGVycHJldChpbnB1dCk7XG5cbiAgcmV0dXJuIHZhbHVlcy5ldmVyeShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gY3VycmVudC5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWRkOiBhZGQsXG4gIHJlbW92ZTogcmVtb3ZlLFxuICBjb250YWluczogY29udGFpbnMsXG4gIHNldDogc2V0LFxuICBnZXQ6IGNsYXNzZXNcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0ZXN0ID0gcmVxdWlyZSgnLi90ZXN0Jyk7XG52YXIgRG9taW51cyA9IHJlcXVpcmUoJy4vRG9taW51cy5jdG9yJyk7XG52YXIgcHJvdG8gPSBEb21pbnVzLnByb3RvdHlwZTtcblxuZnVuY3Rpb24gQXBwbGllZCAoYXJncykge1xuICByZXR1cm4gRG9taW51cy5hcHBseSh0aGlzLCBhcmdzKTtcbn1cblxuQXBwbGllZC5wcm90b3R5cGUgPSBwcm90bztcblxuWydtYXAnLCAnZmlsdGVyJywgJ2NvbmNhdCddLmZvckVhY2goZW5zdXJlKTtcblxuZnVuY3Rpb24gZW5zdXJlIChrZXkpIHtcbiAgdmFyIG9yaWdpbmFsID0gcHJvdG9ba2V5XTtcbiAgcHJvdG9ba2V5XSA9IGZ1bmN0aW9uIGFwcGxpZWQgKCkge1xuICAgIHJldHVybiBhcHBseShvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXBwbHkgKGEpIHtcbiAgcmV0dXJuIG5ldyBBcHBsaWVkKGEpO1xufVxuXG5mdW5jdGlvbiBjYXN0IChhKSB7XG4gIGlmIChhIGluc3RhbmNlb2YgRG9taW51cykge1xuICAgIHJldHVybiBhO1xuICB9XG4gIGlmICghYSkge1xuICAgIHJldHVybiBuZXcgRG9taW51cygpO1xuICB9XG4gIGlmICh0ZXN0LmlzRWxlbWVudChhKSkge1xuICAgIHJldHVybiBuZXcgRG9taW51cyhhKTtcbiAgfVxuICBpZiAoIXRlc3QuaXNBcnJheShhKSkge1xuICAgIHJldHVybiBuZXcgRG9taW51cygpO1xuICB9XG4gIHJldHVybiBhcHBseShhKS5maWx0ZXIoZnVuY3Rpb24gKGkpIHtcbiAgICByZXR1cm4gdGVzdC5pc0VsZW1lbnQoaSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuIChhLCBjYWNoZSkge1xuICByZXR1cm4gYS5yZWR1Y2UoZnVuY3Rpb24gKGN1cnJlbnQsIGl0ZW0pIHtcbiAgICBpZiAoRG9taW51cy5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICByZXR1cm4gZmxhdHRlbihpdGVtLCBjdXJyZW50KTtcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnQuaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiBjdXJyZW50LmNvbmNhdChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnJlbnQ7XG4gIH0sIGNhY2hlIHx8IG5ldyBEb21pbnVzKCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBwbHk6IGFwcGx5LFxuICBjYXN0OiBjYXN0LFxuICBmbGF0dGVuOiBmbGF0dGVuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2VrdG9yID0gcmVxdWlyZSgnc2VrdG9yJyk7XG52YXIgRG9taW51cyA9IHJlcXVpcmUoJy4vRG9taW51cy5jdG9yJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vY29yZScpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XG52YXIgdGV4dCA9IHJlcXVpcmUoJy4vdGV4dCcpO1xudmFyIHRlc3QgPSByZXF1aXJlKCcuL3Rlc3QnKTtcbnZhciBhcGkgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIGRlbGVnYXRlcyA9IHt9O1xuXG5mdW5jdGlvbiBjYXN0Q29udGV4dCAoY29udGV4dCkge1xuICBpZiAodHlwZW9mIGNvbnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGFwaS5xcyhudWxsLCBjb250ZXh0KTtcbiAgfVxuICBpZiAodGVzdC5pc0VsZW1lbnQoY29udGV4dCkpIHtcbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuICBpZiAoY29udGV4dCBpbnN0YW5jZW9mIERvbWludXMpIHtcbiAgICByZXR1cm4gY29udGV4dFswXTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuYXBpLnFzYSA9IGZ1bmN0aW9uIChlbGVtLCBzZWxlY3Rvcikge1xuICB2YXIgcmVzdWx0cyA9IG5ldyBEb21pbnVzKCk7XG4gIHJldHVybiBzZWt0b3Ioc2VsZWN0b3IsIGNhc3RDb250ZXh0KGVsZW0pLCByZXN1bHRzKTtcbn07XG5cbmFwaS5xcyA9IGZ1bmN0aW9uIChlbGVtLCBzZWxlY3Rvcikge1xuICByZXR1cm4gYXBpLnFzYShlbGVtLCBzZWxlY3RvcilbMF07XG59O1xuXG5hcGkubWF0Y2hlcyA9IGZ1bmN0aW9uIChlbGVtLCBzZWxlY3Rvcikge1xuICByZXR1cm4gc2VrdG9yLm1hdGNoZXNTZWxlY3RvcihlbGVtLCBzZWxlY3Rvcik7XG59O1xuXG5mdW5jdGlvbiByZWxhdGVkRmFjdG9yeSAocHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gcmVsYXRlZCAoZWxlbSwgc2VsZWN0b3IpIHtcbiAgICB2YXIgcmVsYXRpdmUgPSBlbGVtW3Byb3BdO1xuICAgIGlmIChyZWxhdGl2ZSkge1xuICAgICAgaWYgKCFzZWxlY3RvciB8fCBhcGkubWF0Y2hlcyhyZWxhdGl2ZSwgc2VsZWN0b3IpKSB7XG4gICAgICAgIHJldHVybiBjb3JlLmNhc3QocmVsYXRpdmUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IERvbWludXMoKTtcbiAgfTtcbn1cblxuYXBpLnByZXYgPSByZWxhdGVkRmFjdG9yeSgncHJldmlvdXNTaWJsaW5nJyk7XG5hcGkubmV4dCA9IHJlbGF0ZWRGYWN0b3J5KCduZXh0U2libGluZycpO1xuYXBpLnBhcmVudCA9IHJlbGF0ZWRGYWN0b3J5KCdwYXJlbnRFbGVtZW50Jyk7XG5cbmZ1bmN0aW9uIG1hdGNoZXMgKGVsZW0sIHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEb21pbnVzKSB7XG4gICAgcmV0dXJuIHZhbHVlLmluZGV4T2YoZWxlbSkgIT09IC0xO1xuICB9XG4gIGlmICh0ZXN0LmlzRWxlbWVudCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZWxlbSA9PT0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIGFwaS5tYXRjaGVzKGVsZW0sIHZhbHVlKTtcbn1cblxuYXBpLnBhcmVudHMgPSBmdW5jdGlvbiAoZWxlbSwgdmFsdWUpIHtcbiAgdmFyIG5vZGVzID0gW107XG4gIHZhciBub2RlID0gZWxlbTtcbiAgd2hpbGUgKG5vZGUucGFyZW50RWxlbWVudCkge1xuICAgIGlmIChtYXRjaGVzKG5vZGUucGFyZW50RWxlbWVudCwgdmFsdWUpKSB7XG4gICAgICBub2Rlcy5wdXNoKG5vZGUucGFyZW50RWxlbWVudCk7XG4gICAgfVxuICAgIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XG4gIH1cbiAgcmV0dXJuIGNvcmUuYXBwbHkobm9kZXMpO1xufTtcblxuYXBpLmNoaWxkcmVuID0gZnVuY3Rpb24gKGVsZW0sIHZhbHVlKSB7XG4gIHZhciBub2RlcyA9IFtdO1xuICB2YXIgY2hpbGRyZW4gPSBlbGVtLmNoaWxkcmVuO1xuICB2YXIgY2hpbGQ7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgIGlmIChtYXRjaGVzKGNoaWxkLCB2YWx1ZSkpIHtcbiAgICAgIG5vZGVzLnB1c2goY2hpbGQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29yZS5hcHBseShub2Rlcyk7XG59O1xuXG4vLyB0aGlzIG1ldGhvZCBjYWNoZXMgZGVsZWdhdGVzIHNvIHRoYXQgLm9mZigpIHdvcmtzIHNlYW1sZXNzbHlcbmZ1bmN0aW9uIGRlbGVnYXRlIChyb290LCBmaWx0ZXIsIGZuKSB7XG4gIGlmIChkZWxlZ2F0ZXNbZm4uX2RkXSkge1xuICAgIHJldHVybiBkZWxlZ2F0ZXNbZm4uX2RkXTtcbiAgfVxuICBmbi5fZGQgPSBEYXRlLm5vdygpO1xuICBkZWxlZ2F0ZXNbZm4uX2RkXSA9IGRlbGVnYXRvcjtcbiAgZnVuY3Rpb24gZGVsZWdhdG9yIChlKSB7XG4gICAgdmFyIGVsZW0gPSBlLnRhcmdldDtcbiAgICB3aGlsZSAoZWxlbSAmJiBlbGVtICE9PSByb290KSB7XG4gICAgICBpZiAoYXBpLm1hdGNoZXMoZWxlbSwgZmlsdGVyKSkge1xuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyByZXR1cm47XG4gICAgICB9XG4gICAgICBlbGVtID0gZWxlbS5wYXJlbnRFbGVtZW50O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVsZWdhdG9yO1xufVxuXG5hcGkub24gPSBmdW5jdGlvbiAoZWxlbSwgdHlwZSwgZmlsdGVyLCBmbikge1xuICBpZiAoZm4gPT09IHZvaWQgMCkge1xuICAgIGV2ZW50cy5hZGQoZWxlbSwgdHlwZSwgZmlsdGVyKTsgLy8gZmlsdGVyIF9pc18gZm5cbiAgfSBlbHNlIHtcbiAgICBldmVudHMuYWRkKGVsZW0sIHR5cGUsIGRlbGVnYXRlKGVsZW0sIGZpbHRlciwgZm4pKTtcbiAgfVxufTtcblxuYXBpLm9mZiA9IGZ1bmN0aW9uIChlbGVtLCB0eXBlLCBmaWx0ZXIsIGZuKSB7XG4gIGlmIChmbiA9PT0gdm9pZCAwKSB7XG4gICAgZXZlbnRzLnJlbW92ZShlbGVtLCB0eXBlLCBmaWx0ZXIpOyAvLyBmaWx0ZXIgX2lzXyBmblxuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5yZW1vdmUoZWxlbSwgdHlwZSwgZGVsZWdhdGUoZWxlbSwgZmlsdGVyLCBmbikpO1xuICB9XG59O1xuXG5hcGkuaHRtbCA9IGZ1bmN0aW9uIChlbGVtLCBodG1sKSB7XG4gIHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMjtcbiAgaWYgKGdldHRlcikge1xuICAgIHJldHVybiBlbGVtLmlubmVySFRNTDtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLmlubmVySFRNTCA9IGh0bWw7XG4gIH1cbn07XG5cbmFwaS50ZXh0ID0gZnVuY3Rpb24gKGVsZW0sIHRleHQpIHtcbiAgdmFyIGNoZWNrYWJsZSA9IHRlc3QuaXNDaGVja2FibGUoZWxlbSk7XG4gIHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMjtcbiAgaWYgKGdldHRlcikge1xuICAgIHJldHVybiBjaGVja2FibGUgPyBlbGVtLnZhbHVlIDogZWxlbS5pbm5lclRleHQgfHwgZWxlbS50ZXh0Q29udGVudDtcbiAgfSBlbHNlIGlmIChjaGVja2FibGUpIHtcbiAgICBlbGVtLnZhbHVlID0gdGV4dDtcbiAgfSBlbHNlIHtcbiAgICBlbGVtLmlubmVyVGV4dCA9IGVsZW0udGV4dENvbnRlbnQgPSB0ZXh0O1xuICB9XG59O1xuXG5hcGkudmFsdWUgPSBmdW5jdGlvbiAoZWxlbSwgdmFsdWUpIHtcbiAgdmFyIGNoZWNrYWJsZSA9IHRlc3QuaXNDaGVja2FibGUoZWxlbSk7XG4gIHZhciBnZXR0ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMjtcbiAgaWYgKGdldHRlcikge1xuICAgIHJldHVybiBjaGVja2FibGUgPyBlbGVtLmNoZWNrZWQgOiBlbGVtLnZhbHVlO1xuICB9IGVsc2UgaWYgKGNoZWNrYWJsZSkge1xuICAgIGVsZW0uY2hlY2tlZCA9IHZhbHVlO1xuICB9IGVsc2Uge1xuICAgIGVsZW0udmFsdWUgPSB2YWx1ZTtcbiAgfVxufTtcblxuYXBpLmF0dHIgPSBmdW5jdGlvbiAoZWxlbSwgbmFtZSwgdmFsdWUpIHtcbiAgdmFyIGdldHRlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzO1xuICB2YXIgY2FtZWwgPSB0ZXh0Lmh5cGhlblRvQ2FtZWwobmFtZSk7XG4gIGlmIChnZXR0ZXIpIHtcbiAgICBpZiAoY2FtZWwgaW4gZWxlbSkge1xuICAgICAgcmV0dXJuIGVsZW1bY2FtZWxdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICBpZiAoY2FtZWwgaW4gZWxlbSkge1xuICAgIGVsZW1bY2FtZWxdID0gdmFsdWU7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHZvaWQgMCkge1xuICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9IGVsc2Uge1xuICAgIGVsZW0uc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgfVxufTtcblxuYXBpLm1ha2UgPSBmdW5jdGlvbiAodHlwZSkge1xuICByZXR1cm4gbmV3IERvbWludXMoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKSk7XG59O1xuXG5hcGkuY2xvbmUgPSBmdW5jdGlvbiAoZWxlbSkge1xuICByZXR1cm4gZWxlbS5jbG9uZU5vZGUodHJ1ZSk7XG59O1xuXG5hcGkucmVtb3ZlID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgaWYgKGVsZW0ucGFyZW50RWxlbWVudCkge1xuICAgIGVsZW0ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChlbGVtKTtcbiAgfVxufTtcblxuYXBpLmFwcGVuZCA9IGZ1bmN0aW9uIChlbGVtLCB0YXJnZXQpIHtcbiAgaWYgKG1hbmlwdWxhdGlvbkd1YXJkKGVsZW0sIHRhcmdldCwgYXBpLmFwcGVuZCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZWxlbS5hcHBlbmRDaGlsZCh0YXJnZXQpO1xufTtcblxuYXBpLnByZXBlbmQgPSBmdW5jdGlvbiAoZWxlbSwgdGFyZ2V0KSB7XG4gIGlmIChtYW5pcHVsYXRpb25HdWFyZChlbGVtLCB0YXJnZXQsIGFwaS5wcmVwZW5kKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBlbGVtLmluc2VydEJlZm9yZSh0YXJnZXQsIGVsZW0uZmlyc3RDaGlsZCk7XG59O1xuXG5hcGkuYmVmb3JlID0gZnVuY3Rpb24gKGVsZW0sIHRhcmdldCkge1xuICBpZiAobWFuaXB1bGF0aW9uR3VhcmQoZWxlbSwgdGFyZ2V0LCBhcGkuYmVmb3JlKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZWxlbS5wYXJlbnRFbGVtZW50KSB7XG4gICAgZWxlbS5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZSh0YXJnZXQsIGVsZW0pO1xuICB9XG59O1xuXG5hcGkuYWZ0ZXIgPSBmdW5jdGlvbiAoZWxlbSwgdGFyZ2V0KSB7XG4gIGlmIChtYW5pcHVsYXRpb25HdWFyZChlbGVtLCB0YXJnZXQsIGFwaS5hZnRlcikpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGVsZW0ucGFyZW50RWxlbWVudCkge1xuICAgIGVsZW0ucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGFyZ2V0LCBlbGVtLm5leHRTaWJsaW5nKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gbWFuaXB1bGF0aW9uR3VhcmQgKGVsZW0sIHRhcmdldCwgZm4pIHtcbiAgdmFyIHJpZ2h0ID0gdGFyZ2V0IGluc3RhbmNlb2YgRG9taW51cztcbiAgdmFyIGxlZnQgPSBlbGVtIGluc3RhbmNlb2YgRG9taW51cztcbiAgaWYgKGxlZnQpIHtcbiAgICBlbGVtLmZvckVhY2gobWFuaXB1bGF0ZU1hbnkpO1xuICB9IGVsc2UgaWYgKHJpZ2h0KSB7XG4gICAgbWFuaXB1bGF0ZShlbGVtLCB0cnVlKTtcbiAgfVxuICByZXR1cm4gbGVmdCB8fCByaWdodDtcblxuICBmdW5jdGlvbiBtYW5pcHVsYXRlIChlbGVtLCBwcmVjb25kaXRpb24pIHtcbiAgICBpZiAocmlnaHQpIHtcbiAgICAgIHRhcmdldC5mb3JFYWNoKGZ1bmN0aW9uICh0YXJnZXQsIGopIHtcbiAgICAgICAgZm4oZWxlbSwgY2xvbmVVbmxlc3ModGFyZ2V0LCBwcmVjb25kaXRpb24gJiYgaiA9PT0gMCkpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZuKGVsZW0sIGNsb25lVW5sZXNzKHRhcmdldCwgcHJlY29uZGl0aW9uKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbWFuaXB1bGF0ZU1hbnkgKGVsZW0sIGkpIHtcbiAgICBtYW5pcHVsYXRlKGVsZW0sIGkgPT09IDApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzICh0YXJnZXQsIGNvbmRpdGlvbikge1xuICByZXR1cm4gY29uZGl0aW9uID8gdGFyZ2V0IDogYXBpLmNsb25lKHRhcmdldCk7XG59XG5cblsnYXBwZW5kVG8nLCAncHJlcGVuZFRvJywgJ2JlZm9yZU9mJywgJ2FmdGVyT2YnXS5mb3JFYWNoKGZsaXApO1xuXG5mdW5jdGlvbiBmbGlwIChrZXkpIHtcbiAgdmFyIG9yaWdpbmFsID0ga2V5LnNwbGl0KC9bQS1aXS8pWzBdO1xuICBhcGlba2V5XSA9IGZ1bmN0aW9uIChlbGVtLCB0YXJnZXQpIHtcbiAgICBhcGlbb3JpZ2luYWxdKHRhcmdldCwgZWxlbSk7XG4gIH07XG59XG5cbmFwaS5zaG93ID0gZnVuY3Rpb24gKGVsZW0sIHNob3VsZCwgaW52ZXJ0KSB7XG4gIGlmIChlbGVtIGluc3RhbmNlb2YgRG9taW51cykge1xuICAgIGVsZW0uZm9yRWFjaChzaG93VGVzdCk7XG4gIH0gZWxzZSB7XG4gICAgc2hvd1Rlc3QoZWxlbSk7XG4gIH1cblxuICBmdW5jdGlvbiBzaG93VGVzdCAoY3VycmVudCkge1xuICAgIHZhciBvayA9IHNob3VsZCA9PT0gdm9pZCAwIHx8IHNob3VsZCA9PT0gdHJ1ZSB8fCB0eXBlb2Ygc2hvdWxkID09PSAnZnVuY3Rpb24nICYmIHNob3VsZC5jYWxsKGN1cnJlbnQpO1xuICAgIGRpc3BsYXkoY3VycmVudCwgaW52ZXJ0ID8gIW9rIDogb2spO1xuICB9XG59O1xuXG5hcGkuaGlkZSA9IGZ1bmN0aW9uIChlbGVtLCBzaG91bGQpIHtcbiAgYXBpLnNob3coZWxlbSwgc2hvdWxkLCB0cnVlKTtcbn07XG5cbmZ1bmN0aW9uIGRpc3BsYXkgKGVsZW0sIHNob3VsZCkge1xuICBpZiAoc2hvdWxkKSB7XG4gICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSBlbHNlIHtcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL0RvbWludXMucHJvdG90eXBlJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhZGRFdmVudCA9IGFkZEV2ZW50RWFzeTtcbnZhciByZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50RWFzeTtcbnZhciBoYXJkQ2FjaGUgPSBbXTtcblxuaWYgKCF3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICBhZGRFdmVudCA9IGFkZEV2ZW50SGFyZDtcbn1cblxuaWYgKCF3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICByZW1vdmVFdmVudCA9IHJlbW92ZUV2ZW50SGFyZDtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRFYXN5IChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHJldHVybiBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBmbik7XG59XG5cbmZ1bmN0aW9uIGFkZEV2ZW50SGFyZCAoZWxlbWVudCwgZXZ0LCBmbikge1xuICByZXR1cm4gZWxlbWVudC5hdHRhY2hFdmVudCgnb24nICsgZXZ0LCB3cmFwKGVsZW1lbnQsIGV2dCwgZm4pKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRFYXN5IChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHJldHVybiBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmbik7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50SGFyZCAoZWxlbWVudCwgZXZ0LCBmbikge1xuICByZXR1cm4gZWxlbWVudC5kZXRhY2hFdmVudCgnb24nICsgZXZ0LCB1bndyYXAoZWxlbWVudCwgZXZ0LCBmbikpO1xufVxuXG5mdW5jdGlvbiB3cmFwcGVyRmFjdG9yeSAoZWxlbWVudCwgZXZ0LCBmbikge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlciAob3JpZ2luYWxFdmVudCkge1xuICAgIHZhciBlID0gb3JpZ2luYWxFdmVudCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgZS50YXJnZXQgPSBlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQ7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCAgPSBlLnByZXZlbnREZWZhdWx0ICB8fCBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdCAoKSB7IGUucmV0dXJuVmFsdWUgPSBmYWxzZTsgfTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbiA9IGUuc3RvcFByb3BhZ2F0aW9uIHx8IGZ1bmN0aW9uIHN0b3BQcm9wYWdhdGlvbiAoKSB7IGUuY2FuY2VsQnViYmxlID0gdHJ1ZTsgfTtcbiAgICBmbi5jYWxsKGVsZW1lbnQsIGUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwIChlbGVtZW50LCBldnQsIGZuKSB7XG4gIHZhciB3cmFwcGVyID0gdW53cmFwKGVsZW1lbnQsIGV2dCwgZm4pIHx8IHdyYXBwZXJGYWN0b3J5KGVsZW1lbnQsIGV2dCwgZm4pO1xuICBoYXJkQ2FjaGUucHVzaCh7XG4gICAgd3JhcHBlcjogd3JhcHBlcixcbiAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgIGV2dDogZXZ0LFxuICAgIGZuOiBmblxuICB9KTtcbiAgcmV0dXJuIHdyYXBwZXI7XG59XG5cbmZ1bmN0aW9uIHVud3JhcCAoZWxlbWVudCwgZXZ0LCBmbikge1xuICB2YXIgaSA9IGZpbmQoZWxlbWVudCwgZXZ0LCBmbik7XG4gIGlmIChpKSB7XG4gICAgdmFyIHdyYXBwZXIgPSBoYXJkQ2FjaGVbaV0ud3JhcHBlcjtcbiAgICBoYXJkQ2FjaGUuc3BsaWNlKGksIDEpOyAvLyBmcmVlIHVwIGEgdGFkIG9mIG1lbW9yeVxuICAgIHJldHVybiB3cmFwcGVyO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmQgKGVsZW1lbnQsIGV2dCwgZm4pIHtcbiAgdmFyIGksIGl0ZW07XG4gIGZvciAoaSA9IDA7IGkgPCBoYXJkQ2FjaGUubGVuZ3RoOyBpKyspIHtcbiAgICBpdGVtID0gaGFyZENhY2hlW2ldO1xuICAgIGlmIChpdGVtLmVsZW1lbnQgPT09IGVsZW1lbnQgJiYgaXRlbS5ldnQgPT09IGV2dCAmJiBpdGVtLmZuID09PSBmbikge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhZGQ6IGFkZEV2ZW50LFxuICByZW1vdmU6IHJlbW92ZUV2ZW50XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9tID0gcmVxdWlyZSgnLi9kb20nKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9jb3JlJyk7XG52YXIgRG9taW51cyA9IHJlcXVpcmUoJy4vRG9taW51cy5jdG9yJyk7XG52YXIgdGFnID0gL15cXHMqPChbYS16XSsoPzotW2Etel0rKT8pXFxzKlxcLz8+XFxzKiQvaTtcblxuZnVuY3Rpb24gYXBpIChzZWxlY3RvciwgY29udGV4dCkge1xuICB2YXIgbm90VGV4dCA9IHR5cGVvZiBzZWxlY3RvciAhPT0gJ3N0cmluZyc7XG4gIGlmIChub3RUZXh0ICYmIGFyZ3VtZW50cy5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIGNvcmUuY2FzdChzZWxlY3Rvcik7XG4gIH1cbiAgaWYgKG5vdFRleHQpIHtcbiAgICByZXR1cm4gbmV3IERvbWludXMoKTtcbiAgfVxuICB2YXIgbWF0Y2hlcyA9IHNlbGVjdG9yLm1hdGNoKHRhZyk7XG4gIGlmIChtYXRjaGVzKSB7XG4gICAgcmV0dXJuIGRvbS5tYWtlKG1hdGNoZXNbMV0pO1xuICB9XG4gIHJldHVybiBhcGkuZmluZChzZWxlY3RvciwgY29udGV4dCk7XG59XG5cbmFwaS5maW5kID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gIHJldHVybiBkb20ucXNhKGNvbnRleHQsIHNlbGVjdG9yKTtcbn07XG5cbmFwaS5maW5kT25lID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gIHJldHVybiBkb20ucXMoY29udGV4dCwgc2VsZWN0b3IpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcGk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBub2RlT2JqZWN0cyA9IHR5cGVvZiBOb2RlID09PSAnb2JqZWN0JztcbnZhciBlbGVtZW50T2JqZWN0cyA9IHR5cGVvZiBIVE1MRWxlbWVudCA9PT0gJ29iamVjdCc7XG5cbmZ1bmN0aW9uIGlzTm9kZSAobykge1xuICByZXR1cm4gbm9kZU9iamVjdHMgPyBvIGluc3RhbmNlb2YgTm9kZSA6IGlzTm9kZU9iamVjdChvKTtcbn1cblxuZnVuY3Rpb24gaXNOb2RlT2JqZWN0IChvKSB7XG4gIHJldHVybiBvICYmXG4gICAgdHlwZW9mIG8gPT09ICdvYmplY3QnICYmXG4gICAgdHlwZW9mIG8ubm9kZU5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgdHlwZW9mIG8ubm9kZVR5cGUgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc0VsZW1lbnQgKG8pIHtcbiAgcmV0dXJuIGVsZW1lbnRPYmplY3RzID8gbyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IDogaXNFbGVtZW50T2JqZWN0KG8pO1xufVxuXG5mdW5jdGlvbiBpc0VsZW1lbnRPYmplY3QgKG8pIHtcbiAgcmV0dXJuIG8gJiZcbiAgICB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2Ygby5ub2RlTmFtZSA9PT0gJ3N0cmluZycgJiZcbiAgICBvLm5vZGVUeXBlID09PSAxO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5IChhKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmZ1bmN0aW9uIGlzQ2hlY2thYmxlIChlbGVtKSB7XG4gIHJldHVybiAnY2hlY2tlZCcgaW4gZWxlbSAmJiBlbGVtLnR5cGUgPT09ICdyYWRpbycgfHwgZWxlbS50eXBlID09PSAnY2hlY2tib3gnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaXNOb2RlOiBpc05vZGUsXG4gIGlzRWxlbWVudDogaXNFbGVtZW50LFxuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0NoZWNrYWJsZTogaXNDaGVja2FibGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIGh5cGhlblRvQ2FtZWwgKGh5cGhlbnMpIHtcbiAgdmFyIHBhcnQgPSAvLShbYS16XSkvZztcbiAgcmV0dXJuIGh5cGhlbnMucmVwbGFjZShwYXJ0LCBmdW5jdGlvbiAoZywgbSkge1xuICAgIHJldHVybiBtLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaHlwaGVuVG9DYW1lbDogaHlwaGVuVG9DYW1lbFxufTtcbiIsIi8qKlxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBtb2Rlcm4gZXhwb3J0cz1cIm5wbVwiIC1vIC4vbnBtL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCdsb2Rhc2guZGVib3VuY2UnKSxcbiAgICBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnbG9kYXNoLmlzZnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC5pc29iamVjdCcpO1xuXG4vKiogVXNlZCBhcyBhbiBpbnRlcm5hbCBgXy5kZWJvdW5jZWAgb3B0aW9ucyBvYmplY3QgKi9cbnZhciBkZWJvdW5jZU9wdGlvbnMgPSB7XG4gICdsZWFkaW5nJzogZmFsc2UsXG4gICdtYXhXYWl0JzogMCxcbiAgJ3RyYWlsaW5nJzogZmFsc2Vcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gZXhlY3V0ZWQsIHdpbGwgb25seSBjYWxsIHRoZSBgZnVuY2AgZnVuY3Rpb25cbiAqIGF0IG1vc3Qgb25jZSBwZXIgZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gUHJvdmlkZSBhbiBvcHRpb25zIG9iamVjdCB0b1xuICogaW5kaWNhdGUgdGhhdCBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2VcbiAqIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGxcbiAqIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBjYWxsLlxuICpcbiAqIE5vdGU6IElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAgYGZ1bmNgIHdpbGwgYmUgY2FsbGVkXG4gKiBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGlzXG4gKiBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBGdW5jdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IHdhaXQgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgZXhlY3V0aW9ucyB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBhdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nXG4gKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKTtcbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIGV4ZWN1dGUgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlc1xuICogalF1ZXJ5KCcuaW50ZXJhY3RpdmUnKS5vbignY2xpY2snLCBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwge1xuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAoIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICB9XG4gIGlmIChvcHRpb25zID09PSBmYWxzZSkge1xuICAgIGxlYWRpbmcgPSBmYWxzZTtcbiAgfSBlbHNlIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAnbGVhZGluZycgaW4gb3B0aW9ucyA/IG9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyBvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgZGVib3VuY2VPcHRpb25zLmxlYWRpbmcgPSBsZWFkaW5nO1xuICBkZWJvdW5jZU9wdGlvbnMubWF4V2FpdCA9IHdhaXQ7XG4gIGRlYm91bmNlT3B0aW9ucy50cmFpbGluZyA9IHRyYWlsaW5nO1xuXG4gIHJldHVybiBkZWJvdW5jZShmdW5jLCB3YWl0LCBkZWJvdW5jZU9wdGlvbnMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwiLyoqXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIG1vZGVybiBleHBvcnRzPVwibnBtXCIgLW8gLi9ucG0vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnbG9kYXNoLmlzZnVuY3Rpb24nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJ2xvZGFzaC5pc29iamVjdCcpLFxuICAgIG5vdyA9IHJlcXVpcmUoJ2xvZGFzaC5ub3cnKTtcblxuLyogTmF0aXZlIG1ldGhvZCBzaG9ydGN1dHMgZm9yIG1ldGhvZHMgd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMgKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGRlbGF5IHRoZSBleGVjdXRpb24gb2YgYGZ1bmNgIHVudGlsIGFmdGVyXG4gKiBgd2FpdGAgbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIGl0IHdhcyBpbnZva2VkLlxuICogUHJvdmlkZSBhbiBvcHRpb25zIG9iamVjdCB0byBpbmRpY2F0ZSB0aGF0IGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvblxuICogdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBTdWJzZXF1ZW50IGNhbGxzXG4gKiB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGNhbGwuXG4gKlxuICogTm90ZTogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCBgZnVuY2Agd2lsbCBiZSBjYWxsZWRcbiAqIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gaXNcbiAqIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IEZ1bmN0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gd2FpdCBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXSBTcGVjaWZ5IGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBjYWxsZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdIFNwZWNpZnkgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBhdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4XG4gKiB2YXIgbGF6eUxheW91dCA9IF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApO1xuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIGxhenlMYXlvdXQpO1xuICpcbiAqIC8vIGV4ZWN1dGUgYHNlbmRNYWlsYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzXG4gKiBqUXVlcnkoJyNwb3N0Ym94Jykub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pO1xuICpcbiAqIC8vIGVuc3VyZSBgYmF0Y2hMb2dgIGlzIGV4ZWN1dGVkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzXG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBzb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwge1xuICogICAnbWF4V2FpdCc6IDEwMDBcbiAqIH0sIGZhbHNlKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgYXJncyxcbiAgICAgIG1heFRpbWVvdXRJZCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHN0YW1wLFxuICAgICAgdGhpc0FyZyxcbiAgICAgIHRpbWVvdXRJZCxcbiAgICAgIHRyYWlsaW5nQ2FsbCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwLFxuICAgICAgbWF4V2FpdCA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICghaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gIH1cbiAgd2FpdCA9IG5hdGl2ZU1heCgwLCB3YWl0KSB8fCAwO1xuICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgIHZhciBsZWFkaW5nID0gdHJ1ZTtcbiAgICB0cmFpbGluZyA9IGZhbHNlO1xuICB9IGVsc2UgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9IG9wdGlvbnMubGVhZGluZztcbiAgICBtYXhXYWl0ID0gJ21heFdhaXQnIGluIG9wdGlvbnMgJiYgKG5hdGl2ZU1heCh3YWl0LCBvcHRpb25zLm1heFdhaXQpIHx8IDApO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG4gIHZhciBkZWxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93KCkgLSBzdGFtcCk7XG4gICAgaWYgKHJlbWFpbmluZyA8PSAwKSB7XG4gICAgICBpZiAobWF4VGltZW91dElkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChtYXhUaW1lb3V0SWQpO1xuICAgICAgfVxuICAgICAgdmFyIGlzQ2FsbGVkID0gdHJhaWxpbmdDYWxsO1xuICAgICAgbWF4VGltZW91dElkID0gdGltZW91dElkID0gdHJhaWxpbmdDYWxsID0gdW5kZWZpbmVkO1xuICAgICAgaWYgKGlzQ2FsbGVkKSB7XG4gICAgICAgIGxhc3RDYWxsZWQgPSBub3coKTtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgaWYgKCF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgICAgIGFyZ3MgPSB0aGlzQXJnID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHJlbWFpbmluZyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBtYXhEZWxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfVxuICAgIG1heFRpbWVvdXRJZCA9IHRpbWVvdXRJZCA9IHRyYWlsaW5nQ2FsbCA9IHVuZGVmaW5lZDtcbiAgICBpZiAodHJhaWxpbmcgfHwgKG1heFdhaXQgIT09IHdhaXQpKSB7XG4gICAgICBsYXN0Q2FsbGVkID0gbm93KCk7XG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgaWYgKCF0aW1lb3V0SWQgJiYgIW1heFRpbWVvdXRJZCkge1xuICAgICAgICBhcmdzID0gdGhpc0FyZyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHN0YW1wID0gbm93KCk7XG4gICAgdGhpc0FyZyA9IHRoaXM7XG4gICAgdHJhaWxpbmdDYWxsID0gdHJhaWxpbmcgJiYgKHRpbWVvdXRJZCB8fCAhbGVhZGluZyk7XG5cbiAgICBpZiAobWF4V2FpdCA9PT0gZmFsc2UpIHtcbiAgICAgIHZhciBsZWFkaW5nQ2FsbCA9IGxlYWRpbmcgJiYgIXRpbWVvdXRJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFtYXhUaW1lb3V0SWQgJiYgIWxlYWRpbmcpIHtcbiAgICAgICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgICAgfVxuICAgICAgdmFyIHJlbWFpbmluZyA9IG1heFdhaXQgLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKSxcbiAgICAgICAgICBpc0NhbGxlZCA9IHJlbWFpbmluZyA8PSAwO1xuXG4gICAgICBpZiAoaXNDYWxsZWQpIHtcbiAgICAgICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgICAgIG1heFRpbWVvdXRJZCA9IGNsZWFyVGltZW91dChtYXhUaW1lb3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgbWF4VGltZW91dElkID0gc2V0VGltZW91dChtYXhEZWxheWVkLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNDYWxsZWQgJiYgdGltZW91dElkKSB7XG4gICAgICB0aW1lb3V0SWQgPSBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXRpbWVvdXRJZCAmJiB3YWl0ICE9PSBtYXhXYWl0KSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHdhaXQpO1xuICAgIH1cbiAgICBpZiAobGVhZGluZ0NhbGwpIHtcbiAgICAgIGlzQ2FsbGVkID0gdHJ1ZTtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgfVxuICAgIGlmIChpc0NhbGxlZCAmJiAhdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgIGFyZ3MgPSB0aGlzQXJnID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKlxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBtb2Rlcm4gZXhwb3J0cz1cIm5wbVwiIC1vIC4vbnBtL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgaXNOYXRpdmUgPSByZXF1aXJlKCdsb2Rhc2guX2lzbmF0aXZlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgVW5peCBlcG9jaFxuICogKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHN0YW1wID0gXy5ub3coKTtcbiAqIF8uZGVmZXIoZnVuY3Rpb24oKSB7IGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7IH0pO1xuICogLy8gPT4gbG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgZnVuY3Rpb24gdG8gYmUgY2FsbGVkXG4gKi9cbnZhciBub3cgPSBpc05hdGl2ZShub3cgPSBEYXRlLm5vdykgJiYgbm93IHx8IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcbiIsIi8qKlxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBtb2Rlcm4gZXhwb3J0cz1cIm5wbVwiIC1vIC4vbnBtL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIFtbQ2xhc3NdXSBvZiB2YWx1ZXMgKi9cbnZhciB0b1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlICovXG52YXIgcmVOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgU3RyaW5nKHRvU3RyaW5nKVxuICAgIC5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpXG4gICAgLnJlcGxhY2UoL3RvU3RyaW5nfCBmb3IgW15cXF1dKy9nLCAnLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyAmJiByZU5hdGl2ZS50ZXN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05hdGl2ZTtcbiIsIi8qKlxuICogTG8tRGFzaCAyLjQuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cDovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBtb2Rlcm4gZXhwb3J0cz1cIm5wbVwiIC1vIC4vbnBtL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdHNcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIG1vZGVybiBleHBvcnRzPVwibnBtXCIgLW8gLi9ucG0vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBvYmplY3RUeXBlcyA9IHJlcXVpcmUoJ2xvZGFzaC5fb2JqZWN0dHlwZXMnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgbGFuZ3VhZ2UgdHlwZSBvZiBPYmplY3QuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdHNcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIGNoZWNrIGlmIHRoZSB2YWx1ZSBpcyB0aGUgRUNNQVNjcmlwdCBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdFxuICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDhcbiAgLy8gYW5kIGF2b2lkIGEgVjggYnVnXG4gIC8vIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTFcbiAgcmV0dXJuICEhKHZhbHVlICYmIG9iamVjdFR5cGVzW3R5cGVvZiB2YWx1ZV0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBMby1EYXNoIDIuNC4xIChDdXN0b20gQnVpbGQpIDxodHRwOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIG1vZGVybiBleHBvcnRzPVwibnBtXCIgLW8gLi9ucG0vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxMyBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS41LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDEzIEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHA6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgT2JqZWN0ICovXG52YXIgb2JqZWN0VHlwZXMgPSB7XG4gICdib29sZWFuJzogZmFsc2UsXG4gICdmdW5jdGlvbic6IHRydWUsXG4gICdvYmplY3QnOiB0cnVlLFxuICAnbnVtYmVyJzogZmFsc2UsXG4gICdzdHJpbmcnOiBmYWxzZSxcbiAgJ3VuZGVmaW5lZCc6IGZhbHNlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFR5cGVzO1xuIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgaW5jdWJhdGUgPSByZXF1aXJlKCcuL2luY3ViYXRlJyk7XG52YXIgbnBjcyA9IHJlcXVpcmUoJy4vbnBjcycpO1xudmFyIG1vYiA9IHJlcXVpcmUoJy4vbW9iJyk7XG52YXIgYXVkaW8gPSByZXF1aXJlKCcuL2F1ZGlvJyk7XG52YXIgZW1pdHRlciA9IHJlcXVpcmUoJy4vZW1pdHRlcicpO1xudmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xudmFyIGJhYm9vbiA9IHJlcXVpcmUoJy4vYWkvYmFib29uJyk7XG5cbmVtaXR0ZXIub24oJ21vYi5sZXZlbGNoYW5nZScsIGZ1bmN0aW9uICh3aG8sIGwsIG9sZCkge1xuICBpZiAod2hvLm5wYykge1xuICAgIGlmIChsID4gb2xkKSB7XG4gICAgICBhdWRpby5wbGF5KCducGMtZ3JvdycpO1xuICAgIH0gZWxzZSBpZiAobCA8IG9sZCkge1xuICAgICAgYXVkaW8ucGxheSgnbnBjLXNocmluaycpO1xuICAgIH1cbiAgfVxufSk7XG5cbmZ1bmN0aW9uIG5wYyAoZW5lbXksIG9wdGlvbnMpIHtcbiAgdmFyIG8gPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgbGV2ZWwgPSBvLmxldmVsIHx8IDA7XG4gIHZhciBub2RlID0gaW5jdWJhdGUoKTtcbiAgdmFyIG0gPSBtb2Iobm9kZSwgeyBsZXZlbDogbGV2ZWwsIHR5cGU6ICducGMnIH0pO1xuICB2YXIgbWUgPSB7XG4gICAgbm9kZTogbm9kZSxcbiAgICBtb2I6IG1cbiAgfTtcbiAgdmFyIGxhcmdlc3RMZXZlbCA9IGxldmVsO1xuICB2YXIgbWV0cmljcyA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ25wYy1tZXRyaWNzJyk7XG4gIHZhciBsaWZlYmFyID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnbnBjLWxpZmUnKS5hcHBlbmRUbyhtZXRyaWNzKTtcbiAgbm9kZS5maW5kKCcucGMtY3ViZScpLmFkZENsYXNzKCdwYy1zbW9vdGggcGMtc2hvdycpO1xuICBub2RlLmFwcGVuZChtZXRyaWNzKTtcbiAgbS5ucGMgPSBtZTtcbiAgbS5wbGFjZW1lbnQoKTtcblxuICBlbWl0dGVyLm9uKCdtb2IucmVtb3ZlJywgZnVuY3Rpb24gcm0gKHdobykge1xuICAgIGlmICh3aG8gPT09IG0pIHtcbiAgICAgIGVtaXR0ZXIub2ZmKCdtb2IucmVtb3ZlJywgcm0pO1xuICAgICAgbnBjcy5zcGxpY2UobnBjcy5pbmRleE9mKG1lKSwgMSk7XG4gICAgICBhdWRpby5wbGF5KCducGMtZGllJyk7XG4gICAgICBpZiAobS5jbGVhciAhPT0gdHJ1ZSkge1xuICAgICAgICBlbWl0dGVyLmVtaXQoJ25wYy5raWxsJywgbnBjcy5sZW5ndGggPT09IDAsIG0ubGV2ZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgKG8uYWkgfHwgYmFib29uKShtZSwgZW5lbXkpO1xuICBucGNzLnB1c2gobWUpO1xuXG4gIHJldHVybiBtZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBucGM7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgbnBjcyA9IFtdO1xuXG5mdW5jdGlvbiBjbGVhciAoKSB7XG4gIHZhciBucGM7XG4gIHdoaWxlICgobnBjID0gbnBjcy5zaGlmdCgpKSkge1xuICAgIG5wYy5tb2IuY2xlYXIgPSB0cnVlO1xuICAgIG5wYy5tb2IucmVtb3ZlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdGljayAoKSB7XG4gIG5wY3MuZm9yRWFjaChmdW5jdGlvbiAobnBjKSB7XG4gICAgbnBjLnRoaW5rKCk7XG4gIH0pO1xufVxuXG5ucGNzLmNsZWFyID0gY2xlYXI7XG5ucGNzLnRpY2sgPSB0aWNrO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5jdWJlLm5wYyA9IG5wY3M7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyICQgPSByZXF1aXJlKCdkb21pbnVzJyk7XG52YXIgaW5jdWJhdGUgPSByZXF1aXJlKCcuL2luY3ViYXRlJyk7XG52YXIgcG93cyA9IHJlcXVpcmUoJy4vcG93ZXJ1cHMnKTtcbnZhciBtb2IgPSByZXF1aXJlKCcuL21vYicpO1xudmFyIHVzID0gcmVxdWlyZSgnLi91cycpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcbnZhciBsaWZlc2F2ZXIgPSByZXF1aXJlKCcuL3Bvd2VydXBzL2xpZmVzYXZlcicpO1xuXG5mdW5jdGlvbiBwb3cgKHBsYXllciwgb3B0aW9ucykge1xuICB2YXIgbyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBsZXZlbCA9IG8ubGV2ZWwgfHwgMDtcbiAgdmFyIG5vZGUgPSBpbmN1YmF0ZSgpO1xuICB2YXIgbSA9IG1vYihub2RlLCB7IGxldmVsOiBsZXZlbCwgdHlwZTogJ3BvdycgfSk7XG4gIHZhciBtZSA9IHtcbiAgICBub2RlOiBub2RlLFxuICAgIG1vYjogbVxuICB9O1xuICB2YXIgZWZmZWN0ID0gby5lZmZlY3QgfHwgbGlmZXNhdmVyKDEpO1xuICBub2RlLmZpbmQoJy5wYy1jdWJlJykuYWRkQ2xhc3MoJ3BjLXNtb290aCBwYy1zaG93Jyk7XG4gIG0ucG93ID0gbWU7XG4gIG0ucGxhY2VtZW50KCk7XG5cbiAgZW1pdHRlci5vbignbW9iLnJlbW92ZScsIGZ1bmN0aW9uIHJtICh3aG8pIHtcbiAgICBpZiAod2hvID09PSBtKSB7XG4gICAgICBlbWl0dGVyLm9mZignbW9iLnJlbW92ZScsIHJtKTtcbiAgICAgIHBvd3Muc3BsaWNlKHBvd3MuaW5kZXhPZihtZSksIDEpO1xuICAgICAgaWYgKG1lLmNsZWFudXAgIT09IHRydWUpIHtcbiAgICAgICAgZWZmZWN0KHBsYXllciwgbWUpO1xuICAgICAgICBlbWl0dGVyLmVtaXQoJ3Bvdy51c2UnLCBtLmxldmVsKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHdvcmR1cCAoZmFjZSkge1xuICAgIGZhY2UuaW5uZXJUZXh0ID0gdXMucihlZmZlY3Qud29yZHMpO1xuICB9XG5cbiAgbm9kZS5maW5kKCcucGMtZmFjZScpLmZvckVhY2god29yZHVwKTtcbiAgcG93cy5wdXNoKG1lKTtcblxuICByZXR1cm4gbWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcG93O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIHBvd2VydXBzID0gW107XG5cbmZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgdmFyIHBvdztcbiAgd2hpbGUgKChwb3cgPSBwb3dlcnVwcy5zaGlmdCgpKSkge1xuICAgIHBvdy5jbGVhbnVwID0gdHJ1ZTtcbiAgICBwb3cubm9kZS5yZW1vdmUoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbC5jdWJlLnBvd2VydXAgPSBwb3dlcnVwcztcblxucG93ZXJ1cHMuY2xlYXIgPSBjbGVhcjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcbnZhciBucGNzID0gcmVxdWlyZSgnLi4vbnBjcycpO1xudmFyIG5wYyA9IHJlcXVpcmUoJy4uL25wYycpO1xudmFyIGFpbWVyID0gcmVxdWlyZSgnLi4vYWkvYWltZXInKTtcbnZhciBidWxsZXQgPSByZXF1aXJlKCcuLi9idWxsZXQnKTtcbnZhciBwb3dlcnVwID0gcmVxdWlyZSgnLi4vcG93ZXJ1cCcpO1xudmFyIGF1ZGlvID0gcmVxdWlyZSgnLi4vYXVkaW8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBidWxsZXRyYWluIChsZXZlbCkge1xuICBmdW5jdGlvbiBlZmZlY3QgKHBsYXllcikge1xuICAgIGZpcmUoMCwgLTEpO1xuICAgIGZpcmUoMCwgMSk7XG4gICAgZmlyZSgxLCAxKTtcbiAgICBmaXJlKDEsIDApO1xuICAgIGZpcmUoMSwgLTEpO1xuICAgIGZpcmUoLTEsIC0xKTtcbiAgICBmaXJlKC0xLCAxKTtcbiAgICBmaXJlKC0xLCAwKTtcblxuICAgIGZ1bmN0aW9uIGZpcmUgKHgsIHkpIHtcbiAgICAgIGJ1bGxldChwbGF5ZXIsIHsgbGV2ZWw6IGxldmVsLCBkaXk6IHsgZHg6IHgsIGR5OiB5IH0sIGF1ZGlvOiBmYWxzZSB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzb3VuZCAoKSB7XG4gICAgICBhdWRpby5wbGF5KCdidWxsZXRyYWluJyk7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dChzb3VuZCwgNTApO1xuICB9XG5cbiAgZWZmZWN0LndvcmRzID0gWydCVUxMRVRSQUlOIScsICdUUkFJTiBPRiBCVUxMRVRTLicsICdZRVMhJywgJ0JFQVNUTFknLCAnTUFKRVNUVU9VUyEnLCAnRElFIERJRSBESUUnXTtcblxuICByZXR1cm4gZWZmZWN0O1xufTtcbiIsInZhciAkID0gcmVxdWlyZSgnZG9taW51cycpO1xudmFyIGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xudmFyIG5wY3MgPSByZXF1aXJlKCcuLi9ucGNzJyk7XG52YXIgbnBjID0gcmVxdWlyZSgnLi4vbnBjJyk7XG52YXIgYWltZXIgPSByZXF1aXJlKCcuLi9haS9haW1lcicpO1xudmFyIHBvd2VydXAgPSByZXF1aXJlKCcuLi9wb3dlcnVwJyk7XG52YXIgYXVkaW8gPSByZXF1aXJlKCcuLi9hdWRpbycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNoYW9zYnJpbmdlciAobGV2ZWwpIHtcbiAgZnVuY3Rpb24gZWZmZWN0IChwbGF5ZXIsIHBvdykge1xuICAgIHZhciBjb3VudCA9IE1hdGgubWluKGxldmVsLCA0KTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgbnBjKHBsYXllciwgeyBhaTogYWltZXIsIGxldmVsOiBNYXRoLmZsb29yKE1hdGgubWF4KDEsIGkgLyAyKSkgfSk7XG4gICAgfVxuICAgIGlmICgtLWxldmVsID4gMCkge1xuICAgICAgcG93ZXJ1cChwbGF5ZXIsIHsgZWZmZWN0OiBjaGFvc2JyaW5nZXIobGV2ZWwpIH0pO1xuICAgIH1cbiAgICBhdWRpby5wbGF5KCdjaGFvc2JyaW5nZXInKTtcbiAgfVxuXG4gIGVmZmVjdC53b3JkcyA9IFsnRklFUlkgREVBVEghJywgJ0FOR1JZIFRISU5HUy4nLCAnT0ggTk8nLCAnQ0hBT1MgQlJJTkdFUicsICdhbmdyeSBraWxsIScsICdkZWF0aCBpcyBpbmV2aXRhYmxlJ107XG5cbiAgcmV0dXJuIGVmZmVjdDtcbn07XG4iLCJ2YXIgYXVkaW8gPSByZXF1aXJlKCcuLi9hdWRpbycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXZlcykge1xuICBmdW5jdGlvbiBlZmZlY3QgKHBsYXllciwgcG93KSB7XG4gICAgcGxheWVyLmFkZExldmVsKGxpdmVzKTtcbiAgICBhdWRpby5wbGF5KCdsaWZlc2F2ZXInKTtcbiAgfVxuXG4gIGVmZmVjdC53b3JkcyA9IFsnTElGRSEnLCAnU2F2ZXIuJ107XG5cbiAgcmV0dXJuIGVmZmVjdDtcbn07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJ2RvbWludXMnKTtcbnZhciBib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcbnZhciBucGNzID0gcmVxdWlyZSgnLi4vbnBjcycpO1xudmFyIHVzID0gcmVxdWlyZSgnLi4vdXMnKTtcbnZhciBhdWRpbyA9IHJlcXVpcmUoJy4uL2F1ZGlvJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gIGZ1bmN0aW9uIGVmZmVjdCAocGxheWVyLCBwb3cpIHtcbiAgICB2YXIgbnBjO1xuXG4gICAgYm9keS5hZGRDbGFzcygncmFpbnN0b3JtJyk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGJvZHkucmVtb3ZlQ2xhc3MoJ3JhaW5zdG9ybScpO1xuICAgIH0sIDMwMCk7XG5cbiAgICB3aGlsZSAobGV2ZWwtLSAmJiBucGNzLmxlbmd0aCkge1xuICAgICAgc2V0VGltZW91dChkYW1hZ2UuYmluZChudWxsLCB1cy5yKG5wY3MpKSwgTWF0aC5yYW5kb20oKSAqIDMwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gIGRhbWFnZSAobnBjKSB7XG4gICAgICBucGMubW9iLmRhbWFnZShsZXZlbCk7XG4gICAgfVxuXG4gICAgbnBjcy5mb3JFYWNoKGZ1bmN0aW9uIChucGMsIGkpIHtcbiAgICAgIGlmIChpIDwgbGV2ZWwpIHtcbiAgICAgICAgbnBjLm1vYi5kYW1hZ2UobGV2ZWwpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGF1ZGlvLnBsYXkoJ3JhaW5zdG9ybScpO1xuICB9XG5cbiAgZWZmZWN0LndvcmRzID0gWydTVE9STSEnLCAnU2hvd2VyLicsICdERUFUSCcsICdNYXloZW0nLCAnV09PTyEnLCAnS0lMTCBcXCdFTSBBTEwnXTtcblxuICByZXR1cm4gZWZmZWN0O1xufTtcbiIsInZhciAkID0gcmVxdWlyZSgnZG9taW51cycpO1xudmFyIHVzID0gcmVxdWlyZSgnLi91cycpO1xudmFyIGVtaXR0ZXIgPSByZXF1aXJlKCcuL2VtaXR0ZXInKTtcbnZhciBsZXZlbCA9ICQoJy5zYy1sZXZlbCcpO1xudmFyIHBvaW50cyA9ICQoJy5zYy1wb2ludHMnKTtcbnZhciBsaXZlcyA9ICQoJy5zYy1saXZlcycpO1xudmFyIGNib21iID0gJCgnLnNjLWJvbWJzJyk7XG52YXIgc2NvcmUgPSAwO1xudmFyIGdhbWVMZXZlbCA9IDA7XG52YXIgcGxheWVyO1xuXG5lbWl0dGVyLm9uKCdwbGF5ZXIuc3RhcnQnLCBmdW5jdGlvbiAocCkge1xuICBwbGF5ZXIgPSBwO1xufSk7XG5cbmVtaXR0ZXIub24oJ25wYy5raWxsJywgZnVuY3Rpb24gKGNsZWFyLCBsZXZlbCkge1xuICBhZGQoTWF0aC5mbG9vcigrK2xldmVsICogMS41KSk7XG59KTtcblxuZW1pdHRlci5vbigncG93LnVzZScsIGZ1bmN0aW9uIChsZXZlbCkge1xuICBhZGQoKytsZXZlbCk7XG59KTtcblxuZW1pdHRlci5vbigncGxheWVyLmRlYXRoJywgZnVuY3Rpb24gKGxldmVsKSB7XG4gIGFkZCgtdXMubW0oZ2FtZUxldmVsICogNSwgZ2FtZUxldmVsICogMikpO1xufSk7XG5cbmVtaXR0ZXIub24oJ2xldmVscy5jaGFuZ2UnLCBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgZ2FtZUxldmVsID0gbGV2ZWwgKyAxO1xuICBhZGQodXMubW0oZ2FtZUxldmVsLCBnYW1lTGV2ZWwgKiAyKSk7XG59KTtcblxuZW1pdHRlci5vbigncGxheWVyLnJhaW4nLCBmdW5jdGlvbiAocikge1xuICByYWluID0gcjtcbiAgdXBkYXRlKCk7XG59KTtcblxuZnVuY3Rpb24gcmVzZXQgKCkge1xuICBzY29yZSA9IDA7XG4gIHVwZGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBhZGQgKHBvaW50cykge1xuICBzY29yZSArPSBwb2ludHM7XG4gIHVwZGF0ZSgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUgKCkge1xuICBsZXZlbC50ZXh0KGdhbWVMZXZlbCk7XG4gIGxpdmVzLnRleHQocGxheWVyLmxldmVsICsgMSk7XG4gIHBvaW50cy50ZXh0KHNjb3JlKTtcbiAgY2JvbWIudGV4dChyYWluKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlc2V0OiByZXNldCxcbiAgYWRkOiBhZGQsXG4gIHVwZGF0ZTogdXBkYXRlXG59O1xuIiwiZnVuY3Rpb24gcGMgKHYsIHIpIHsgcmV0dXJuIHAociAvIDEwMCAqIHYpOyB9XG5mdW5jdGlvbiB1IChtKSB7IHJldHVybiBhID0gcGFyc2VJbnQobS5yZXBsYWNlKCdweCcsICcnKSwgMTApLCBpc05hTihhKSA/IDAgOiBhOyB9XG5mdW5jdGlvbiBwICh2KSB7IHJldHVybiB2ICsgJ3B4JzsgfVxuZnVuY3Rpb24gbW0gKG1pbiwgbWF4KSB7IHJldHVybiBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluKTsgfVxuZnVuY3Rpb24gciAoYykgeyByZXR1cm4gY1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjLmxlbmd0aCldOyB9XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwYzogcGMsXG4gIHU6IHUsXG4gIHA6IHAsXG4gIG1tOiBtbSxcbiAgcjogclxufTtcbiJdfQ==
