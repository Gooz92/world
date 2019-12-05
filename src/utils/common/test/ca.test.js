import { getNeighbors } from '../ca.js';
import { deepEqual } from '../assertion.js';

describe('ca', function () {

  describe('getNeighbors', function () {

    it('works', () => {
      const tiles = [
        '.n.',
        'w.e',
        '.s.'
      ].map(row => row.split(''));

      const n = getNeighbors(1, 1, 1, tiles);

      deepEqual(n, [
        [ 'n', 'e', 's', 'w' ]
      ]);
    });
  });
});

describe('tree-and-food', function () {

});


/**
 *
 * pow(2, 20) = 1 048 576
 *   . . .
 * . . . . .
 * . . % . .
 * . . . . .
 *   . . .
 */
