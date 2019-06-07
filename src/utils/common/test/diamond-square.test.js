import { diamond, square, generateStartPoints } from '../diamond-square.js';
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

      const neighbors = next.calls.map(args => args[0]);

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
        _, _, _, _, _, _, _, _,
        _, 1, _, _, _, 2, _, _,
        _, _, _, _, _, _, _, _,
        _, _, _, x, _, _, _, x,
        _, _, _, _, _, _, _, _,
        _, 3, _, _, _, 4, _, _,
        _, _, _, _, _, _, _, _,
        _, _, _, x, _, _, _, x
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
        [ 5, 7, 1, 8 ]
      ]);
    });

  });

  describe('generateStartPoints()', function () {

    it('distance between neighbors points should be equal to region size', () => {
      const hr = 3;
      const vr = 2;
      const rs = 42;

      const points = generateStartPoints(hr, vr, rs);
      const width = hr * rs;

      for (let i = 0; i < vr; i++) {

        const firstInRowIndex = i * hr;
        const lastInRowIndex = firstInRowIndex + hr - 1;

        const firstInRow = points[firstInRowIndex];
        const lastInRow = points[lastInRowIndex];

        equal(width - lastInRow[0] + firstInRow[0], rs);

        for (let j = 1; j < hr - 1; j++) {
          const index = firstInRowIndex + j;
          const p1 = points[index];
          const p2 = points[index + 1];

          equal(p2[0] - p1[0], rs);
        }
      }

    });
  });

});
