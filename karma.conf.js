

module.exports = function (config) {
  config.set({
    frameworks: [ 'mocha' ],
    singleRun: true,
    plugins: [
      'karma-mocha',
      'karma-rollup-preprocessor',
      'karma-chrome-launcher'
    ],
    browsers: [ 'Chrome' ],
    preprocessors: {
      '**/*.js': [ 'rollup' ]
    },
    rollupPreprocessor: {
      onwarn: (warn, defaultOnWarn) => {
        if (![ 'CIRCULAR_DEPENDENCY', 'EVAL' ].includes(warn.code)) {
          defaultOnWarn(warn);
        }
      },
      plugins: [
        require('rollup-plugin-babel')({
          exclude: 'node_modules/**'
        }),
        require('rollup-plugin-commonjs')({
          namedExports: {
            'chai': [ 'assert' ]
          }
        }),
        require('rollup-plugin-node-resolve')()
      ],
      output: {
        format: 'iife'
			}
    },
    basePath: './src',
    files: [ '**/*.test.js' ]
  });
};
