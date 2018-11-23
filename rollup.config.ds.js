const commonConfig = require('./rollup.config.common.js');

module.exports = {
  input: 'src/diamond-square.js',
  output: {
    file: 'dist/ds.js',
    format: commonConfig.output.format
  },
  plugins: commonConfig.plugins
};
