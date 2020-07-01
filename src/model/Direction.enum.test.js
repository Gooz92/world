import Direction from 'model/Direction.enum.js';
import { equal } from 'utils/common/assertion.js';

describe('Direction.enum', function () {

  const {
    NORTH_WEST, NORTH, NORTH_EAST,
    WEST, /*        */ EAST,
    SOUTH_WEST, SOUTH, SOUTH_EAST
  } = Direction;

  describe('.fromPoints', function () {

    const Y0 = 42, X0 = 24;

    [
      [ [ 1, Y0 ], [ 3, Y0 ], EAST ],
      [ [ 4, Y0 ], [ 2, Y0 ], WEST ],
      [ [ X0, 5 ], [ X0, 8 ], SOUTH ],
      [ [ X0, 9 ], [ X0, 6 ], NORTH ],
      [ [ 1, 2 ], [ 2, 3 ], SOUTH_EAST ],
      [ [ 4, 5 ], [ 3, 4 ], NORTH_WEST ],
      [ [ 3, 4 ], [ 2, 5 ], SOUTH_WEST ],
      [ [ 2, 5 ], [ 3, 4 ], NORTH_EAST ]
    ].forEach(([ [ x0, y0 ], [ x1, y1 ], expected ]) => {
      it(`[ ${x0}, ${y0} ] -> [ ${x1}, ${y1} ] : ${expected.name}`, () => {
        const actual = Direction.fromPoints([ x0, y0 ], [ x1, y1 ]);
        equal(actual, expected, `${actual.name} != ${expected.name}`);
      });
    });

  });

  describe('#isOpposite(direction)', function () {

    [
      [ NORTH, SOUTH, true ],
      [ EAST, WEST, true ],
      [ SOUTH_EAST, NORTH_WEST, true ],
      [ SOUTH_WEST, NORTH_EAST, true ],

      [ SOUTH, WEST, false ],
      [ NORTH, NORTH, false ],
      [ NORTH_WEST, NORTH_EAST, false ]
    ].forEach(([ direction1, direction2, result ]) => (
      it(`${direction1.name}.isOpposite(${direction2.name}) is ${result}`, () => {
        equal(direction1.isOpposite(direction2), result);
      })
    ));

  });

});
