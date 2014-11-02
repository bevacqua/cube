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
