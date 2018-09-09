const config = require('./rollup.config.dev.js');

module.exports = {
  ...config,
  plugins: [
    ...config.plugins,
    require('rollup-plugin-uglify').uglify({ keep_fnames: true })
  ]
};
