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

    nextBoolean() {
      return self.next() < 0.5;
    }
  };

  return self;
}
