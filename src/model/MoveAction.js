import { AXIAL_TILE_DISTACE, DIAGONAL_TILE_DISTANCE } from './consts.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

export default class MoveAction {

  constructor(actor, position) {
    this.duration = isDiagonal(actor.position, position) ?
      DIAGONAL_TILE_DISTANCE :
      AXIAL_TILE_DISTACE;

    this.position = position;
    this.completed = false;
    this.actor = actor;
  }

  perform() {
    const from = this.actor.position;

    this.actor.moveTo(this.position);

    this.completed = true;

    return { type: 'MOVE', data: { from, to: this.position } };
  }
}
