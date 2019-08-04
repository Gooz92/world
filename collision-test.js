const build = require('./scripts/build.js');

build('model/strategies/collision-handling.test.js', 'collision.js').then(res => {
  res.output.forEach(chunk => {
    require(`./dist/${chunk.fileName}`);
  });
});
