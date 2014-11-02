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

function clear () {
  var bullet;
  while ((bullet = bullets.shift())) {
    bullet.clear = true;
    bullet.remove();
  }
}

module.exports = global.cube.bullets = bullets;

bullets.tick = tick;
bullets.clear = clear;
