import { findPath } from './find-path.js'
import TILE_TYPES from './tile-types.js';

let path;

const isTreeFound = (tiles, x, y) => (
  tiles[y][x].type === TILE_TYPES.TREE
);

const isPassable = (tiles, x, y) => (
  tiles[y][x].type !== TILE_TYPES.OBSTACLE
);

export default function step(world) {

  const [ y, x ] = world.man;

  if (!path) {
    path = findPath(world.cells, y, x, isTreeFound, isPassable);
    if (path.length === 0) return [ x, y ];
  }

  const [ nextX, nextY ] = path.shift();

  world.man = [ nextX, nextY ];

  if (path.length === 0) {
    path = null;
  }

  world.cells[nextY][nextX].type = TILE_TYPES.PERSON;

  // command
  return [ nextX, nextY ];
}
