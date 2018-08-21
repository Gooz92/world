import findPath from './find-path.js';
import { assert } from 'chai';

const emptyWorld = [
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0 ]
];

describe('findPath', function () {

  it('return shortest path between points on same horizontal', () => {

    const y0 = 2;
    const startX = 1, endX = 3;

    const isFound = (x, y) => x === endX && y === y0;

    const path = findPath(emptyWorld, startX, y0, isFound);

    assert.deepEqual(path, [ [ startX + 1, y0], [ endX, y0 ] ]);
  });

});
