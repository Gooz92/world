import { isArraysEqual } from 'utils/common/array.utils.js';
import MoveAction from 'model/actions/MoveAction.js';
import WalkStrategy from './strategies/WalkStrategy.js';
import PathFinder from 'utils/path-finding/PathFinder.js';

export function getBypass(actor, blockedPosition) {
  const [ x, y ] = actor.position;

  const bypassFinder = new PathFinder({
    isTilePassable(tile, x, y) {
      return (
        !actor.world.isTileOccupied(x, y) &&
        !isArraysEqual(blockedPosition, [ x, y ])
      );
    },
    isTileFound(tile, x, y) {
      const strategy = actor.strategy;
      const path = strategy.path;
      const { position: [ x0, y0 ] } = path[strategy.pathNodeIndex + 1];

      return x === x0 && y === y0;
    }
  });

  const path = bypassFinder.find(actor.world.tiles, x, y);

  return path.slice(0, -1);
}

export function turn(actor, blockedPosition) {

  if (!actor.strategy.hasNextPathNode()) {
    return;
  }

  const path = getBypass(actor, blockedPosition);

  const originalStrategy = actor.strategy;

  actor.setStrategy(WalkStrategy, {
    path,
    onDone() {
      originalStrategy.action = null;
      originalStrategy.nextPathNodeIndex();
      this.actor.strategy = originalStrategy;
      return this.actor.strategy.getAction();
    }
  });
}

export function isCollided(moveA, moveB) {

  return (
    isArraysEqual(moveA[1], moveB[1]) ||
    isArraysEqual(moveA[1], moveB[0]) ||
    isArraysEqual(moveB[1], moveA[0])
  );
}

export default function handleCollision(walkers) {
  for (let i = 0; i < walkers.length; i++) {
    const walkerA = walkers[i];
    const actionA = walkerA.getAction();

    const isAMoved = actionA.type === MoveAction.TYPE;
    const moveA = actionA.tiles;

    for (let j = i + 1; j < walkers.length; j++) {
      const walkerB = walkers[j];
      const actionB = walkerB.getAction();
      const isBMoved = actionB.type === MoveAction.TYPE;
      const moveB = actionB.tiles;

      if (isBMoved && isAMoved && isCollided(moveA, moveB)) {
        turn(walkerA, moveA[1]);
        break;
      } else if (isAMoved && isArraysEqual(moveA[1], walkerB.position)) {
        turn(walkerA, moveA[1]);
        break;
      } else if (isBMoved && isArraysEqual(moveB[1], walkerA.position)) {
        turn(walkerB, moveB[1]);
        break;
      }
    }
  }
}
