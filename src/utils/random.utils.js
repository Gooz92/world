export const randomInt = (min, max) => (
  Math.floor((min + (max - min + 1) * Math.random()))
);

export const randomElement = array => array[randomInt(0, array.length - 1)];

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
