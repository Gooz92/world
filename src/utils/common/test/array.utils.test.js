import * as arrayUtils from '../array.utils.js';
import spy from 'test-utils/spy.js';
import { identity } from '../fn.utils.js';
import { deepEqual, equal, isTrue, isFalse } from '../assertion.js';

describe('arrayUtils', function () {

  describe('generateArray', function () {

    const generateArray = arrayUtils.generateArray;

    it('return empty array by default', () => {
      const empty = generateArray();
      equal(empty.length, 0);
      isTrue(Array.isArray(empty));
    });

    it('return array with given length', () => {
      const length = 7;
      const array = generateArray(length);
      equal(array.length, length);
    });

    it('return array of nulls if generateItem function is ommit', () => {
      const length = 4;
      const array = generateArray(length);
      deepEqual(array, [ null, null, null, null ]);
    });

    it('use itemGenerator for array filling', () => {
      const x2 = index => index * 2;
      const length = 3;
      const array = generateArray(length, x2);
      deepEqual(array, [ 0, 2, 4 ]);
    });

    it('call itemGenerator for each array index', () => {
      const itemGenerator = spy();
      const length = 4;
      generateArray(length, itemGenerator);
      equal(itemGenerator.calls.length, length);
    });

    it('call itemGenerator with index as first argument', () => {
      const itemGenerator = spy();
      generateArray(3, itemGenerator);

      equal(itemGenerator.calls[0][0], 0);
      equal(itemGenerator.calls[1][0], 1);
      equal(itemGenerator.calls[2][0], 2);
    });

    it('call itemGenerator with generated array as second argument', () => {
      const itemGenerator = spy(index => index);
      const array = generateArray(1, itemGenerator);

      equal(itemGenerator.calls[0][1], array);
    });

    it('can create 2-dim array', () => {
      const arr = generateArray(1, 1, () => 1);
      deepEqual(arr, [ [ 1 ] ]);
    });

    it('can create n x m array', () => {
      const arr = generateArray(4, 3, identity);

      deepEqual(arr, [
        [ 0, 1, 2 ],
        [ 0, 1, 2 ],
        [ 0, 1, 2 ],
        [ 0, 1, 2 ]
      ]);
    });
  });

  describe('remove', function () {

    const remove = arrayUtils.remove;

    it('remove element with given index from array', () => {
      const colors = [ 'red', 'green', 'blue', 'black', 'white' ];
      remove(colors, 3);
      deepEqual(colors, [ 'red', 'green', 'blue', 'white' ]);
    });

    it('return removed item', () => {
      const removed = 'a';
      const array = [ 1, 2, 'a', 3 ];
      equal(remove(array, 2), removed);
    });

  });

  describe('isArraysEqual', function () {

    const { isArraysEqual } = arrayUtils;

    it('return true if array equal', () => {
      const a = [ 1, 2, 3 ];
      const b = [ 1, 2, 3 ];

      isTrue(isArraysEqual(a, b));
    });

    it('return false if arrays has different lengths', () => {
      const a = [ 1, 2 ];
      const b = [ 1, 2, 3 ];

      isFalse(isArraysEqual(a, b));
    });

  });

  describe('take', function () {

    const take = arrayUtils.take;

    it('return first n elements of given array', () => {
      const fruits = [ 'banana', 'orange', 'apple' ];
      deepEqual(take(fruits, 2), [ 'banana', 'orange' ]);
    });

    it('not mutate array', () => {
      const numbers = [ 1, 2, 3, 4 ];
      take(numbers, 3);
      deepEqual(numbers, [ 1, 2, 3, 4 ]);
    });
  });

  describe('insert', function () {

    const insert = arrayUtils.insert;

    it('insert element in given position', () => {
      const numbers = [ 1, 2, 3 ];
      insert(numbers, 'second', 1);
      deepEqual(numbers, [ 1, 'second', 2, 3 ]);
    });

  });

  describe('first', function () {

    const first = arrayUtils.first;

    it('get first element of array', () => {
      const head = 'head';
      const array = [ head, 'body', 'tail' ];
      equal(first(array), head);
    });

  });

  describe('last', function () {

    const last = arrayUtils.last;

    it('get last element of array', () => {
      const tail = 'tail';
      const array = [ 'head', 'body', tail ];
      equal(last(array), tail);
    });

  });

  describe('chunk', function () {

    const chunk = arrayUtils.chunk;

    it('roll up one-dimensional array into two-dimensional', () => {
      const array = [ 1, 2, 3, 4, 5, 6, 7 ];

      const rolledUp = [
        [ 1, 2, 3 ],
        [ 4, 5, 6 ],
        [ 7 ]
      ];

      deepEqual(chunk(array, 3), rolledUp);
    });
  });

  describe('swap', function () {

    const swap = arrayUtils.swap;

    it('should swap elements with given indexes in array', () => {
      const array = [ 'a', 'b', 'c', 'd' ];
      swap(array, 1, 2);
      deepEqual(array, [ 'a', 'c', 'b', 'd' ]);
    });
  });

  describe('isUnique', function () {

    const isUnique = arrayUtils.isUnique;

    it('return true if array contains unique elements', () => {
      const array = [ 1, 2, 'a', true ];
      isTrue(isUnique(array));
    });

    it('return false if array contains non unique elements', () => {
      const array = [ 0, 0, 7 ];
      isFalse(isUnique(array));
    });

  });

  describe('getItem', function () {

    const getItem = arrayUtils.getItem;

    const array = 'abcdefghijk'.split('');
    const L = array.length;

    it('index > array.length', () => {
      const n = 2;
      const item = getItem(array, L + n );
      equal(item, array[n]);
    });

    it('index < 0', () => {
      const n = 3;
      const item = getItem(array, -n);
      equal(item, array[L - n]);
    });

  });

});
