import * as geometryUtils from '../geometry.utils.js';
import { assert } from 'chai';

describe('geom-helpers', function () {

  describe('getPoint()', function () {

    const getPoint = geometryUtils.getPoint;

    it('return { 0, 0 } point be default', () => {
      const center = getPoint();
      assert.deepStrictEqual(center, { x: 0, y: 0 });
    });

    it('return { a, a } if only one arg specified', () => {
      const value = 2;
      const direction = getPoint(value);
      assert.deepStrictEqual(direction, { x: value, y: value });
    });

    it('return { x, y } if both args specified', () => {
      const x = 3, y = 4;
      const point = getPoint(x, y);
      assert.deepStrictEqual(point, { x, y });
    });

  });

  describe('getSize()', function () {

    const getSize = geometryUtils.getSize;

    it('return { 0, 0 } size by default', () => {
      const zeroSize = getSize();
      assert.deepStrictEqual(zeroSize, { width: 0, height: 0 });
    });

    it('return square if only one arg specified', () => {
      const side = 10;
      const square = getSize(side);
      assert.deepStrictEqual(square, { width: side, height: side });
    });

    it('return { width, height } if both arg specified', () => {
      const width = 3, height = 4;
      const size = getSize(width, height);
      assert.deepStrictEqual(size, { width, height });
    });

  });

});
