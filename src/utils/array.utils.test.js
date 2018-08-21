import * as arrayUtils from './array.utils.js';
import { assert } from 'chai';
import sinon from 'sinon';

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

    it('return [0; length) if second argument is omit', () => {
      const length = 5;
      const array = generateArray(length);
      assert.deepEqual(array, [ 0, 1, 2, 3, 4 ]);
    });

    it('use itemGenerator for array filling', () => {
      const x2 = index => index * 2;
      const length = 3;
      const array = generateArray(length, x2);
      assert.deepEqual(array, [ 0, 2, 4 ]);
    });

    it('call itemGenerator for each array index', () => {
      const itemGenerator = sinon.spy();
      const length = 4;
      generateArray(length, itemGenerator);
      assert.strictEqual(itemGenerator.callCount, length);
    });

    it('call itemGenerator with index as first argument', () => {
      const itemGenerator = sinon.spy();
      generateArray(3, itemGenerator);
  
      assert.strictEqual(itemGenerator.firstCall.args[0], 0);
      assert.strictEqual(itemGenerator.secondCall.args[0], 1);
      assert.strictEqual(itemGenerator.thirdCall.args[0], 2);
    });

    it('call itemGenerator with generated array as second argument', () => {
      const itemGenerator = sinon.spy(index => index);
      const array = generateArray(1, itemGenerator);
  
      assert.strictEqual(itemGenerator.firstCall.args[1], array);
    });

  });

});
