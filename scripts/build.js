const { rollup } = require('rollup');

const config = require('../rollup.config/rollup.config.common.js');

module.exports = (input, output) => (
  rollup({
    input: `src/${input}`,
    plugins: config.plugins
  }).then(data => (
    data.write({
      file: `dist/${output}`,
      format: 'cjs'
    })
  ))
);
