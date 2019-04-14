import * as randomUtils from '../random.utils.js';
import { assert } from 'chai';

describe('randomUtils', function () {

  describe('randomInt', function () {
    const randomInt = randomUtils.randomInt;

    it('return min (max) if min === max', () => {
      const bound = 42;
      assert.strictEqual(randomInt(bound, bound), bound);
    });
  });

  describe('seeding random generator', function () {

    let random;

    beforeEach(() => {
      random = randomUtils.randomGenerator();
    });

    describe('.next()', function () {

      it('return number', () => {
        assert.isNumber(random.next());
      });

    });

    describe('.nextInt()', function () {

      it('return min (max) if min === max', () => {
        const bound = 42;
        assert.strictEqual(random.nextInt(bound, bound), bound);
      });

    });

    describe('.nextBoolean()', function () {

      it('return boolean', () => {
        assert.isBoolean(random.nextBoolean());
      });

    });

  });

});
