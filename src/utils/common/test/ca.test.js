import { getNeighbors, updateFcell, EMPTY, FOOD } from '../ca.js';
import { deepEqual, equal } from '../assertion.js';
import { generateArray } from '../array.utils.js';
import { getFalse } from '../fn.utils.js';

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

  describe('updateFcell', function () {
    it('remove foor if ther are no trees around', () => {
      const x0 = 2, y0 = 2;
      const world = generateArray(5, 5, getFalse);
      world[y0][x0] = 2;
      const neighbors = getNeighbors(x0, y0, 4, world);
      const cell = updateFcell(FOOD, neighbors);
      equal(cell, EMPTY);
    });
  });
});


/**
 *
 * pow(2, 20) = 1 048 576
 *
 *   . . .
 * . . . . .
 * . . % . .
 * . . . . .
 *   . . .
 *
 *   . . .
 * . . o . .
 * . . - o .
 * . . o . .
 *   . . .
 *
 *   . . .
 * . o . o .
 * . . - . .
 * . o . o .
 *   . . .
 *
 *   . . .
 * . o . o .
 * . . - . .
 * . o . o .
 *   . . .
 *
 */
