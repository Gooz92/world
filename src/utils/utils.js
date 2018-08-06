export const noop = () => {};

export function generateArray(length, generateItem) {
  const array = [];

  for (let i = 0; i < length; i++) {
    const item = generateItem(i, array);
    array.push(item);
  }

  return array;
}

export const randomInt = (min, max) => (
  Math.floor((min + (max - min + 1) * Math.random()))
);

export const randomElement = array => array[randomInt(0, array.length - 1)];
