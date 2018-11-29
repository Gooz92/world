import { identity } from './fn.utils';

export function generateArray(length = 0, generateItem = identity) {
  const array = [];

  for (let i = 0; i < length; i++) {
    const item = generateItem(i, array);
    array.push(item);
  }

  return array;
}

export const last = array => array[array.length - 1];

export const remove = (array, index) => array.splice(index, 1)[0];

export function insert(array, item, index) {
  array.splice(index, 0, item);
}

// chunk ?
export function rollUp(array, rowLength) {
  const result = [];

  const rowCount = Math.ceil(array.length / rowLength);

  for (let i = 0; i < rowCount; i++) {
    const row = [];

    let index = i * rowLength;
    while (row.length < rowLength && index < array.length) {
      row.push(array[index++]);
    }
    result.push(row);
  }

  return result;
}
