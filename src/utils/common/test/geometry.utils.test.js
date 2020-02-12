import * as geometryUtils from '../geomentry.utils.js';
import { deepEqual, equal } from '../assertion.js';

describe('geometryUtils', function () {

  describe('getMiddle', function () {

    const getMiddle = geometryUtils.getMiddle;

    /*
     * 0 1 2 3 4
     * . . . . .
     *     ^
     */

    it('odd length, start at zero', () => {
      equal(getMiddle(0, 5), 2);
    });

    /*
     * 0 1 2 3 4 5 6
     *     . . . . .
     *         ^
     */

    it('odd length, start at 2', () => {
      equal(getMiddle(2, 5), 4);
    });

    /*
     * 0 1 2 3 4 5 6 7
     *       . . . . .
     *           ^
     */

    it('odd length, start at 3', () => {
      equal(getMiddle(3, 5), 5);
    });

    /*
     * 0 1 2 3 4 5 6
     * . . . .
     *   ^
     */

    it('even length, start at zero', () => {
      equal(getMiddle(0, 4), 1);
    });

    /*
     * 0 1 2 3 4 5 6
     *   . . . .
     *     ^
     */

    it('even length, start at 1', () => {
      equal(getMiddle(1, 4), 2);
    });

    /*
     * 0 1 2 3 4 5 6
     *     . . . .
     *       ^
     */

    it('even length, start at 2', () => {
      equal(getMiddle(2, 4), 3);
    });

  });

  describe('getCenter', function () {

    const getCenter = geometryUtils.getCenter;

    /*
     *     2
     * . . . . .
     * . . + . . 1
     * . . . . .
     */

    it('return center coords for rect with odds sides #1', () => {
      const c = getCenter(0, 0, 5, 3);
      deepEqual(c, [ 2, 1 ]);
    });

    /**
     *   1
     * . . . .
     * . + . . 1
     * . . . .
     * . . . .
     */

    it('even sides, default direction', () => {
      const c = getCenter(0, 0, 4, 4);
      deepEqual(c, [ 1, 1 ]);
    });

    it('return center coords for rect with odds sides #2', () => {
      const c = getCenter(1, 1, 5, 3);
      deepEqual(c, [ 3, 2 ]);
    });

    /*
     *   0 1 2 3 4 5 6 7
     * 0 . . . . . . . .
     * 1 . . . . . . . .
     * 2 . . # # # # # .
     * 3 . . # # # # # .
     * 4 . . # # + # # .
     * 5 . . # # # # # .
     * 6 . . # # # # # .
     */

    it('return center coords for rect with odds sides #3', () => {
      const c = getCenter(2, 2, 5, 5);
      deepEqual(c, [ 4, 4 ]); // TODO fix it
    });

  });

});
