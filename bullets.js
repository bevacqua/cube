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
      target.damage();
      bullet.remove();
    }
  });
}

module.exports = bullets;

bullets.tick = tick;
