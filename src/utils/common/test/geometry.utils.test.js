import * as geometryUtils from '../geomentry.utils.js';
import { deepEqual } from '../assertion.js';

describe('geometryUtils', function () {

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

    /**
     *     2
     * . . . .
     * . . . .
     * . . + . 2
     * . . . .
     */

    it('even sides, default direction', () => {
      const c = getCenter(0, 0, 4, 4);
      deepEqual(c, [ 2, 2 ]);
    });

  });

});
