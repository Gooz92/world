import findPath from '../find-path.js'
import TILE_TYPES from '../tile-types.js';

const isDiagonal = ([ x1, y1 ], [ x2, y2 ]) => (
  Math.abs(x1 - x2) > 0 && Math.abs(y1 - y2) > 0
);

const isTreeFound = (x, y, tiles) => (
  tiles[y][x].type === TILE_TYPES.TREE
);

const isPassable = (x, y, tiles) => (
  tiles[y][x].type !== TILE_TYPES.OBSTACLE
);

class GeatherStrategy {

  constructor(world, actor) {
    this.world = world;
    this.actor = actor;
  }

  nextAction() {
    if (!this.path || this.path.length === 0) {
      const [ x, y ] = this.actor.position;
      this.path = findPath(this.world, x, y, isTreeFound, isPassable);
    }

    const position = this.path.shift();
    return new MoveAction(this.actor, position);
  }

  getAction() {

    if (!this.action || this.action.completed) {
      this.action = this.nextAction();
    }

    return this.action;
  }
}

class MoveAction {

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

export default class Person {

  constructor(world, position) {
    this.world = world;
    this.strategy = new GeatherStrategy(world, this);
    this.position = position;
    this.actionPoints = 0;
  }

  act() {

    ++this.actionPoints;

    const action = this.strategy.getAction();
    
    if (action.duration <= this.actionPoints) {
      this.actionPoints -= action.duration;
      console.log('perform');
      return action.perform();
    }

    return { type: 'IDLE' };
  }
}
