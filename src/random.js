import { randomInt } from './utils.js';

export default function (distribution) {
  const weightsSum = distribution
    .reduce((sum, [ weight ]) => sum + weight, 0);
  
  return () => {
    const x = randomInt(0, weightsSum - 1);
    let cumulativeWeight = 0;

    for (let [ weight, value ] of distribution) {
      cumulativeWeight += weight;
      if (x < cumulativeWeight) return value;
    }
  };
}
