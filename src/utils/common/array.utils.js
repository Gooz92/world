import { getNull, getArray } from './fn.utils.js';
import { isFunction } from './is.utils.js';

function generate1DimArray(length, getItem) {
  const array = [];

  for (let i = 0; i < length; i++) {
    const item = getItem(i);
    array.push(item);
  }

  return array;
}

function generate2DimArray(n, m, getItem) {
  return generate1DimArray(n, i => (
    generate1DimArray(m, j => getItem(i, j))
  ));
}

const arrayGenerators = [
  getArray,
  length => generate1DimArray(length, getNull),
  (n, dimOrGetItem) => {
    if (isFunction(dimOrGetItem)) {
      return generate1DimArray(n, dimOrGetItem);
    }

    return generate2DimArray(n, dimOrGetItem, getNull);
  },
  generate2DimArray
];

export function generateArray(...args) {
  const arrayGenerator = arrayGenerators[args.length];
  return arrayGenerator(...args);
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
  a.length === b.length && a.every((item, index) => b[index] === item)
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
  let i = index % array.length;

  if (i < 0) {
    i += array.length;
  }

  return array[i];
}

export const flatten = array => (
  array.reduce((flat, element) => flat.concat(element), [])
);
