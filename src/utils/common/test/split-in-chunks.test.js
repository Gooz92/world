import splitInChunks from '../split-in-chunks.js';
import { deepEqual } from '../assertion.js';

describe('splitInChunks', function () {

  const tiles = [
    [ 10, 11, 12, 13 ],
    [ 14, 15, 16, 17 ],
    [ 18, 19, 20, 21 ],
    [ 22, 23, 24, 25 ]
  ];

  it('works', () => {
    const chunks = splitInChunks(tiles, 2);

    deepEqual(chunks, [
      { tiles: [ 10, 11, 14, 15 ] },
      { tiles: [ 12, 13, 16, 17 ] },
      { tiles: [ 18, 19, 22, 23 ] },
      { tiles: [ 20, 21, 24, 25 ] }
    ]);

  });

});
