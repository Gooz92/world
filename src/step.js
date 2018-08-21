import findPath from './find-path.js'
import TILE_TYPES from './tile-types.js';

let path, nextPosition, idleTime = 0;

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

const isTreeFound = (x, y, tiles) => (
  tiles[y][x].type === TILE_TYPES.TREE
);

const isPassable = (x, y, tiles) => (
  tiles[y][x].type !== TILE_TYPES.OBSTACLE
);

// sates: search tree, move

function move(world) {

  console.log(`MOVE: ${world.man.join(',')} -> ${nextPosition.join(',')}`);
  world.man = nextPosition;

  if (path.length === 0) {
    path = null;
  }

  const [ nextX, nextY ] = nextPosition;
  world.cells[nextY][nextX].type = TILE_TYPES.PERSON;

  
  nextPosition = null;
  idleTime = 0;

  const [ x, y ] = world.man;

  // command
  return { x, y };
}

export default function step(world) {

  const [ x, y ] = world.man;

  if (!path) {
    path = findPath(world.cells, x, y, isTreeFound, isPassable);
    if (path.length === 0) return [ x, y ];
  }

  if (!nextPosition) {
    nextPosition = path.shift();
  } else {
    ++idleTime;
    if (isDiagonal([ x, y ], nextPosition)) {
      if (idleTime === 2) return move(world);
    } else {
      if (idleTime === 1) return move(world);
    }
  }
}
