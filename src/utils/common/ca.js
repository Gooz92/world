import ObjectType from 'model/ObjectType.enum.js';

import { getCycleCoordinate } from './math.utils.js';
import { flatten } from './array.utils.js';
import { get } from './object.utils.js';

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

export function updateGolCell(cell, neighbors) {
  const [ n1, n2 ] = neighbors;
  const n = [ ...n1, ...n2 ];
  const count = n.filter(c => c.alive).length;
  if (count === 3) {
    return { alive: true };
  }

  if (cell.alive && [ 2, 3 ].includes(count)) {
    return { alive: true };
  }

  return { alive: false };
}

const OPPOSITES = [
  [ 2, 3, 0, 1 ],
  [
    [ 5, 4 ], [ 5, 4 ],
    [ 6, 7 ], [ 6, 7 ],
    [ 0, 1 ], [ 0, 1 ],
    [ 2, 3 ], [ 2, 3 ]
  ]
];

const TREE = ObjectType.TREE;

const getType = cell => get(cell, 'object.type');

const count = type => n => n.filter(c => getType(c) === type).length;

const countTrees = count(ObjectType.TREE);

export function updateFcell(cell, neighbors) {

  const currentObject = getType(cell);

  if (currentObject === ObjectType.TREE) return {};

  const trees1 = countTrees(neighbors[0]);

  if (trees1 > 2) { // 0,1,2
    return { object: null };
  }

  const trees2 = countTrees(neighbors[1]);

  if (trees2 === 4) { // 0,1,2,3
    return { object: null };
  }

  if (trees1 + trees2 > 3) {
    return { object: null };
  }

  const surroundings = flatten(neighbors);
  const treesCount = countTrees(surroundings);

  if (treesCount === 0) {
    return { object: null };
  }

  const s4 = neighbors[3];
  const s3 = neighbors[2];

  const s3Pairs = OPPOSITES[0].filter((i, j) => (
    getType(s3[i]) === TREE && getType(s3[j]) === TREE
  )).length;

  const s4Pairs = OPPOSITES[1].filter(([ i1, i2 ], j) => (
    getType(s4[j]) === TREE && (getType(s4[i1]) === TREE || getType(s4[i2]) === TREE)
  )).length;

  if (currentObject === ObjectType.FOOD) {
    if (s3Pairs === 0 && s4Pairs === 0) {
      return { object: null };
    }

    return { object: { type: ObjectType.FOOD } };
  }

  if (s3Pairs + s4Pairs > 2) {
    return { object: { type: ObjectType.FOOD } };
  }

  return { object: null };
}

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
      const tile = tiles[y][x];
      const neighbors = getNeighbors(x, y, r, tiles);
      const delta = update(tiles[y][x], neighbors);

      // TODO ?
      Object.assign(tile, delta);
      row.push(tile);
    }
    next.push(row);
  }
  return next;
}
