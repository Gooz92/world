import MoveAction from 'model/actions/MoveAction.js';
import WalkStrategy from './strategies/WalkStrategy.js';
import PathFinder from 'utils/path-finding/PathFinder.js';

import { isArraysEqual } from 'utils/common/array.utils.js';

const TURN_INDEXES = [ 1, -1, 2, -2, 3, -3, 4 ];

export function getBypass(actor, blockedPosition) {
  const [ x, y ] = actor.position;

  const strategy = actor.strategy;

  if (!strategy.hasNextPathNode()) {
    const action = actor.getAction();
    const [ x0, y0 ] = actor.position;
    const currentDirection = action.direction;

    for (const turnIndex of TURN_INDEXES) {
      const direction = currentDirection.turn(turnIndex);

      const nextX = x0 + direction.dx,
        nextY = y0 + direction.dy;

      if (actor.canMoveTo(nextX, nextY)) {
        return [{
          position: [ nextX, nextY ],
          direction
        }];
      }
    }

    return null; // TODO ?
  }

  const { position: [ x0, y0 ] } = strategy.getNextPathNode();

  const bypassFinder = new PathFinder({
    isTilePassable(tile, x, y) {
      return (
        !actor.world.isTileOccupied(x, y) &&
        !isArraysEqual(blockedPosition, [ x, y ])
      );
    },
    isTileFound(tile, x, y) {
      return x === x0 && y === y0;
    }
  });

  const path = bypassFinder.find(actor.world.tiles, x, y);

  return path.slice(0, -1);
}

export function turn(actor, blockedPosition) {

  const path = getBypass(actor, blockedPosition);

  const originalStrategy = actor.strategy;

  actor.setStrategy(WalkStrategy, {
    path,
    onDone() {
      originalStrategy.action = null;

      if (!originalStrategy.hasNextPathNode()) {
        --originalStrategy.pathNodeIndex; // TODO
      }

      this.actor.strategy = originalStrategy;
      return this.actor.strategy.getAction();
    }
  });
}

export function getMove(actor) {
  const action = actor.getAction();

  if (action.type === MoveAction.TYPE) {
    return {
      tiles: action.tiles,
      isStatic: false,
      duration: action.getLeftDuration()
    };
  }

  return {
    tiles: [ actor.position, actor.position ],
    isStatic: true,
    duration: 1
  };
}

export function getCollsionPosition(moveA, moveB) {

  for ( const [ i, j ] of [ [ 1, 1 ], [ 1, 0 ], [ 0, 1 ] ]) {
    if (isArraysEqual(moveA.tiles[i], moveB.tiles[j]) &&
      moveA.duration === moveB.duration) {
      return moveA.tiles[i];
    }
  }

  return null;
}

export default function handleCollision(walkers) {

  for (let i = 0; i < walkers.length; i++) {
    const walkerA = walkers[i];

    const moveA = getMove(walkerA);

    for (let j = i + 1; j < walkers.length; j++) {
      const walkerB = walkers[j];
      const moveB = getMove(walkerB);

      const collisionPosition = getCollsionPosition(moveA, moveB);

      if (collisionPosition !== null) {
        const walker = moveA.isStatic ? walkerB : walkerA;
        turn(walker, collisionPosition);
      }
    }
  }
}
