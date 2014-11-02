var $ = require('dominus');
var incubator = $('#you');
var body = $(document.body);

function incubate () {
  var cube = incubator.clone().appendTo(body);
  cube[0].removeAttribute('id');
  cube.find('.pc-cube').addClass('pc-smooth');
  return cube;
}

module.exports = incubate;
