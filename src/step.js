import findPath from './find-path.js'
import TILE_TYPES from './tile-types.js';
import { isUndefined } from './utils/is.utils.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

const isTreeFound = (x, y, tiles) => (
  tiles[y][x].type === TILE_TYPES.TREE
);

const isPassable = (x, y, tiles) => (
  tiles[y][x].type !== TILE_TYPES.OBSTACLE
);

function move(world, object) {

  console.log(`MOVE: ${object.position.join(',')} -> ${object.nextPosition.join(',')}`);
  const prevPos = object.position;
  object.position = object.nextPosition;

  if (object.path.length === 0) {
    object.path = null;
  }

  const [ nextX, nextY ] = object.nextPosition;
  world.cells[nextY][nextX].type = TILE_TYPES.PERSON;

  object.nextPosition = null;
  object.idleTime = 0;

  const [ x, y ] = object.position;

  // command
  return {
    to: { x, y },
    from: { x: prevPos[0], y: prevPos[1] }
  };
}

function act(object, world, moves) {

  const [ x, y ] = object.position;

  if (!object.path) {
    object.path = findPath(world.cells, x, y, isTreeFound, isPassable);
    if (object.path.length === 0) return [ x, y ];
  }

  if (isUndefined(object.idleTime)) {
    object.idleTime = 0;
  }

  if (!object.nextPosition) {
    object.nextPosition = object.path.shift();
  } else {
    ++object.idleTime;
    if (isDiagonal([ x, y ], object.nextPosition)) {
      if (object.idleTime === 2) moves.push(move(world, object));
    } else {
      if (object.idleTime === 1) moves.push(move(world, object));
    }
  }
}

export default function step(world) {
  const moves = [];

  world.objects.forEach(object => act(object, world, moves));

  return moves;
}
