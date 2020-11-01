import State from './State.js';

import MoveAction from 'model/actions/MoveAction.js';

export default class WalkState extends State {

  constructor(actor, { path, targetPosition = null }) {
    super(actor);

    this.path = path;
    this.targetPosition = targetPosition;
    this.pathNodeIndex = 0;
  }

  nextPathNode() {
    return this.path[this.pathNodeIndex++];
  }

  hasNextPathNode() {
    return this.pathNodeIndex < this.path.length;
  }

  setPath(path) {
    this.path = path;
    this.pathNodeIndex = 0;
    this.action = null;
  }

  getRemainingPath() {
    return this.path.slice(this.pathNodeIndex);
  }

  getFurtherPath(ticks) {
    const action = this.getAction();
    let t = action.getLeftDuration();
    let position = action.tiles[1];
    const path = [];

    while (t <= ticks) {
      const node = {
        position,
        start: t
      };

      path.push(node);

      const pathNode = this.path[this.pathNodeIndex++];
      if (pathNode) {
        t += pathNode.direction.distance;
        position = pathNode.position;
        node.end = t - 1;
      } else {
        break;
      }
    }

    return path;
  }

  nextAction() {

    if (!this.hasNextPathNode()) {
      return null;
    }

    const { position } = this.nextPathNode();

    return new MoveAction(this.actor, position);
  }

  isDone() {
    return !this.hasNextPathNode() && this.action.completed;
  }
}
