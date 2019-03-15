const substitute = require('../utils/substitute.js');

module.exports = function template(oprtions = {}) {

  return {
    generateBundle: function () {
      console.log('hook');
    }
  };
}
