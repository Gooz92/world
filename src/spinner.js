const readline = require('readline');

const tokens = [ '/', '-', '\\', '|' ];

function nextToken() {
  const token = tokens.shift();
  tokens.push(token);
  return token;
}

process.stdin.setRawMode(true);

setInterval(_ => {
  const token = nextToken();
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(token);
}, 100);
