import { identity } from './fn.utils';

export function generateArray(length = 0, generateItem = identity) {
  const array = [];

  for (let i = 0; i < length; i++) {
    const item = generateItem(i, array);
    array.push(item);
  }

  return array;
}

export const remove = (array, index) => array.splice(index, 1)[0];

export function insert(array, item, index) {
  array.splice(index, 0, item);
}
