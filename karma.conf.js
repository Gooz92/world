const commonRollupConfig = require('./rollup.config/rollup.config.common.js');

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
    browsers: [ 'ChromeHeadless' ],
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
      plugins: commonRollupConfig.plugins,
      output: {
        format: commonRollupConfig.output.format
		  }
    },
    basePath: './src',
    files: [ '**/*.test.js' ]
  });
};
