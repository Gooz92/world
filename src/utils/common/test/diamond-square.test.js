import { generateStartPoints } from '../diamond-square';
import { deepEqual } from '../assertion.js';

describe('Diamond Square', function () {
  describe('generateStartPoints()', function () {
    it('works', () => {
      const rs = 42;

      const points = generateStartPoints(3, 2, rs);

      deepEqual(points, [
        [ 0, 0 ], [ rs, 0 ], [ rs * 2, 0 ],
        [ 0, rs ], [ rs, rs ], [ rs * 2, rs ]
      ]);

    });
  });
});
