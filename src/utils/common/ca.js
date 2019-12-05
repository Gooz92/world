import { getCycleCoordinate } from './math.utils';


// params:
/*
 * Neighborhoods size:
 *
 * 0

/*

      6
  6 5 4 5 6
  5 3 2 3 5
6 4 2 0 2 4 6
  5 3 2 3 5
  6 5 4 5 6
      6

*/

/*

      5
  5 4 3 4 5
  4 2 1 2 4
5 3 1 0 1 3 5
  4 2 1 2 4
  5 4 3 4 5
      5

*/


/*

      5
  5 4 3 4 5
  4 2 1 2 4
5 3 1 0 1 3 5
  4 2 1 2 4
  5 4 3 4 5
      5

*/

const OFFSETS = [
  [
    [ 0, -1 ], [ 1, 0 ],
    [ 0, 1 ], [ -1, 0 ]
  ],
  [
    [ 1, -1 ], [ 1, 1 ],
    [ -1, 1 ], [ -1, -1 ]
  ],
  [
    [ 0, 2 ], [ 2, 0 ],
    [ 0, -2 ], [ -2, 0 ]
  ],
  [
    [ 1, -2 ], [ 2, -1 ],
    [ 2, 1 ], [ 1, 2 ],
    [ -1, 2 ], [ -2, 1 ],
    [ -2, -1 ], [ -1, -2 ]
  ]
];

export function getNeighbors(x0, y0, r, tiles) {
  const neighbors = [];
  for (let i = 0; i < r; i++) {
    const levelOffsets = OFFSETS[i];
    const levelNeighbors = [];
    levelOffsets.forEach(([ dx, dy ]) => {
      const x = getCycleCoordinate(x0 + dx, tiles[0].length);
      const y = getCycleCoordinate(y0 + dy, tiles.length);
      levelNeighbors.push(tiles[y][x]);
    });
    neighbors.push(levelNeighbors);
  }
  return neighbors;
}

export function nextGeneration(tiles, update, r = 2) {
  const next = [];
  for (let y = 0; y < tiles.length; y++) {
    const row = [];
    for (let x = 0; x < tiles[y].length; x++) {
      const neighbors = getNeighbors(x, y, r, tiles);
      const tile = update(tiles[y][x], neighbors);
      row.push(tile);
    }
    next.push(row);
  }
  return next;
}
