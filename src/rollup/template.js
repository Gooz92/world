const { readFile, writeFile } = require('fs');
const substitute = require('./substitute.js');

module.exports = function template({ input, output, data }) {

  return {
    name: 'rollup-temlate',
    generateBundle: function () {
      return new Promise((resolve, reject) => {
        readFile(input, (err, buffer) => {
          if (err) {
            return reject(err);
          }

          const template = buffer.toString();
          const substituted = substitute(template, data);

          writeFile(output, substituted, (err, res) => {
            if (err) {
              reject(err);
            }

            resolve(res);
          });
        });
      });
    }
  };
};
