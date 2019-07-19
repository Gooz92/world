import PathFinder from './PathFinder';
import { deepEqual, equal } from 'utils/common/assertion.js';
import { generateArray } from 'utils/common/array.utils.js';
import { identity, getFalse } from 'utils/common/fn.utils.js';

describe('PathFinder', function () {

  describe('#find', function () {

    const createFinder = () => new PathFinder({
      isTileFound: identity
    });

    it('return shortest path between points on same horizontal', () => {

      const world = generateArray(5, 5, getFalse);

      const y0 = 2, startX = 1, endX = 3;

      world[y0][endX] = true;

      const finder = createFinder();

      const { path } = finder.find(world, startX, y0);

      deepEqual(path, [ [ 2, 2 ] ]);
    });

    // strairs, hills ?
    it('space is isotropic', () => {
      const world = generateArray(120, 90, getFalse);

      const x0 = 40, y1 = 42;
      const x1 = 62, y0 = 58;

      const finder = createFinder();

      world[y1][x1] = true;

      const aPath = finder.find(world, x0, y0);

      world[y1][x1] = false;
      world[y0][x0] = true;

      const bPath = finder.find(world, x1, y1);

      equal(aPath.path.length, bPath.path.length);
    });

  });

});
