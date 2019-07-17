import PathFinder from './PathFinder';
import { deepEqual, equal, isTrue } from 'utils/common/assertion.js';
import { generateArray, last } from 'utils/common/array.utils.js';
import { identity, getFalse } from 'utils/common/fn.utils.js';
import Direction from 'model/Direction.enum.js';

const emptyWorld = [
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ],
  [ 0, 1, 0, 2, 0 ],
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ]
];

describe('PathFinder', function () {

  describe('#find', function () {

    it('return shortest path between points on same horizontal', () => {

      const startY = 2;
      const startX = 1;

      const finder = new PathFinder({
        isTileFound: tile => tile === 2
      });

      const path = finder.find(emptyWorld, startX, startY).path
        .map(node => node.position);

      deepEqual(path, [ [ 2, 2 ] ]);
    });

    // strairs, hills ?
    it('space is isotropic', () => {
      const world = generateArray(120, 90, getFalse);

      const x0 = 40, y1 = 42;
      const x1 = 62, y0 = 58;

      const finder = new PathFinder({
        isTileFound: identity
      });

      world[y1][x1] = true;

      const aPath = finder.find(world, x0, y0);

      world[y1][x1] = false;
      world[y0][x0] = true;

      const bPath = finder.find(world, x1, y1);

      equal(aPath.path.length, bPath.path.length);
    });

    it('calcuate directions in path', () => {

      const world = generateArray(12, 8, getFalse);

      const x0 = 5, y0 = 2;
      const x1 = 5, y1 = 10;

      world[y1][x1] = true;

      const finder = new PathFinder({
        isTileFound: identity
      });

      const { path } = finder.find(world, x0, y0);

      isTrue(path.every(node => node.direction === Direction.NORTH));
    });
  });

  describe('#find path control points', () => {

    const find = () => {
      const world = generateArray(14, 12, getFalse);

      const x0 = 5, y0 = 2;
      const x1 = 5, y1 = 10;

      world[y1][x1] = true;

      const finder = new PathFinder({
        isTileFound: identity
      });

      const { path } = finder.find(world, x0, y0);

      return path;
    };

    it('start point is control', () => {
      const path = find();
      isTrue(path[0].isControl);
    });

    it('end point is control', () => {
      const path = find();
      isTrue(last(path).isControl);
    });

  });

});
