const { babel } = require('@rollup/plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

module.exports = {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    resolve({
      customResolveOptions: {
        paths: [ 'src', 'node_modules' ]
      }
    }),
    commonjs()
  ]
};
