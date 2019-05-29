import { generateStartPoints } from '../diamond-square';
import { equal } from '../assertion.js';

describe('Diamond Square', function () {
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
