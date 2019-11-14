import MoveAction from 'model/actions/MoveAction.js';
import Strategy from './Strategy.js';

export default class WalkStrategy extends Strategy {

  constructor(actor, { path = [], onDone } = {}) {
    super(actor);


    this.path = path;
    this.pathNodeIndex = 0;

    if (onDone) {
      this.$onDone = onDone;
    }
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

    if (this.pathNodeIndex >= this.path.length) {
      return this.onDone();
    }

    const { position } = this.getNextPathNode();

    this.nextPathNodeIndex();

    return new MoveAction(this.actor, position);
  }

  onDone() {

    const action = super.onDone();

    if (this.$onDone) {
      return this.$onDone();
    }

    return action;
  }
}
