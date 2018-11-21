import * as objectUtils from '../object.utils.js';
import { assert } from 'chai';
import spy from 'test-utils/spy.js';

describe('objectUtils', function () {

  describe('omit', function () {

    const omit = objectUtils.omit;

    it('return copy of given object without given keys', () => {
      const rectangle = { x: 1, y: 2, width: 3, height: 4 };
      const point = omit(rectangle, [ 'width', 'height' ]);
      assert.deepStrictEqual(point, { x: 1, y: 2 });
    });

  });

  describe('map', function () {

    const map = objectUtils.map;

    it('return empty object for empty object', () => {
      const empty = map({});
      assert.deepStrictEqual(empty, {});
    });

    it('creates an object with values generated by callback', () => {
      const size = map({
        width: 16,
        height: 9
      }, value => `${value}px`);

      assert.deepStrictEqual(size, { width: '16px', height: '9px' });
    });

  });

  describe('forIn', function () {

    const forIn = objectUtils.forIn;

    it('invoke callback for each object property', () => {

      const rectangle = {
        x: 1,
        y: 3,

        width: 3,
        height: 4
      };

      const spyCallback = spy();

      forIn(rectangle, spyCallback);

      assert.deepStrictEqual(spyCallback.calls, [
        [ 1, 'x' ],
        [ 3, 'y' ],
        [ 3, 'width' ],
        [ 4, 'height' ]
      ]);

    });

  });

});
