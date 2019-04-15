import PathFinder from './PathFinder';
import { assert } from 'chai';

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

      const found = tile => tile === 2;

      const finder = new PathFinder({
        onAxialTile: function (tile) {
          return found(tile) ? this.found(tile) : 0;
        },
        onDiagonalTile: function (tile) {
          return found(tile) ? this.found(tile) : 0;
        }
      });

      const { path } = finder.find(emptyWorld, startX, startY);

      assert.deepStrictEqual(path, [ [ 2, 2 ] ]);
    });

  });

});
