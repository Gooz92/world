import * as objectUtils from './object.utils.js';
import { assert } from 'chai';

describe('objectUtils', function () {

  describe('property', function () {

    const property = objectUtils.property;

    it('return a function that returns the value of object property', () => {
      const liquid = 'coffee';
      const cup = { liquid };
      const getLiquid = property('liquid');

      assert.strictEqual(getLiquid(cup), liquid);
    });

  });

});
