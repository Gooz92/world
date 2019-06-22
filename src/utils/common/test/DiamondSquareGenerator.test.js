import {
  diamond, square,
  default as diamondSquareGenerator
} from '../DiamondSquareGenerator.js';

import { equal, deepEqual } from '../assertion.js';
import spy from 'test-utils/spy.js';
import { first } from '../array.utils.js';

describe('Diamond Square', function () {

  describe('diamond()', function () {

    it('#1', () => {
      const width = 4, height = 4, side = 2;
      const next = spy();
      const map = [
        1, 0, 2, 0,
        0, 0, 0, 0,
        3, 0, 4, 0,
        0, 0, 0, 0
      ];

      diamond(map, width, height, side, next);

      const neighbors = next.calls.map(first);

      deepEqual(neighbors, [
        [ 1, 2, 3, 4 ],
        [ 2, 1, 4, 3 ],
        [ 3, 4, 1, 2 ],
        [ 4, 3, 2, 1 ]
      ]);
    });

    it('#2', () => {

      const width = 8, height = 8, side = 4;
      const next = spy();
      const _ = 0;
      const x = 42;
      const map = [
        1, _, _, _, 2, _, _, _,
        _, _, _, _, _, _, _, _,
        _, _, x, _, _, _, x, _,
        _, _, _, _, _, _, _, _,
        3, _, _, _, 4, _, _, _,
        _, _, _, _, _, _, _, _,
        _, _, x, _, _, _, x, _,
        _, _, _, _, _, _, _, _
      ];

      diamond(map, width, height, side, next);

      const neighbors = next.calls.map(first);

      deepEqual(neighbors, [
        [ 1, 2, 3, 4 ],
        [ 2, 1, 4, 3 ],
        [ 3, 4, 1, 2 ],
        [ 4, 3, 2, 1 ]
      ]);

    });

  });

  describe('square()', function () {

    it('#1', () => {
      const width = 4, height = 4;
      const _ = 0;
      const next = spy();

      const map = [
        1, _, 2, _,
        _, 3, _, 4,
        5, _, 6, _,
        _, 7, _, 8
      ];

      square(map, width, height, 2, next);

      const neighbors = next.calls.map(first);

      deepEqual(neighbors, [
        [ 7, 2, 3, 1 ],
        [ 8, 1, 4, 2 ],
        [ 1, 3, 5, 4 ],
        [ 2, 4, 6, 3 ],
        [ 3, 6, 7, 5 ],
        [ 4, 5, 8, 6 ],
        [ 5, 7, 1, 8 ],
        [ 6, 8, 2, 7 ]
      ]);
    });

  });

  describe('generateStartPoints()', function () {

    it('distance between neighbors points should be equal to region size', () => {
      const rows = 3;
      const cols = 2;
      const cellSize = 42;

      const generator = diamondSquareGenerator()
        .setRows(rows)
        .setCols(cols)
        .setCellSize(cellSize)
        .build();

      const points = generator.$generateStartPoints();

      for (let i = 0; i < rows; i++) {

        const firstInRowIndex = i * cols;

        for (let j = 1; j < cols - 1; j++) {
          const index = firstInRowIndex + j;
          const p1 = points[index];
          const p2 = points[index + 1];

          equal(p2[0] - p1[0], cellSize);
        }
      }

    });
  });

});
