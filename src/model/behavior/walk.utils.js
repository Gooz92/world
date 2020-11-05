/**
 * + Front collision (including swap)
 * + One actor is static (idling)
 * + One actor block goal of another
 * + Multiple actor collision
 */

import find from 'utils/path-finding/a-star.js';
import calculateDistance from 'utils/path-finding/calculate-distance.js';

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

const COLLISION_HANDLING_RADIUS = 7;

export function preFilter(actors) {
  const canCollide = [];

  for (let i = 0; i < actors.length; i++) {
    const actorA = actors[i];
    const [ x1, y1 ] = actorA.position;
    for (let j = i; j < actors.length; j++) {
      const actorB = actors[j];
      const [ x2, y2 ] = actorB.position;
      const distance = calculateDistance(x1, y1, x2, y2);

      if (distance < COLLISION_HANDLING_RADIUS) {
        if (!canCollide.includes(actorA)) {
          canCollide.push(actorA);
        }
        canCollide.push(actorB);
      }
    }
  }

  return canCollide;
}

export function getPathIntersection(actor1, actor2, ticks) {
  let path1 = actor1.getState().getFurtherPath(ticks);
  let path2 = actor2.getState().getFurtherPath(ticks);

  if (path1.length > path2.length) {
    let t = path1;
    path1 = path2;
    path2 = t;
  }

  for (let i = 0; i < path1.length; i++) {
    const p1 = path1[i];
    for (let j = 0; j < path2.length; j++) {
      const p2 = path2[i];
      if (p1.start >= p2.start && p1.start <= p2.end &&
        isPositionsEqual(p1.position, p2.position)) {
        return {
          position: p1.position,
          isFrontal: p1.direction.isOpposite(p2.direction)
        };
      }
    }
  }

  return null;
}
