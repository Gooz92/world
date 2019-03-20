const commonConfig = require('./rollup.config.common.js'),
  template = require('../src/rollup/template.js');

module.exports = {
  ...commonConfig,
  plugins: [
    ...commonConfig.plugins,
    template({
      input: 'index.tpl.html',
      output: 'index.ds.html',
      data: {
        title: 'Diamond Square Demo',
        js: 'dist/ds.js',
        css: '../style.css'
      }
    })
  ]
};
