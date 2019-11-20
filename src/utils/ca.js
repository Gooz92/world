/*

      6
  6 5 4 5 6
  5 3 2 3 5
6 4 2 0 2 4 6
  5 3 2 3 5
  6 5 4 5 6
      6

*/

const OFFSETS = [
  [
    [ 0, 1 ], [ 0, -1 ],
    [ 1, 0 ], [ -1, 0 ]
  ],
  [
    [ 1, 1 ], [ 1, -1 ],
    [ -1, 1 ], [ -1, -1 ]
  ],
  [
    [ 0, 2 ], [ 2, 0 ],
    [ 0, -2 ], [ -2, 0 ]
  ]
];

function calculateNeighbors(tiles, x0, y0, offsets) {
  let count = 0;
  offsets.forEach(([ dx, dy ]) => {
    const x = x0 + dx, y = y0 + dy;
    if (tiles[x][y]) {
      ++count;
    }
  });

  return count;
}

function nextGeneration(tiles) {
  const next = [];
  for (let y = 0; y < tiles.length; y++) {
    const row = [];
    for (let x = 0; x < tiles[y].length; x++) {
      let count = 0; // MAX = 24
      OFFSETS.forEach((offsets, index) => {
        count += (3 - index) * calculateNeighbors(tiles, x, y, offsets);
      });

      if (tiles[y][x]) {
        if (count < 3 || count > 12) {
          row[x] = false;
        }
      }

      if (count > 6 && count < 10) {
        row[x] = true;
      }
    }
    next.push(row);
  }
}