import random from '../utils/random.utils.js';

function r() {

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


export default {
  
  enter: _ => {
    r();
  }
};
