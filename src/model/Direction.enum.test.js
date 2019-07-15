import Direction from './Direction.enum.js';
import { equal } from 'utils/common/assertion.js';

describe('Direction.enum', function () {

  describe('.fromPoints', function () {

    const Y0 = 42, X0 = 24;

    [
      [ [ 1, Y0 ], [ 3, Y0 ], Direction.EAST ],
      [ [ 4, Y0 ], [ 2, Y0 ], Direction.WEST ],
      [ [ X0, 5 ], [ X0, 8 ], Direction.SOUTH ],
      [ [ X0, 9 ], [ X0, 6 ], Direction.NORTH ],
      [ [ 1, 2 ], [ 2, 3 ], Direction.SOUTH_EAST ],
      [ [ 4, 5 ], [ 3, 4 ], Direction.NORTH_WEST ],
      [ [ 3, 4 ], [ 2, 5 ], Direction.SOUTH_WEST ],
      [ [ 2, 5 ], [ 3, 4 ], Direction.NORTH_EAST ]
    ].forEach(([ [ x0, y0 ], [ x1, y1 ], expected ]) => {
      it(`[ ${x0}, ${y0} ] -> [ ${x1}, ${y1} ] : ${expected.name}`, () => {
        const actual = Direction.fromPoints([ x0, y0 ], [ x1, y1 ]);
        equal(actual, expected, `${actual.name} != ${expected.name}`);
      });
    });

  });

});
