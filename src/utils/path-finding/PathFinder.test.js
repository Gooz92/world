import PathFinder from './PathFinder';
import { deepEqual } from 'utils/common/assertion.js';

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

      const { path } = finder.find(emptyWorld, startX, startY);
      deepEqual(path, [ [ 2, 2 ] ]);
    });

  });

});
