import * as geometryUtils from '../geomentry.utils.js';
import { deepEqual } from '../assertion.js';
import Direction from 'model/Direction.enum.js';

describe('geometryUtils', function () {

  describe('getCenter', function () {

    const getCenter = geometryUtils.getCenter;

    /*
     *     2
     * . . . . .
     * . . + . . 1
     * . . . . .
     */

    it('return center coords for rect with odds sides', () => {
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

    /**
     *   1
     * . . . .
     * . . . . 1
     * . + . .
     * . . . .
     */

    it('even sides, south direction', () => {
      const c = getCenter(0, 0, 4, 4, Direction.SOUTH);
      deepEqual(c, [ 1, 2 ]);
    });

    /**
     *     2
     * . . . .
     * . . + . 1
     * . . . .
     * . . . .
     */

    it('even sides, east direction', () => {
      const c = getCenter(0, 0, 4, 4, Direction.EAST);
      deepEqual(c, [ 2, 1 ]);
    });

  });

});
