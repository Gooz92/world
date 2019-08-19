import { isArraysEqual } from 'utils/common/array.utils.js';
import MoveAction from 'model/actions/MoveAction.js';
import Direction from './Direction.enum.js';
import WalkStrategy from './strategies/WalkStrategy.js';

const TURNS_ORDER = [ 1, -1, 2, -2, 3, -3, 4 ];

function getBypassPosition(actor) {
  const [ x, y ] = actor.position;
  const action = actor.getAction();

  for (let i = 0; i < TURNS_ORDER.length; i++) {
    const turnIndex = TURNS_ORDER[i];

    const newDirection = action.direction.turn(turnIndex);

    const nextX = x + newDirection.dx,
      nextY = y + newDirection.dy;

    if (actor.canMoveTo(nextX, nextY)) {
      return [ nextX, nextY ];
    }
  }

  return; // what ????
}

// TODO: Take cycle coordinate into account
export function turn(actor) {

  if (!actor.strategy.hasNextPathNode()) {
    return;
  }

  const position = getBypassPosition(actor);
  const path = [{ position }];
  const [ newX, newY ] = position;

  /*
   * -1  0  1
   * -2  @  2s
   * -3     3
   */

  const { position: [ nextX, nextY ] } = actor.strategy.getNextPathNode();
  const dx = nextX - newX;
  const dy = nextY - newY;

  if (Math.abs(dx) > 1) {
    const x = (nextX + newX) / 2;
    if (x % 1 !== 0) debugger;
    const direction = Direction.fromPoints( [ nextX, nextY ], [ x, nextY ]);
    path.push({ position: [ x, nextY ], direction });
  } else if (Math.abs(dy) > 1) {
    const y = (nextY + newY) / 2;
    if (y % 1 !== 0) debugger;
    const direction = Direction.fromPoints( [ nextX, nextY ], [ nextX, y ] );
    path.push({ position: [ nextX, y ], direction });
  }

  const originalStrategy = actor.strategy;

  actor.setStrategy(WalkStrategy, {
    path,
    onDone() {
      originalStrategy.action = null;
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
  debugger;
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
          turn(walkerA); // or walkerB; TODO: priority
        }
      } else if (isAMoved && isArraysEqual(moveA[1], walkerB.position)) {
        turn(walkerA);
      } else if (isBMoved && isArraysEqual(moveB[1], walkerA.position)) {
        turn(walkerB);
      }
    }
  }
}
