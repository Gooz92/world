import * as arrayUtils from '../array.utils.js';
import { assert } from 'chai';
import spy from 'test-utils/spy.js';
import { identity } from '../fn.utils.js';

describe('arrayUtils', function () {

  describe('generateArray', function () {

    const generateArray = arrayUtils.generateArray;

    it('return empty array by default', () => {
      const empty = generateArray();
      assert.lengthOf(empty, 0);
      assert.isArray(empty);
    });

    it('return array with given length', () => {
      const length = 7;
      const array = generateArray(length);
      assert.lengthOf(array, length);
    });

    it('return array of nulls if generateItem function is ommit', () => {
      const length = 4;
      const array = generateArray(length);
      assert.deepEqual(array, [ null, null, null, null ]);
    });

    it('use itemGenerator for array filling', () => {
      const x2 = index => index * 2;
      const length = 3;
      const array = generateArray(length, x2);
      assert.deepEqual(array, [ 0, 2, 4 ]);
    });

    it('call itemGenerator for each array index', () => {
      const itemGenerator = spy();
      const length = 4;
      generateArray(length, itemGenerator);
      assert.strictEqual(itemGenerator.calls.length, length);
    });

    it('call itemGenerator with index as first argument', () => {
      const itemGenerator = spy();
      generateArray(3, itemGenerator);

      assert.strictEqual(itemGenerator.calls[0][0], 0);
      assert.strictEqual(itemGenerator.calls[1][0], 1);
      assert.strictEqual(itemGenerator.calls[2][0], 2);
    });

    it('call itemGenerator with generated array as second argument', () => {
      const itemGenerator = spy(index => index);
      const array = generateArray(1, itemGenerator);

      assert.strictEqual(itemGenerator.calls[0][1], array);
    });

    it('can create 2-dim array', () => {
      const arr = generateArray(1, 1, () => 1);
      assert.deepEqual(arr, [ [ 1 ] ]);
    });

    it('can create n x m array', () => {
      const arr = generateArray(4, 3, identity);

      assert.deepEqual(arr, [
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
      assert.deepStrictEqual(colors, [ 'red', 'green', 'blue', 'white' ]);
    });

    it('return removed item', () => {
      const removed = 'a';
      const array = [ 1, 2, 'a', 3 ];
      assert.strictEqual(remove(array, 2), removed);
    });

  });

  describe('insert', function () {

    const insert = arrayUtils.insert;

    it('insert element in given position', () => {
      const numbers = [ 1, 2, 3 ];
      insert(numbers, 'second', 1);
      assert.deepStrictEqual(numbers, [ 1, 'second', 2, 3 ]);
    });

  });

  describe('last', function () {

    const last = arrayUtils.last;

    it('get last element of array', () => {
      const tail = 'tail';
      const array = [ 'head', 'body', tail ];
      assert.strictEqual(last(array), tail);
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

      assert.deepEqual(chunk(array, 3), rolledUp);
    });
  });

  describe('swap', function () {

    const swap = arrayUtils.swap;

    it('should swap elements with given indexes in array', () => {
      const array = [ 'a', 'b', 'c', 'd' ];
      swap(array, 1, 2);
      assert.deepEqual(array, [ 'a', 'c', 'b', 'd' ]);
    });
  });

});
