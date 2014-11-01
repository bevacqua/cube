var npcs = require('./npcs');
var npc = require('./npc');
var emitter = require('./emitter');

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
  };

  emitter.on('npc.kill', function (cleared) {
    if (cleared) {
      level++;
      console.log('%cLEVEL %s CLEAR WOW~!', 'font-family: "Cardo"; font-size: 25px; color: #ffd2d2;', level);
      setTimeout(reset, 600);
    }
  });

  reset();

  function reset () {
    you.set(50, 50);
    if (levels[level]) {
      npcs.clear();
      levels[level](you);
    } else {
      console.log('%cLEVEL %s CLEAR ZOMG SUCH GAMER~!', 'font-family: "Cardo"; font-size: 25px; color: #a4d4e6;', level);
    }
  }
};
