import compressPath from './compress-path.js';
import { deepEqual } from 'utils/common/assertion.js';
import { last } from 'utils/common/array.utils.js';

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

    debugger;
    deepEqual(compressed, [ [ 1, 2 ], [ 5, 6 ], [ 5, 3 ], [ 1, 3 ] ]);
  });

});
