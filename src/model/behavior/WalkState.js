import State from './State.js';

import MoveAction from 'model/actions/MoveAction.js';

const LOOK_UP_DISTANCE = 6;

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

  nextAction() {

    if (!this.hasNextPathNode()) {
      return null;
    }

    const { position } = this.nextPathNode();

    return new MoveAction(this.actor, position);
  }

  lookup() {
    let pathNodeIndex = this.pathNodeIndex;
    let distance = 0;

    do {
      const pathNode = this.path[pathNodeIndex++];
      const [ x, y ] = pathNode.position;
      const object = this.actor.world.getObject(x, y);
      if (object) {
        return object;
      }
      distance += pathNode.direction.distance;
    } while (distance <= LOOK_UP_DISTANCE && pathNodeIndex < this.path.length);

    return null;
  }

  isDone() {
    return !this.hasNextPathNode() && this.action.completed;
  }
}
