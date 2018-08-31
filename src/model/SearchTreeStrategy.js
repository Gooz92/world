import findPath from '../find-path.js'
import TILE_TYPES from './tile-types.js';
import MoveAction from './MoveAction.js';

const isTreeFound = (x, y, tiles) => (
  tiles[y][x].type === TILE_TYPES.TREE
);

const isPassable = (x, y, tiles) => (
  tiles[y][x].type !== TILE_TYPES.OBSTACLE
);

export default class SearchTreeStrategy {

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