import * as randomUtils from '../random.utils.js';
import { equal } from '../assertion.js';

describe('randomUtils', function () {

  describe('randomInt', function () {
    const randomInt = randomUtils.randomInt;

    it('return min (max) if min === max', () => {
      const bound = 42;
      equal(randomInt(bound, bound), bound);
    });
  });

  describe('seeding random generator', function () {

    let random;

    beforeEach(() => {
      random = randomUtils.randomGenerator();
    });

    describe('.next()', function () {

      it('return number', () => {
        equal(typeof random.next(), 'number');
      });

    });

    describe('.nextInt()', function () {

      it('return min (max) if min === max', () => {
        const bound = 42;
        equal(random.nextInt(bound, bound), bound);
      });

    });

    describe('.nextBoolean()', function () {

      it('return boolean', () => {
        equal(typeof random.nextBoolean(), 'boolean');
      });

    });

  });

});
