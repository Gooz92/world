const
  commonConfig = require('./rollup.config.common.js'),

  { uglify } = require('rollup-plugin-uglify');

module.exports = {
  ...commonConfig,
  plugins: [
    ...commonConfig.plugins,
    uglify()
  ]
};
