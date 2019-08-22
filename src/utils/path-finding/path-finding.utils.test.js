import {
  backtracePath,
  compressPath,
  smoothPath,
  expandPath,
  getNextCoordinate
} from './path-finding.utils.js';

import { deepEqual, equal, isTrue } from 'utils/common/assertion.js';

import { last, isArraysEqual } from 'utils/common/array.utils.js';
import { getTrue } from 'utils/common/fn.utils.js';
import Direction from 'model/Direction.enum.js';
import { buildLinkedList } from './path-finding.test-utils.js';

const getPosition = node => node.position;

describe('backtracePath', function () {
  it('build path from linked list', () => {
    const x0 = 2, l0 = 5, l1 = 3;
    const path = [];

    for (let i = 0; i < l0; i++) {
      path.push({
        position: [ x0, i ],
        direction: Direction.SOUTH
      });
    }

    for (let i = 0; i < l1; i++) {
      path.push({
        position: [ x0 + i + 1, l0 + i ],
        direction: Direction.SOUTH_EAST
      });
    }

    const node = buildLinkedList(path, (node, data) => {
      Object.assign(node, data);
    });

    const processedPath = backtracePath(node);

    // cut off start path node
    equal(processedPath.length, path.length - 1);

    path.shift();

    isTrue(processedPath.every((node, index) => (
      node.direction === path[index].direction &&
        isArraysEqual(node.position, path[index].position)
    )));

  });
});

describe('compressPath', function () {

});

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

    const smoothed = smoothPath(path, getTrue, width, height).map(getPosition);
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
    const positions = expanded.map(getPosition);

    deepEqual(positions, [ [ 4, 2 ], [ 5, 2 ], [ 6, 2 ], [ 7, 2 ] ]);
  });

  it('work with cycled coordinates', () => {
    const path = [
      { position: [ 2, 2 ], direction: Direction.WEST },
      { position: [ 4, 2 ] }
    ];

    const expanded = expandPath(path, 6, 4);
    const positions = expanded.map(getPosition);

    deepEqual(positions, [ [ 2, 2 ], [ 1, 2 ], [ 0, 2 ], [ 5, 2 ], [ 4, 2 ] ]);
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
