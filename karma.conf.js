
module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-webpack'
    ],
    preprocessors: {
      '**/*.js': [ 'webpack' ]
    },
    basePath: './src',
    files: [ '**/*.test.js' ]
  })
};
