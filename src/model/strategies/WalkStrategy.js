import Strategy from './Strategy.js';
import MoveAction from 'model/actions/MoveAction.js';

export default class WalkStrategy extends Strategy {

  constructor(actor, { path = [], onDone } = {}) {
    super(actor);

    this.path = path;

    if (onDone) {
      this.onDone = onDone;
    }
  }

  nextAction() {

    if (this.path.length === 0) {
      return this.onDone();
    }

    const { position } = this.path.shift();

    return new MoveAction(this.actor, position);
  }
}
