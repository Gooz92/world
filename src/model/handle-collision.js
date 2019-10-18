import { isArraysEqual, last } from 'utils/common/array.utils.js';
import WalkStrategy from './strategies/WalkStrategy.js';
import PathFinder from 'utils/path-finding/PathFinder.js';

function $inCollision(moveA, moveB) {
  return (
    isArraysEqual(moveA.tiles[1], moveB.tiles[0]) &&
    (moveB.duration >= moveA.duration || moveB.isStatic)
  );
}

function isInCollision(moveA, moveB) {
  if (isArraysEqual(moveA.tiles[1], moveB.tiles[1]) &&
    moveA.duration === moveB.duration) {
    return true;
  }

  if ($inCollision(moveA, moveB) || $inCollision(moveB, moveA)) {
    return true;
  }
}

const TURN_INDEXES = [ 1, -1, 2, -2, 3, -3, 4 ];

function reCalculatePath(actor, goal) {
  const [ x0, y0 ] = actor.position;

  const finder = new PathFinder({
    isTilePassable: tile => !tile.object,
    isTileFound: (tile, x, y) => goal[0] === x && goal[1]=== y
  });

  const path = finder.find(actor.world.tiles, x0, y0);

  return path;
}

const FLEE_INDEXES = [ 2, -2, 3, -3, 1, -1 ];

export function flee(actor, direction) {

  const [ x0, y0 ] = actor.position;

  for (const fleeIndex of FLEE_INDEXES) {
    const fleeDirection = direction.turn(fleeIndex);

    const x = x0 + fleeDirection.dx,
      y = y0 + fleeDirection.dy;

    if (actor.canMoveTo(x, y)) {

      actor.setStrategy(WalkStrategy, {
        path: [{
          position: [ x, y ],
          direction: fleeDirection
        }],
      });

      return;
    }
  }
}

export function turn(actor) {
  const action = actor.getAction(),
    currentDirection = action.direction,
    [ x0, y0 ] = actor.position;

  for (const turnIndex of TURN_INDEXES) {
    const newDirection = currentDirection.turn(turnIndex);

    const x = x0 + newDirection.dx,
      y = y0 + newDirection.dy;

    if (actor.canMoveTo(x, y)) {

      const goal = last(actor.strategy.path).position,
        onDone = actor.strategy.$onDone;

      actor.setStrategy(WalkStrategy, {
        path: [{
          position: [ x, y ],
          direction: newDirection
        }],

        onDone() {
          actor.setStrategy(WalkStrategy, {
            path: reCalculatePath(actor, goal),
            onDone
          });
        }
      });

      return;
    }
  }
}

function getMove(actor) {
  const position = actor.position;

  if (!actor.inMotion()) {
    return {
      tiles: [ position, position ],
      duration: 0,
      isStatic: true
    };
  }

  const action = actor.getAction();

  return {
    tiles: [ position, action.tiles[1] ],
    duration: action.getLeftDuration(),
    isStatic: false
  };
}

export default function handleCollision(walkers) {

  for (let i = 0; i < walkers.length; i++) {
    const walkerA = walkers[i];
    const moveA = getMove(walkerA);
    for (let j = i + 1; j < walkers.length; j++) {
      const walkerB = walkers[j];
      const moveB = getMove(walkerB);

      if (isInCollision(moveA, moveB)) {

        if (moveA.duration === 1 || moveB.duration === 1) {
          continue;
        }

        if (moveA.isStatic) {
          flee(walkerA, walkerB.getAction().direction);
          break;
        }

        if (moveB.isStatic) {
          flee(walkerB, walkerA.getAction().direction);
          break;
        }

        turn(walkerA); // should take into account direciont of walkerB !!!
        break;
      }
    }
  }
}
