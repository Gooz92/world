import interpolate from 'interpolate.js';

function generateRectPositions(x1, y1, x2, y2) {
  const positions = [];

  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      positions.push([ x, y ]);
    }
  }

  return positions;
}

export default [
  /*
     0 1 2 3 4 5 6 7 8 9 a
     # # # # # # # # # # # 0
     # . . . . . . . . . # 1
     # . . b . . . a . . # 2
     # . . . . . . . . . # 3
     # . . . . x . . . . # 4
     # . . . . . . . . . # 5
     # . . A . . . B . . # 6
     # # # # # # # # # # # 7
           3       7
  */
  {
    name: 'no frontal #1',
    data: {
      walks: [
        interpolate(3, 6, 7, 2),
        interpolate(7, 6, 3, 2)
      ],
      width: 11,
      height: 8
    }
  },

  /*
    0 1 2 3 4 5 6
    # # # # # # # 0
    # . . . . . # 1
    # . . . . . # 2
    # . . @ . . # 3
    # . . . . . # 4
    # . . . . . # 5
    # . . . . . # 6
    # . . @ . . # 7
    # . . . . . # 8
    # . . . . . # 9
    # # # # # # # a
  */
  {
    name: 'frontal #1',
    data: {
      walks: [
        interpolate(3, 3, 3, 8),
        interpolate(3, 7, 3, 2)
      ],
      width: 7,
      height: 11
    }
  },
  {
    name: 'vertical collision (try to occupy each other tiles)',
    data: {
      walks: [
        [ [ 3, 2 ], [ 3, 3 ], [ 3, 4 ], [ 3, 5 ], [ 3, 6 ], [ 3, 7 ] ],
        [ [ 3, 7 ], [ 3, 6 ], [ 3, 5 ], [ 3, 4 ], [ 3, 3 ], [ 3, 2 ] ]
      ],
      width: 7,
      height: 10
    }
  },
  {
    name: 'verical swap',
    skip: true,
    data: {
      walks: [
        [ [ 2, 2 ], [ 2, 3 ] ],
        [ [ 2, 3 ], [ 2, 2 ] ]
      ],
      width: 5,
      height: 7
    }
  },
  {
    name: 'multiple actors collisions #1',
    skip: true,
    data: {
      walks: [
        [ [ 4, 2 ], [ 4, 3 ], [ 4, 4 ], [ 4, 5 ], [ 4, 6 ] ],
        [ [ 2, 4 ], [ 3, 4 ], [ 4, 4 ], [ 5, 4 ], [ 6, 4 ] ],
        [ [ 6, 4 ], [ 5, 4 ], [ 4, 4 ], [ 3, 4 ], [ 2, 4 ] ],
        [ [ 4, 6 ], [ 4, 5 ], [ 4, 4 ], [ 4, 3 ], [ 4, 2 ] ]
      ],
      width: 9,
      height: 9
    }
  },

  /*
   *   0 1 2 3 4 5 6 7 8 9
   * 0 # # # # # # # # # # # #
   * 1 # . . . . . . . . . . #
   * 2 # . . . . . . . . . . #
   * 3 # . . @ @ @ @ @ @ . . #
   * 4 # . . @ @ @ @ @ @ . . #
   * 5 # . . @ @ . . . . . . #
   * 6 # . . @ @ . . . . . . #
   * 7 # . . @ @ . . @ . . . #
   * 8 # . . . . . . . . . . #
   * 9 # . . . . . . . . . . #
   *   # # # # # # # # # # # #
   */
  {
    name: 'flee',
    skip: true,
    data: {
      walks: [
        [ [ 7, 7 ], [ 6, 6 ], [ 5, 5 ], [ 4, 4 ], [ 3, 3 ], [ 2, 2 ] ]
      ],
      idlers: [
        ...generateRectPositions(3, 3, 8, 4),
        ...generateRectPositions(3, 5, 4, 7)
      ],
      width: 12,
      height: 11
    }
  },

  /*
   * 0 1 2 3 4 5 6
   * # # # # # # # 0
   * # . . . . . # 1
   * # . . . @ . # 2
   * # . # . # . # 3
   * # . # . # . # 4
   * # . # . # . # 5
   * # . # . # . # 6
   * # . # . # . # 7
   * # . @ . . . # 8
   * # . . . . . # 9
   * # # # # # # #
   *
   */
  {
    name: 'tunnel',
    skip: true,
    data: {
      walks: [
        [ [ 4, 2 ], [ 3, 3 ], [ 3, 4 ], [ 3, 5 ], [ 3, 6 ], [ 3, 7 ], [ 3, 8 ] ],
        [ [ 2, 8 ], [ 3, 7 ], [ 3, 6 ], [ 3, 5 ], [ 3, 4 ], [ 3, 3 ], [ 3, 2 ] ]
      ],
      obstacles: [
        ...generateRectPositions(2, 3, 2, 7),
        ...generateRectPositions(4, 3, 4, 7)
      ],
      width: 7,
      height: 11
    }
  }
];
