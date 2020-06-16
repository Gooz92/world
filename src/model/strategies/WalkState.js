import State from './State.js';

import MoveAction from 'model/actions/MoveAction.js';

export default class WalkState extends State {

  constructor(actor, { path, targetPosition = null }) {
    super(actor);

    this.path = path;
    this.targetPosition = targetPosition;
    this.pathNodeIndex = 0;
  }

  getNextPathNode() {
    return this.path[this.pathNodeIndex++];
  }

  hasNextPathNode() {
    return this.pathNodeIndex < this.path.length;
  }

  update() {
    super.update();
  }

  nextAction() {

    if (!this.hasNextPathNode()) {
      return null;
    }

    const { position } = this.getNextPathNode();

    return new MoveAction(this.actor, position);
  }

  isDone() {
    return !this.hasNextPathNode() && this.action.completed;
  }
}
