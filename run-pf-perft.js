const { rollup } = require('rollup');

const
  babel = require('rollup-plugin-babel'),
  resolve = require('rollup-plugin-node-resolve');

const bundle = rollup({
  input: 'src/utils/path-finding/PathFinder.perft.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'src'
      }
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
