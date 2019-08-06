import Action from './Action.js';
import Direction from 'model/Direction.enum.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

export default class MoveAction extends Action {

  constructor(actor, position) {
    super(actor, [ actor.position, position ]);

    this.duration = isDiagonal(actor.position, position) ? 3 : 2;
  }

  perform() {
    const direction = Direction.fromPoints(this.tiles[0], this.tiles[1]);
    this.actor.moveTo(direction);
    return super.perform();
  }
}
