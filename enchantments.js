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
