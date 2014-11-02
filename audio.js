var audio = {
  play: play,
  muted: false
};

function play (file) {console.log(file, audio.muted);
  if (audio.muted !== false) {
    new Audio('audio/' + file + '.wav').autoplay = true;
  }
}

module.exports = audio;
