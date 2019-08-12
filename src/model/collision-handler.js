import { remove, isArraysEqual } from 'utils/common/array.utils.js';
import MoveAction from 'model/actions/MoveAction.js';
import { getTrue } from 'utils/common/fn.utils.js';

function turn(actor, isTilePassable) {
  const [ x, y ] = actor.position;
  const action = actor.strategy.getAction();

  const newDirection = action.direction.turnRight();
  const newNextPosition = [ x + newDirection.dx, y + newDirection.dy ];

  /*
   * -1  0  1
   * -2  @  2
   * -3     3
   */

  if (isTilePassable(...newNextPosition)) {
    actor.strategy.action = new MoveAction(actor, newDirection, newNextPosition);
  }
}

export function isCollided(moveA, moveB) {
  // walkers have same destiation tile
  return isArraysEqual(moveA[1], moveB[1]) || (
    // or a -> b and b -> a
    isArraysEqual(moveA[1], moveB[0]) && isArraysEqual(moveB[1], moveA[0])
  );
}

export default {
  walkers: [],

  addWalker(walker) {
    this.walkers.push(walker);
  },

  removeWalker(walker) {
    const index = this.walkers.indexOf(walker);
    remove(this.walkers, index);
  },

  handle() {
    const actions = this.walkers.map(walker => walker.strategy.getAction())
      .filter(action => action.type === MoveAction.TYPE);

    for (let i = 0; i < actions.length; i++) {
      const actionA = actions[i];
      const moveA = actionA.tiles;

      for (let j = i + 1; j < actions.length; j++) {
        const actionB = actions[j];
        const moveB = actionB.tiles;

        if (isCollided(moveA, moveB)) {
          turn(actionA.actor, getTrue);
        }
      }
    }
  }
};
