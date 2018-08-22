module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    singleRun: true,
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-chrome-launcher'
    ],
    browsers: [ 'Chrome' ],
    preprocessors: {
      '**/*.js': [ 'webpack' ]
    },
    webpack: {
      mode: 'development'
    },
    basePath: './src',
    files: [ '**/*.test.js' ]
  })
};
