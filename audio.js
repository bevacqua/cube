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
