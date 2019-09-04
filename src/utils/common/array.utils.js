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

export const first = array => array[0];

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

export const isArraysEqual = (a, b) => (
  a.every((item, index) => b[index] === item)
);

const defaultIsEqual = (a, b) => a === b;

export function isUnique(array, isEqual = defaultIsEqual) {
  for (let i = 0; i < array.length; i++) {
    const a = array[i];
    for (let j = i + 1; j < array.length; j++) {
      const b = array[j];
      if (isEqual(a, b)) {
        return false;
      }
    }
  }

  return true;
}

// handle cycle indexes
export function getItem(array, index) {
  const i = index % array.length;

  if (i < 0) {
    return array.length + i;
  }

  return array[i];
}
