import { findPath } from './find-path.js'
import TILE_TYPES from './tile-types.js';

let path;

export default function step(world) {

  const [ y, x ] = world.man;

  if (!path) {
    path = findPath(world.cells, y, x, (x, y) => world.cells[y][x].type === TILE_TYPES.TREE);
    if (path.length === 0) return [ x, y ];
  }

  const [ nextX, nextY ] = path.shift();

  world.man = [ nextX, nextY ];

  if (path.length === 0) {
    path = null;
  }

  world.cells[nextY][nextX].type = 7;

  // command
  return [ nextX, nextY ];
}
