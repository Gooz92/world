import * as randomUtils from './random.utils.js';
import { assert } from 'chai';

describe('randomUtils', function () {

  describe('randomInt', function () {
    const randomInt = randomUtils.randomInt;

    it('return min (max) if min === max', () => {
      const bound = 42;
      assert.strictEqual(randomInt(bound, bound), bound);
    });
  });

  describe('randomElement', function () {
    const randomElement = randomUtils.randomElement;

    it('return element if given array is [ element ]', () => {
      const element = 'element';

      assert.deepStrictEqual(randomElement([ element ]), element);
    });

  });

  describe.skip('distributionRandom');

});
