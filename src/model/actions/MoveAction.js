import Action from './Action.js';
import { AXIAL_TILE_DISTANCE, DIAGONAL_TILE_DISTANCE } from '../consts.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

export default class MoveAction extends Action {

  constructor(actor, position) {
    super(actor, [ actor.position, position ]);

    this.duration = isDiagonal(actor.position, position) ?
      DIAGONAL_TILE_DISTANCE :
      AXIAL_TILE_DISTANCE;
  }

  perform() {
    const destination = this.tiles[1];
    this.actor.moveTo(destination);
    return super.perform();
  }
}
