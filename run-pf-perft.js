const build = require('./scripts/build.js');

build('utils/path-finding/PathFinder.perft.js', 'pf-perft.js').then(res => {
  res.output.forEach(chunk => {
    require(`./dist/${chunk.fileName}`);
  });
});
