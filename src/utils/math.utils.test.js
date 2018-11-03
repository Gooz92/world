import * as mathUtils from './math.utils.js';
import { assert } from 'chai';

describe('mathUtils', function () {

  describe('getCycleCoordinate', function () {

    const getCycleCoordinate = mathUtils.getCycleCoordinate;

    it('return original coordiate if it less than bound', () => {
      const coordiate = 5;
      const bound = 10;

      assert.strictEqual(getCycleCoordinate(coordiate, bound), coordiate);
    });

    it('return 0 if coordinate equal to bound', () => {
      const value = 42;
      assert.strictEqual(getCycleCoordinate(value, value), 0);
    });

    // TODO

  });

});
