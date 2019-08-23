import MovementStrategy from './MovementStrategy.js';
import MoveAction from 'model/actions/MoveAction.js';

export default class WalkStrategy extends MovementStrategy {

  constructor(actor, { path = [], onDone } = {}) {
    super(actor, { path });

    if (onDone) {
      this.onDone = onDone;
    }
  }

  nextAction() {

    if (this.pathNodeIndex >= this.path.length) {
      return this.onDone();
    }

    const { position } = this.getNextPathNode();

    ++this.pathNodeIndex;

    return new MoveAction(this.actor, position);
  }
}
