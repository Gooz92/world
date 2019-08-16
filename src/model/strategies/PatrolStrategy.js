import MovementStrategy from './MovementStrategy.js';
import MoveAction from 'model/actions/MoveAction.js';

export default class PatrolStrategy extends MovementStrategy {

  constructor(actor, { path = [] }) {
    super(actor, { path });
  }

  nextAction() {
    const { position } = this.getNextPathNode();

    this.pathNodeIndex = ++this.pathNodeIndex % this.path.length;

    return new MoveAction(this.actor, position);
  }
}
