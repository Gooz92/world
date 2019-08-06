import Strategy from './Startegy.js';
import MoveAction from 'model/actions/MoveAction.js';
import Action from 'model/actions/Action.js';

export default class WalkStrategy extends Strategy {

  constructor(world, actor, { path = [] }) {
    super(world, actor);
    this.path = path;
  }

  nextAction() {

    if (this.path.length === 0) {
      return Action.IDLE;
    }

    // TODO: get direction
    const { position } = this.path.shift();

    return new MoveAction(this.actor, position);
  }
}
