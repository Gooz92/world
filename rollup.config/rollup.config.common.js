const
  babel = require('rollup-plugin-babel'),
  commonjs = require('rollup-plugin-commonjs'),
  alias = require('rollup-plugin-alias');

module.exports = {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs(),
    alias({
      utils: 'src/utils',
      model: 'src/model'
    })
  ]
};
