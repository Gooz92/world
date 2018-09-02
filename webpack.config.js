const webackCommon = require('./webpack.common.js');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js'
  },
  ...webackCommon
};
