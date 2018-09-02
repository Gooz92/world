import TILE_TYPES from './tile-types.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

export default class MoveAction {

  constructor(actor, position) {
    this.duration = isDiagonal(actor.position, position) ? 3 : 2;
    this.position = position;
    this.completed = false;
    this.actor = actor;
  }

  perform() {
    const from = this.actor.position;

    const [ x0, y0 ] = from;

    this.actor.world[y0][x0].object = null;

    this.completed = true;
    
    this.actor.position = this.position;

    const [ x1, y1 ] = this.position;

    // TOOD ?
    this.actor.world[y1][x1].type = TILE_TYPES.EMPTY;
    this.actor.world[y1][x1].object = this.actor;

    return { type: 'MOVE', data: { from, to: this.position } };
  }
}
