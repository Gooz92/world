import { getCenter } from 'utils/common/geomentry.utils.js';
import Direction from 'model/Direction.enum.js';
import ObjectType from 'model/ObjectType.enum.js';

const hash = (x, y) => `${x}-${y}`;

const MAX_WOOD_PER_TILE = 80;

export function isResourceCanBePlacedOnTile(tile) {
  return tile.terrain === ObjectType.STOCK &&
    (!tile.object || tile.object.amount < MAX_WOOD_PER_TILE);
}

export function findStockTile(tx, ty, tiles) { // TODO: cycle coords ?
  const tile = tiles[ty][tx];
  const { x, y, width, height } = tile.area;
  const [ cx, cy ] = getCenter(x, y, width, height);

  const visited = {};

  const queue = [
    [ cx, cy ]
  ];

  do {
    const [ x, y ] = queue.shift();

    const nextTile = tiles[y][x];

    if (isResourceCanBePlacedOnTile(nextTile)) {
      return [ x, y ];
    }

    for (let i = 0; i < Direction.axial.length; i++) {
      const { dx, dy } = Direction.axial[i];

      const nx = x + dx,
        ny = y + dy;

      if (visited[hash(nx, ny)]) {
        continue;
      }

      queue.push([ nx, ny ]);
    }

    visited[hash(x, y)] = true;

  } while (queue.length > 0);

  return null; // TODO ?
}
