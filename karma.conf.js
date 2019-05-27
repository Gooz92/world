
const
  commonRollupConfig = require('./rollup.config/rollup.config.common.js'),

  commonjs = require('rollup-plugin-commonjs'),
  babel = require('rollup-plugin-babel'),
  alias = require('rollup-plugin-alias');

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
        babel({
          exclude: 'node_modules/**'
        }),
        alias({
          utils: 'src/utils',
          model: 'src/model',
          modules: 'src/modules',
          'test-utils': 'src/test-utils'
        }),
        commonjs()
      ],
      output: {
        format: commonRollupConfig.output.format
		  }
    },
    basePath: './src',
    files: [ '**/*.test.js' ]
  });
};
