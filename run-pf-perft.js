const { rollup } = require('rollup');

const
  babel = require('rollup-plugin-babel'),
  commonjs = require('rollup-plugin-commonjs'),
  alias = require('rollup-plugin-alias');

const bundle = rollup({
  input: 'src/utils/path-finding/PathFinder.perft.js',
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
});

bundle
  .then(data => (
    data.write({
      file: 'dist/pf-perft.js',
      format: 'iife'
    })
  ))
  .then(() => {
    require('./dist/pf-perft.js');
  });
