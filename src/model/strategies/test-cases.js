function generateRectPositions(x1, y1, x2, y2) {
  const positions = [];

  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      positions.push([ x, y ]);
    }
  }

  return positions;
}

export const COLLISIONS = [
  {
    name: 'vertical collision (try to occupy same tile [ 3, 4 ])',
    data: {
      walks: [
        [ [ 3, 2 ], [ 3, 3 ], [ 3, 4 ], [ 3, 5 ], [ 3, 6 ] ],
        [ [ 3, 6 ], [ 3, 5 ], [ 3, 4 ], [ 3, 3 ], [ 3, 2 ] ]
      ],
      width: 7,
      height: 9
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
    name: 'diagonal collision try to occupy same tile [ 4, 4 ]',
    data: {
      walks: [
        [ [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ] ],
        [ [ 6, 6 ], [ 5, 5 ], [ 4, 4 ], [ 3, 3 ], [ 2, 2 ] ]
      ],
      width: 8,
      height: 8
    }
  },
  {
    name: 'diagonal collision try to occupy each other tiles',
    data: {
      walks: [
        [ [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ], [ 7, 7 ] ],
        [ [ 7, 7 ], [ 6, 6 ], [ 5, 5 ], [ 4, 4 ], [ 3, 3 ], [ 2, 2 ] ]
      ],
      width: 9,
      height: 9
    }
  },
  {
    name: 'verical swap',
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
