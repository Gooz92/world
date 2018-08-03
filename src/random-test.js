import random from './random.js';

export default function () {

  const next = random([
    [ 1, 'a' ],
    [ 2, 'b' ],
    [ 3, 'c' ]
  ]);

  const freq = {};

  let times = 1e5;

  while (times-- > 0) {
    const value = next();
    freq[value] = (freq[value] || 0) + 1;
  }

  console.log(freq);
}
