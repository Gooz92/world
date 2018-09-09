module.exports = {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    require('rollup-plugin-babel')({
      exclude: 'node_modules/**'
    }),
    require('rollup-plugin-commonjs')()
  ]
};
