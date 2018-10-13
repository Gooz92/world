

module.exports = function (config) {
  config.set({
    frameworks: [ 'mocha' ],
    singleRun: true,
    plugins: [
      'karma-spec-reporter',
      'karma-mocha',
      'karma-rollup-preprocessor',
      'karma-chrome-launcher'
    ],
    browsers: [ 'Chrome' ],
    preprocessors: {
      '**/*.js': [ 'rollup' ]
    },
    reporters: [ 'spec' ],
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
        require('rollup-plugin-node-resolve')(),
        require('rollup-plugin-alias')({
          utils: 'src/utils',
          model: 'src/model'
        })
      ],
      output: {
        format: 'iife'
			}
    },
    basePath: './src',
    files: [ '**/*.test.js' ]
  });
};
