import Action from './Action.js';
import { AXIAL_TILE_DISTACE, DIAGONAL_TILE_DISTANCE } from './consts.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

export default class MoveAction extends Action {

  constructor(actor, position) {
    super(actor, { from: actor.position, to: position });

    this.duration = isDiagonal(actor.position, position) ?
      DIAGONAL_TILE_DISTANCE :
      AXIAL_TILE_DISTACE;
  }

  perform() {
    this.actor.moveTo(this.data.to);
    return super.perform();
  }
}
