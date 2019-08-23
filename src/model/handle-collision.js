import { isArraysEqual } from 'utils/common/array.utils.js';
import MoveAction from 'model/actions/MoveAction.js';
import WalkStrategy from './strategies/WalkStrategy.js';
import PathFinder from 'utils/path-finding/PathFinder.js';

export function getBypass(actor, blockedPosition) {
  const [ x, y ] = actor.position;
  const path = actor.strategy.path;

  let pathNodeIndex = null;

  const bypassFinder = new PathFinder({
    isTilePassable(tile, x, y) {
      return (
        !actor.world.isTileOccupied(x, y) &&
        !isArraysEqual(blockedPosition, [ x, y ])
      );
    },
    isTileFound(tile, x, y) {
      const startIndex = actor.strategy.pathNodeIndex;
      for (let i = startIndex; i < path.length; i++) {
        if (isArraysEqual(path[i].position, [ x, y ])) {
          pathNodeIndex = i;
          return true;
        }
      }

      return false;
    }
  });

  const bypath = bypassFinder.find(actor.world.tiles, x, y);

  return { pathNodeIndex, path: bypath };
}

export function turn(actor, blockedPosition) {

  if (!actor.strategy.hasNextPathNode()) {
    return;
  }

  const { path, pathNodeIndex } = getBypass(actor, blockedPosition);

  const originalStrategy = actor.strategy;

  actor.setStrategy(WalkStrategy, {
    path,
    onDone() {
      originalStrategy.action = null;
      originalStrategy.pathNodeIndex = pathNodeIndex;
      originalStrategy.nextPathNodeIndex();
      this.actor.strategy = originalStrategy;
      return this.actor.strategy.getAction();
    }
  });
}

export function isCollided(moveA, moveB) {

  // walkers have same destiation tile
  return isArraysEqual(moveA[1], moveB[1]) || (
    // or a -> b and b -> a
    isArraysEqual(moveA[1], moveB[0]) && isArraysEqual(moveB[1], moveA[0])
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

      if (isBMoved && isAMoved) {
        if (isCollided(moveA, moveB)) {
          turn(walkerA, moveA[1]); // or walkerB; TODO: priority
        }
      } else if (isAMoved && isArraysEqual(moveA[1], walkerB.position)) {
        turn(walkerA, moveA[1]);
      } else if (isBMoved && isArraysEqual(moveB[1], walkerA.position)) {
        turn(walkerB, moveB[1]);
      }
    }
  }
}
