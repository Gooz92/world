import findPath from './a-star.js';
import { deepEqual } from 'utils/assertion.js';
import { getTrue } from 'utils/common/fn.utils.js';

describe('findPath', function () {

  it('return shortest path between points on same horizontal', () => {

    const y0 = 2, startX = 1, endX = 3;

    const path = findPath(getTrue, startX, y0, endX, y0);
    const positions = path.map(node => node.position);

    deepEqual(positions, [ [ 2, y0 ], [ endX, y0 ] ]);
  });

});
