import { isArraysEqual, last } from 'utils/common/array.utils.js';
import WalkStrategy from './strategies/WalkStrategy.js';
import PathFinder from 'utils/path-finding/PathFinder.js';
import ObjectType from './ObjectType.enum.js';
import Strategy from './strategies/Strategy.js';

const move = (position, direction) => ([
  position[0] + direction.dx,
  position[1] + direction.dy
]);

function $inCollision(moveA, moveB) {
  return (
    isArraysEqual(moveA.tiles[1], moveB.tiles[0]) &&
    (moveB.duration > moveA.duration || moveB.isStatic)
  );
}

function isInCollision(moveA, moveB) {
  if (isArraysEqual(moveA.tiles[1], moveB.tiles[1]) &&
    moveA.duration === moveB.duration) {
    return true;
  }

  // TODO: Comparing of same positions performed several times. Optimize ?
  if (
    isArraysEqual(moveA.tiles[0], moveB.tiles[1]) &&
    isArraysEqual(moveA.tiles[1], moveB.tiles[0])
  ) {
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

function findFleeNode(actor, direction) {

  let fleeNode = null;

  for (const fleeIndex of FLEE_INDEXES) {
    const fleeDirection = direction.turn(fleeIndex);

    const [ x, y ] = move(actor.position, fleeDirection);
    const tile = actor.world.getTile(x, y);

    if (!tile.object) {
      return {
        position: [ x, y ],
        direction: fleeDirection
      };
    } else if (tile.object.type === ObjectType.PERSON && fleeNode === null) {
      fleeNode = {
        position: [ x, y ],
        direction: fleeDirection
      };
    }
  }

  return fleeNode;
}

export function flee(actor, direction) {

  if (!(actor.strategy instanceof Strategy.IDLE)) {
    return;
  }

  const fleeNode = findFleeNode(actor, direction);

  if (!fleeNode) {
    return;
  }

  const [ x, y ] = fleeNode.position,
    nextActor = actor.world.getTile(x, y).object;

  if (nextActor) {
    flee(nextActor, direction);
  }

  actor.setStrategy(WalkStrategy, {
    path: [ fleeNode ]
  });
}

export function turn(actor) {
  const action = actor.getAction(),
    currentDirection = action.direction;

  for (const turnIndex of TURN_INDEXES) {
    const newDirection = currentDirection.turn(turnIndex);

    const [ x, y ] = move(actor.position, newDirection);

    if (actor.canMoveTo(x, y)) {

      const goal = last(actor.strategy.path).position,
        onDone = actor.strategy.$onDone;

      actor.setStrategy(WalkStrategy, {
        path: [{
          position: [ x, y ],
          direction: newDirection
        }],

        onDone() {
          return {
            Strategy: WalkStrategy,
            options: {
              path: reCalculatePath(actor, goal),
              onDone
            }
          };
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
    const actionA = walkerA.getAction();
    const moveA = getMove(walkerA);

    for (let j = i + 1; j < walkers.length; j++) {
      const walkerB = walkers[j];
      const actionB = walkerB.getAction();
      const moveB = getMove(walkerB);

      if (isInCollision(moveA, moveB)) {
        if (moveA.duration === 1 || moveB.duration === 1) {
          continue;
        }

        if (moveA.isStatic) {
          flee(walkerA, actionB.direction);
          break;
        }

        if (moveB.isStatic) {
          flee(walkerB, actionA.direction);
          break;
        }

        turn(walkerA); // TODO: should take into account direction of walkerB ?
        break;
      }
    }
  }
}
