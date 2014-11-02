var $ = require('dominus');
var pows = require('./powerups');
var npcs = require('./npcs');
var bullets = require('./bullets');
var mobs = require('./mobs');
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
      mobs.clear();
      bullets.clear();
      $('.pc-parent').but('#you, .the-man').remove();
      levels[level](you);
      enchantments.set(levels[level].enchantments);
    }
  }

  function won () {
    emitter.emit('levels.win');
  }
};
