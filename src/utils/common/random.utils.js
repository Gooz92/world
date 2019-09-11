import { swap } from './array.utils.js';

// min <= n <= max
export const randomInt = (min, max) => (
  Math.floor((min + (max - min + 1) * Math.random()))
);

export function distributionRandom (distribution) {
  const weightsSum = distribution
    .reduce((sum, [ weight ]) => sum + weight, 0);

  return () => {
    const x = randomInt(0, weightsSum - 1);
    let cumulativeWeight = 0;

    for (const [ weight, value ] of distribution) {
      cumulativeWeight += weight;
      if (x < cumulativeWeight) return value;
    }
  };
}

const m = Math.pow(2, 32);
const a = 1664525;
const c = 1013904223;

export const getSeed = () => randomInt(0, m);

export function randomGenerator(seed = getSeed()) {

  const self = {
    next() { // return number between 0 and 1
      seed = (a * seed + c) % m;
      return seed / m;
    },

    nextInt(min, max) {
      const next = self.next();
      return Math.floor((min + (max - min + 1) * next));
    },

    nextBoolean(threshold = 0.5) {
      return self.next() < threshold;
    }
  };

  return self;
}

// TODO
export function randomArrayIterator($array) {
  const array = [ ...$array ];
  let maxIndex = array.length - 1;

  return {
    next: () => {
      const index = randomInt(0, maxIndex);
      const element = array[index];

      swap(array, maxIndex, index);

      --maxIndex;

      return element;
    }
  };
}
