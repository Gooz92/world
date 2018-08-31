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

    this.actor.world[y0][x0] = TILE_TYPES.EMPTY;

    this.completed = true;
    
    this.actor.position = this.position;

    const [ x1, y1 ] = this.position;
    this.actor.world[y1][x1] = TILE_TYPES.PERSON;

    return { type: 'MOVE', data: { from, to: this.position } };
  }
}
