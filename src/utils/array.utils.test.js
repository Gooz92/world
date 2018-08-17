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

    // TODO

  });

});
