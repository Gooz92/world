import { isArraysEqual } from 'utils/common/array.utils.js';
import MoveAction from 'model/actions/MoveAction.js';
import Direction from './Direction.enum.js';
import WalkStrategy from './strategies/WalkStrategy.js';

// TODO: Take cycle coordinate into account
function turn(actor) {
  const [ x, y ] = actor.position;
  const action = actor.strategy.getAction();

  const newDirection = action.direction.turnRight();
  const newNextPosition = [ x + newDirection.dx, y + newDirection.dy ];
  const [ newX, newY ] = newNextPosition;
  const path = [{ position: [ newX, newY ] }];
  /*
   * -1  0  1
   * -2  @  2
   * -3     3
   */

  const [ nextX, nextY ] = actor.strategy.path[0].position;
  const dx = nextX - newX;
  const dy = nextY - newY;

  if (Math.abs(dx) > 1) {
    const x = (nextX + newX) / 2;
    const direction = Direction.fromPoints( [ nextX, nextY ], [ x, nextY ]);
    path.push({ position: [ x, nextY ], direction });
  } else if (Math.abs(dy) > 1) {
    const y = (nextY + newY) / 2;
    const direction = Direction.fromPoints( [ nextX, nextY ], [ nextX, y ] );
    path.push({ position: [ nextX, y ], direction });
  }

  debugger;
  const originalStrategy = actor.strategy;

  actor.setStrategy(WalkStrategy, {
    path,
    onDone() {
      this.actor.strategy = originalStrategy;
      return this.actor.getAction();
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

// TODO check tile passability
export default function createCollisionHandler() {
  return {
    handle(walkers) {
      for (let i = 0; i < walkers.length; i++) {
        const walkerA = walkers[i];
        const actionA = walkerA.getAction();

        if (actionA.type !== MoveAction.TYPE) {
          continue;
        }

        const moveA = actionA.tiles;

        for (let j = i + 1; j < walkers.length; j++) {
          const walkerB = walkers[j];
          const actionB = walkerB.getAction();

          if (actionB.type === MoveAction.TYPE) {
            const moveB = actionB.tiles;
            if (isCollided(moveA, moveB)) {
              turn(walkerA);
            }
          } else if (isArraysEqual(moveA[1], walkerB.position)) {
            turn(walkerA);
          }
        }
      }
    }
  };
}
