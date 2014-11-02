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
