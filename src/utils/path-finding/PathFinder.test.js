import PathFinder from './PathFinder';
import { deepEqual, equal, isTrue } from 'utils/common/assertion.js';
import { generateArray } from 'utils/common/array.utils.js';
import { identity, getFalse } from 'utils/common/fn.utils.js';
import Direction from 'model/Direction.enum';

describe('PathFinder', function () {

  describe('#find', function () {

    const createFinder = () => new PathFinder({
      isTileFound: identity
    });

    it('return shortest path between points on same horizontal', () => {

      const tiles = generateArray(5, 5, getFalse);

      const y0 = 2, startX = 1, endX = 3;

      tiles[y0][endX] = true;

      const finder = createFinder();

      const path = finder.find(tiles, startX, y0);
      const positions = path.map(node => node.position);

      deepEqual(positions, [ [ 2, y0 ], [ endX, y0 ] ]);
    });

    // strairs, hills ?
    it('space is isotropic', () => {
      const tiles = generateArray(120, 90, getFalse);

      const x0 = 40, y1 = 42;
      const x1 = 62, y0 = 58;

      const finder = createFinder();

      tiles[y1][x1] = true;

      const aPath = finder.find(tiles, x0, y0);

      tiles[y1][x1] = false;
      tiles[y0][x0] = true;

      const bPath = finder.find(tiles, x1, y1);

      equal(aPath.length, bPath.length);
    });

    it('calculate directions straight path', () => {
      const tiles = generateArray(9, 16, getFalse);

      const x1 = 4, x2 = 7, y0 = 5;

      const finder = createFinder();

      tiles[y0][x2] = true;

      const path = finder.find(tiles, x1, y0);

      isTrue(path.every(({ direction }) => direction === Direction.EAST));
    });

    it('calculate directions in bend',() => {
      const tiles = generateArray(18, 32, getFalse);

      const finder = createFinder();

      const x0 = 12, y0 = 7;
      const x1 = 18, y1 = 8;

      tiles[y1][x1] = true;

      /**
       *    ###
       * ###
       *
       */

      const path = finder.find(tiles, x0, y0);

      equal(path[3].direction, Direction.SOUTH_EAST);
    });
  });

});
