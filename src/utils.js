export const noop = () => {};

export function generateArray(length, generateItem) {
  const array = [];

  for (let i = 0; i < length; i++) {
    const item = generateItem(i, array);
    array.push(item);
  }

  return array;
}