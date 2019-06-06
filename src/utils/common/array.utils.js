import { getNull } from './fn.utils.js';
import { isFunction } from './is.utils.js';

export function generateArray(...args) {
  const array = [];

  const lastArgument = last(args);

  let generateItem, dimsCount;

  if (isFunction(lastArgument)) {
    generateItem = lastArgument;
    dimsCount = args.length - 1;
  } else {
    dimsCount = args.length;
    generateItem = getNull;
  }

  const dims = args.slice(0, dimsCount);

  // improve callback arguments
  const $generateItem = dimsCount === 1 ? generateItem : (
    (i, array) => generateArray(...dims.slice(1, dimsCount), generateItem)
  );

  for (let i = 0; i < args[0]; i++) {
    const item = $generateItem(i, array);
    array.push(item);
  }

  return array;
}

export const last = array => array[array.length - 1];

export const remove = (array, index) => array.splice(index, 1)[0];

export function insert(array, item, index) {
  array.splice(index, 0, item);
}

export const take = (array, n) => array.slice(0, n);

export function chunk(array, rowLength) {
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

export function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}
