const { babel } = require('@rollup/plugin-babel');
const resolve = require('rollup-plugin-node-resolve');

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
        moduleDirectory: 'src'
      }
    })
  ]
};
