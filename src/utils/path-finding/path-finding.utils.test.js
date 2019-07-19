import { smoothPath, expandPath, getNextCoordinate } from './path-finding.utils.js';

import { deepEqual, equal } from 'utils/common/assertion.js';

import { last } from 'utils/common/array.utils.js';
import { getTrue } from 'utils/common/fn.utils.js';
import Direction from 'model/Direction.enum.js';

describe('smoothPath', function () {
  // cost or length ?
  it('smoothed path contains start and end points', () => {

    const start = [ 1, 7 ];
    const middle = [ 1, 4 ];
    const end = [ 4, 1 ];

    const path = [
      { position: start, direction: Direction.fromPoints(start, middle) },
      { position: middle, direction: Direction.fromPoints(middle, end) },
      { position: end, direction: null }
    ];

    const smoothed = smoothPath(path, getTrue);

    deepEqual(smoothed[0], path[0]);
    deepEqual(last(smoothed), last(path));
  });

  it('works with cycled coordinate', () => {

    const width = 16, height = 20;

    const start = [ 3, 0 ];
    const middle = [ 3, 19 ];
    const end = [ 2, 18 ];

    const path = [
      { position: start, direction: Direction.NORTH },
      { position: middle, direction: Direction.fromPoints(middle, end) },
      { position: end, direction: null }
    ];

    const smoothed = smoothPath(path, getTrue, width, height).map(node => node.position);
    deepEqual(smoothed, [ [ 3, 0 ], [ 2, 18 ] ]);

  });

});

describe('expandPath', function () {

  it('expand horizontal path', () => {
    const path = [
      { position: [ 4, 2 ], direction: Direction.EAST },
      { position: [ 7, 2 ], direction: null }
    ];

    const expanded = expandPath(path, 10, 10);

    deepEqual(expanded, [ [ 4, 2 ], [ 5, 2 ], [ 6, 2 ], [ 7, 2 ] ]);
  });

  it('work with cycled coordinates', () => {
    const path = [
      { position: [ 2, 2 ], direction: Direction.WEST },
      { position: [ 4, 2 ] }
    ];

    const expaned = expandPath(path, 6, 4);

    deepEqual(expaned, [ [ 2, 2 ], [ 1, 2 ], [ 0, 2 ], [ 5, 2 ], [ 4, 2 ] ]);
  });

});

describe('getNextCoordinate()', function () {

  it('do no change coordinate if direction not changed', () => {
    const start = 1, end = 2, direction = 1, bound = 3;

    const next = getNextCoordinate(start, end, direction, bound);

    equal(next, end);
  });

  it('get relative next less than zero', () => {
    const start = 2, end = 8, direction = -1, bound = 10;

    const actualNext = getNextCoordinate(start, end, direction, bound);
    const expectedNext = end - bound;

    equal(actualNext, expectedNext);
  });

  it('get relative next great than upper bound', () => {
    const start = 8, end = 3, direction = 1, bound = 10;

    const actualNext = getNextCoordinate(start, end, direction, bound);
    const expectedNext = end + bound;

    equal(actualNext, expectedNext);
  });

});
