import { identity } from './fn.utils';

export function generateArray(length = 0, generateItem = identity) {
  const array = [];

  for (let i = 0; i < length; i++) {
    const item = generateItem(i, array);
    array.push(item);
  }

  return array;
}
