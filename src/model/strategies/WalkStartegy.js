import Strategy from './Strategy.js';
import MoveAction from 'model/actions/MoveAction.js';
import Action from 'model/actions/Action.js';

export default class WalkStrategy extends Strategy {

  static NAME = 'walk';

  constructor(world, actor, { path = [] }) {
    super(world, actor);
    this.path = path;
  }

  nextAction() {

    if (this.path.length === 0) {
      this.actor.setStrategy(Strategy);
      return Action.IDLE;
    }

    const { direction, position } = this.path.shift();

    return new MoveAction(this.actor, direction, position);
  }
}
