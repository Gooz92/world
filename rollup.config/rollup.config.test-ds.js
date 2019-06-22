const commonConfig = require('./rollup.config.common.js');

module.exports = {
  ...commonConfig,
  plugins: [
    ...commonConfig.plugins
  ]
};
