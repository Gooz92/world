import { compressPath, smoothPath, expandPath } from './path-finding.utils.js';

import { deepEqual } from 'utils/common/assertion.js';

import { last } from 'utils/common/array.utils.js';
import { getTrue } from 'utils/common/fn.utils.js';

describe('compressPath', function () {

  it('compress horizontal path', () => {
    const path = [
      [ 4, 2 ], [ 5, 2 ], [ 6, 2 ], [ 7, 2 ], [ 8, 2 ], [ 9, 2 ]
    ];

    const compressed = compressPath(path);

    deepEqual(compressed, [ path[0], last(path) ]);
  });

  it('compress vertical path', () => {
    const path = [
      [ 2, 4 ], [ 2, 5 ], [ 2, 6 ], [ 2, 7 ], [ 2, 8 ], [ 2, 9 ]
    ];

    const compressed = compressPath(path);

    deepEqual(compressed, [ path[0], last(path) ]);
  });

  it('compress diagonal path', () => {
    const path = [
      [ 1, 2 ], [ 2, 3 ], [ 3, 4 ], [ 4, 5 ], [ 5, 6 ]
    ];

    const compressed = compressPath(path);

    deepEqual(compressed, [ path[0], last(path) ]);
  });

  it('compress complex path', () => {
    const path = [
      [ 1, 2 ], [ 2, 3 ], [ 3, 4 ], [ 4, 5 ], [ 5, 6 ],
      [ 5, 5 ], [ 5, 4 ], [ 5, 3 ],
      [ 4, 3 ], [ 3, 3 ], [ 2, 3 ], [ 1, 3 ]
    ];

    const compressed = compressPath(path);

    deepEqual(compressed, [ [ 1, 2 ], [ 5, 6 ], [ 5, 3 ], [ 1, 3 ] ]);
  });

});

describe('smoothPath', function () {
  // cost or length ?
  it('should not start and end points', () => {

    const path = [
      [ 1, 7 ], [ 1, 4 ], [ 4, 1 ]
    ];

    const smoothed = smoothPath(path, getTrue);

    deepEqual(smoothed[0], path[0]);
    deepEqual(last(smoothed), last(path));
  });

});

describe('expandPath', function () {

  it('expand horizontal path', () => {
    const path = [ [ 4, 2 ], [ 7, 2 ] ];
    const expanded = expandPath(path);

    deepEqual(expanded, [ [ 4, 2 ], [ 5, 2 ], [ 6, 2 ], [ 7, 2 ] ]);
  });

});
