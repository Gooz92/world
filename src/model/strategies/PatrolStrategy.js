import MovementStrategy from './MovementStrategy.js';
import MoveAction from 'model/actions/MoveAction.js';

export default class PatrolStrategy extends MovementStrategy {

  constructor(actor, { path = [] }) {
    super(actor, { path });
  }

  nextPathNodeIndex() {
    this.pathNodeIndex = ++this.pathNodeIndex % this.path.length;

    return this.pathNodeIndex;
  }

  nextAction() {
    const { position } = this.getNextPathNode();

    this.nextPathNodeIndex();

    return new MoveAction(this.actor, position);
  }
}
