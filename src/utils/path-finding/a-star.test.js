import findPath from './a-star.js';
import { deepEqual } from 'utils/common/assertion.js';
import { generateArray } from 'utils/common/array.utils.js';
import { getFalse } from 'utils/common/fn.utils.js';

describe('findPath', function () {

  it('return shortest path between points on same horizontal', () => {

    const tiles = generateArray(5, 5, getFalse);

    const y0 = 2, startX = 1, endX = 3;

    tiles[y0][endX] = true;

    const path = findPath(tiles, startX, y0, endX, y0);
    const positions = path.map(node => node.position);

    deepEqual(positions, [ [ 2, y0 ], [ endX, y0 ] ]);
  });

});
