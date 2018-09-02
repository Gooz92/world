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
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [require('babel-plugin-transform-class-properties')]
              }
            }
          }
        ]
      },
    },
    basePath: './src',
    files: [ '**/*.test.js' ]
  })
};
