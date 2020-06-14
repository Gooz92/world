const commonConfig = require('./rollup.config.common.js');
const pluginSourcemaps = require('rollup-plugin-sourcemaps');

module.exports = {
  ...commonConfig,
  output: {
    ...commonConfig.output,
    sourcemap: true
  },
  plugins: [
    ...commonConfig.plugins,
    pluginSourcemaps()
  ]
};
