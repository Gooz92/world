/**
 * + Front collision (including swap)
 * + One actor is static (idling)
 * + One actor block goal of another
 * + Multiple actor collision
 */

import find from 'utils/path-finding/a-star.js';

const isPositionsEqual = (pos1, pos2) => (
  pos1[0] === pos2[0] && pos1[1] === pos2[1]
);

export function getMove(person) {
  const { position } = person;

  if (!person.isMoving()) {
    return {
      tiles: [ position, position ],
      direction: null
    };
  }

  const moveAction = person.getAction();

  return {
    tiles: [ position, moveAction.tiles[1] ],
    direction: moveAction.direction
  };
}

export function isInFrontalCollision(moveA, moveB) {
  if (moveA.direction === null || !moveA.direction.isOpposite(moveB.direction)) {
    return false;
  }

  const [ fromA, toA ] = moveA.tiles, [ fromB, toB ] = moveB.tiles;

  if (isPositionsEqual(toA, toB)) { // actors tries to move on same tile
    return true;
  }

  return isPositionsEqual(fromA, toB) || isPositionsEqual(fromB, toA);
}

export function reCalculatePath(p1, p2, blocked, world) {
  const isTilePassable = (x, y) => (
    world.isTilePassable(x, y) && blocked.every(p => p[0] !== x || p[1] !== y)
  );

  return find(isTilePassable, p1[0], p1[1], p2[0], p2[1]);
}
