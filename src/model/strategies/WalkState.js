import State from './State.js';

import MoveAction from 'model/actions/MoveAction.js';

export default class WalkState extends State {

  constructor(actor, { path, targetPosition }) {
    super(actor);

    this.path = path;
    this.targetPosition = targetPosition;
    this.pathNodeIndex = 0;
  }

  getNextPathNode() {
    return this.path[++this.pathNodeIndex];
  }

  update() {
    // TODO: collision handling here?
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
