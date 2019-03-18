const
  babel = require('rollup-plugin-babel'),
  commonjs = require('rollup-plugin-commonjs'),
  alias = require('rollup-plugin-alias'),
  template = require('./src/rollup/template.js'),
  nodeResolve = require('rollup-plugin-node-resolve');

module.exports = {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    template({
      input: 'index.tpl.html',
      output: 'index.html',
      data: {
        title: 'Title'
      }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs(),
    nodeResolve(),
    alias({
      utils: 'src/utils',
      model: 'src/model'
    })
  ]
};
