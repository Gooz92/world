import State from './State.js';

import MoveAction from 'model/actions/MoveAction.js';
import ObjectType from 'model/ObjectType.enum.js';

/*
 * . . . . .
 * . . * . .
 * . * * * .
 * . * * * .
 * . . @ . .
 * . . . . .
 *
 */

const LOOK_AHEAD_OFFSETS = [
  [ 0, 1 ], [ 0, 2 ], [ 0, 3 ],
  [ 1, 1 ], [ 1, 2 ],
  [ -1, 1 ], [ -1, 2 ]
];

function getOffsets(direction) {

  if (direction.dx === 0) {
    return LOOK_AHEAD_OFFSETS.map(([ dx, dy ]) => [ dx, direction.dy * dy ]);
  }

  if (direction.dy === 0) {
    return LOOK_AHEAD_OFFSETS.map(([ dx, dy ]) => [ dy, direction.dx * dx ]);
  }

  throw new Error('not yet implemented');
}

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

  lookAhead() {
    const offsets = getOffsets(this.getAction().direction);

    const [ x0, y0 ] = this.actor.position;
    const objects = [];

    for (let i = 0; i < offsets.length; i++) {
      const [ dx, dy ] = offsets[i];
      const tile = this.actor.world.getTile(x0 + dx, y0 + dy);
      const { object } = tile;
      if (object && object.type === ObjectType.PERSON) {
        objects.push(object);
      }
    }

    return objects;
  }

  getRemainingPath() {
    return this.path.slice(this.pathNodeIndex);
  }

  getFurtherPath(ticks) {
    const action = this.getAction();
    let t = action.getLeftDuration();
    let [ currentPosition, nextPosition ] = action.tiles;
    let { direction } = action;
    const path = [];

    let { pathNodeIndex } = this;

    while (t <= ticks) {
      const node = {
        position: nextPosition,
        direction,
        start: t
      };

      const [ currX, currY ] = currentPosition;
      const [ nextX, nextY ] = nextPosition;

      path.push({
        position: [
          (currX + nextX) / 2,
          (currY + nextY) / 2
        ],
        direction,
        time: node.start
      });

      path.push(node);

      if (pathNodeIndex < this.path.length) {
        const pathNode = this.path[pathNodeIndex];
        ++pathNodeIndex;
        t += pathNode.direction.distance;
        node.end = t - 1;
        currentPosition = nextPosition;
        nextPosition = pathNode.position;
        direction = pathNode.direction;
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
