function pc (v, r) { return p(r / 100 * v); }
function u (m) { return a = parseInt(m.replace('px', ''), 10), isNaN(a) ? 0 : a; }
function p (v) { return v + 'px'; }

module.exports = {
  pc: pc,
  u: u,
  p: p
};
