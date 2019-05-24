import * as mathUtils from '../math.utils.js';
import { equal, deepEqual, isTrue, isFalse } from '../assertion.js';

describe('mathUtils', function () {

  describe('getCycleCoordinate', function () {

    const getCycleCoordinate = mathUtils.getCycleCoordinate;

    it('return original coordiate if it less than bound', () => {
      const coordiate = 5;
      const bound = 10;

      equal(getCycleCoordinate(coordiate, bound), coordiate);
    });

    it('return 0 if coordinate equal to bound', () => {
      const value = 42;
      equal(getCycleCoordinate(value, value), 0);
    });

    it('return bound + coordinate if coordinate is negative', () => {
      const value = -3;
      const bound = 10;

      equal(getCycleCoordinate(value, bound), bound + value);
    });

  });

  describe('inCycleRange', function () {

    const inCycleRange = mathUtils.inCycleRange;

    it('normal positive', () => {
      const left = 1, right = 5, value = 1;
      isTrue(inCycleRange(value, left, right));
    });

    it('normal negative', () => {
      const left = 1, right = 5, value = 6;
      isFalse(inCycleRange(value, left, right));
    });

    it('in cycled range', () => {
      const left = 8, right = 4, value = 2, bound = 10;
      isTrue(inCycleRange(value, left, right, bound));
    });

    it('outside cycled range', () => {
      const left = 8, right = 4, value = 6, bound = 10;
      isFalse(inCycleRange(value, left, right, bound));
    });

  });

  describe('normalize', function () {

    const normalize = mathUtils.normalize;

    it('works', () => {
      const arr = [ 0, 20, 50, 80, 100 ];
      const n = normalize(arr, 20);
      deepEqual(n, [ 0, 4, 10, 16, 20 ]);
    });
  });

});
