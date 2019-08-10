import Strategy from './Strategy.js';
import MoveAction from 'model/actions/MoveAction.js';
import Action from 'model/actions/Action.js';
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

export default class WalkStrategy extends Strategy {

  static tick() {
    const actors = this.world.actors;

    for (let i = 0; i < actors.length; i++) {
      const a = actors[i];
      const aAction = a.strategy.getAction();

      if (!aAction.destination) {
        continue;
      }

      const [ x1, y1 ] = aAction.destination;

      for (let j = i + 1; j < actors.length; j++) {
        const b = actors[j];
        const bAction = b.strategy.getAction();

        if (bAction.destination) {
          const [ x2, y2 ] = bAction.destination;
          const [ x0, y0 ] = b.position;

          if (x2 === x0 && y2 === y0 || x2 === x1 && y2 === y1) {
            turn(a, getTrue);
          }
        }

      }
    }
  }

  constructor(world, actor, { path = [] }) {
    super(world, actor);
    WalkStrategy.world = world; // TODO
    this.path = path;
  }

  nextAction() {

    if (this.path.length === 0) {
      return Action.IDLE;
    }

    const { direction, position } = this.path.shift();

    return new MoveAction(this.actor, direction, position);
  }
}
