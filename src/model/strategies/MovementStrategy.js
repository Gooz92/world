import Strategy from './Strategy.js';
import MoveAction from 'model/actions/MoveAction.js';

export default class MovementStrategy extends Strategy {

  constructor(actor, { path = [] } = {}) {
    super(actor);

    this.path = path;
    this.pathNodeIndex = 0;
  }

  nextPathNodeIndex() {
    return ++this.pathNodeIndex;
  }

  getNextPathNode() {
    return this.path[this.pathNodeIndex];
  }

  hasNextPathNode() {
    return this.pathNodeIndex < this.path.length;
  }

  nextAction() {

    const { position } = this.getNextPathNode();
    return new MoveAction(this.actor, position);
  }
}
