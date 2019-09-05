export const COLLISIONS = [
  {
    title: 'vertical collision (try to occupy same tile [ 3, 4 ])',
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
    title: 'vertical collision (try to occupy each other tiles)',
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
    title: 'diagonal collision try to occupy same tile [ 4, 4 ]',
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
    title: 'diagonal collision try to occupy each other tiles',
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
    title: 'verical swap',
    data: {
      walks:[
        [ [ 2, 2 ], [ 2, 3 ] ],
        [ [ 2, 3 ], [ 2, 2 ] ]
      ],
      width: 5,
      height: 7
    }
  }
];
