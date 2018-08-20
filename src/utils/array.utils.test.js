import * as arrayUtils from './array.utils.js';
import { assert } from 'chai';

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
      assert.deepEqual(array, [0, 1, 2, 3, 4]);
    });

    // TODO check calls of generateItems

  });

});
