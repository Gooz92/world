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

  describe('omit', function () {

    const omit = objectUtils.omit;

    it('return copy of given object without given keys', () => {
      const rectangle = { x: 1, y: 2, width: 3, height: 4 };
      const point = omit(rectangle, [ 'width', 'height' ]);
      assert.deepStrictEqual(point, { x: 1, y: 2 });
    });

  });

});
