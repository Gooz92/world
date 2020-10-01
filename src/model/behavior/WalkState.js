import State from './State.js';

import MoveAction from 'model/actions/MoveAction.js';
import ObjectType from 'model/ObjectType.enum.js';
import { isInFrontalCollision, getMove, reCalculatePath } from './walk.utils.js';
import { last } from 'utils/common/array.utils.js';

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

    const [ x0, y0 ] = this.actor.position;

    for (let x = x0 - 2; x < x0 + 2; x++) {
      for (let y = y0 - 2; y < y0 + 2; y++) {
        if (x === x0 && y === y0) {
          continue;
        }

        const obj = this.actor.world.getObject(x, y);

        if (obj && obj.type === ObjectType.PERSON) { // movable object
          const moveA = getMove(this.actor);
          const moveB = getMove(obj);

          if (isInFrontalCollision(moveA, moveB)) {
            const path = reCalculatePath(this.actor.position,
              last(this.path).position, moveB.tiles, this.actor.world);

            this.setPath(path);
          }
        }
      }
    }
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

    const { position } = this.getNextPathNode();

    return new MoveAction(this.actor, position);
  }

  isDone() {
    return !this.hasNextPathNode() && this.action.completed;
  }
}
