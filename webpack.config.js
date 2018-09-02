const path = require('path');

module.exports = {
  entry: './src/app.js',
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
  output: {
    filename: 'bundle.js'
  }
};
