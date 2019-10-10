import MoveAction from 'model/actions/MoveAction.js';
import PathFinder from 'utils/path-finding/PathFinder.js';

import { isArraysEqual, last } from 'utils/common/array.utils.js';
import WalkStrategy from './strategies/WalkStrategy.js';
import Direction from './Direction.enum.js';

export function getBypass(actor, blockedPosition) {
  const [ x, y ] = actor.position;

  const strategy = actor.strategy;
  const goal = last(strategy.path);

  const bypassFinder = new PathFinder({
    isTilePassable(tile, x, y) {
      return (
        !actor.world.isTileOccupied(x, y) &&
        !isArraysEqual(blockedPosition, [ x, y ])
      );
    },
    isTileFound(tile, x, y) {
      return goal.position[0] === x && goal.position[1] === y;
    }
  });

  const path = bypassFinder.find(actor.world.tiles, x, y);

  return path;
}

export function turn(actor, blockedPosition) {

  const path = getBypass(actor, blockedPosition);

  if (path.length === 1 && isArraysEqual(path[0].position, blockedPosition)) {
    debugger;
    getOutOfWay(actor, blockedPosition);
    return;
  }

  actor.strategy.action = null;

  actor.strategy.path = path;
  actor.strategy.pathNodeIndex = 0;
}

const STEERING_INDEXES = [
  2, -2, 3, -3, 1, -1
];

function getOutOfWay(actor, position) {
  const direction = Direction.fromPoints(position, actor.position);
  const [ x0, y0 ] = actor.position;

  for (const index of STEERING_INDEXES) {
    const steeringDirection = direction.turn(index);

    const newPosition = [
      x0 + steeringDirection.dx,
      y0 + steeringDirection.dy
    ];

    const [ x, y ] = newPosition;

    if (actor.canMoveTo(x, y)) {
      const path = [{
        position: newPosition,
        direction: steeringDirection
      }];

      actor.setStrategy(WalkStrategy, { path });
      return;
    }
  }

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

        if (moveA.isStatic) {
          getOutOfWay(walkerA, walkerB.position);
          continue;
        }

        if (moveB.isStatic) {
          getOutOfWay(walkerB, walkerA.position);
          continue;
        }

        turn(walkerA, collisionPosition);
      }
    }
  }
}
