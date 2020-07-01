/**
 * + Front collision (including swap)
 * + One actor is static (idling)
 * + One actor block goal of another
 * + Multiple actor collision
 */

import Direction from 'model/Direction.enum';

// const isPositionsEqual = (pos1, pos2) => (
//   pos1[0] === pos2[0] && pos1[1] === pos2[1]
// );

export function getMove(person) {
  const { position } = person;

  if (!person.isMoving()) {
    return {
      tiles: [ position, position ],
      duration: 0,
      isStatic: false
    };
  }

  const moveAction = person.getAction();

  return {
    tiles: [ position, moveAction.tiles[1] ],
    duration: moveAction.getLeftDuration(),
    isStatic: false
  };
}

export function findPathToMoveAway(fx, fy, x0, y0, world) {
  // axial first because axial move is cheapest
  const directions = [ ...Direction.axial, ...Direction.diaginal ];

  for (const direction of directions) {
    const { dx, dy } = direction;

    const x = x0 + dx;
    const y = y0 + dy;

    if (x === fx && y === fy) {
      continue;
    }

    if (world.isTileEmpty(x, y)) {
      return { direction, position: [ x, y ] };
    }
  }

  return null;
}
