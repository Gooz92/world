import findPath from '../find-path.js'
import MoveAction from './MoveAction.js';
import CutTreeAction from './CutTreeAction.js';
import ObjectType from './ObjectType.js';
import direction from './direction.js';

const AXIAL_OFFSETS = [
  direction.n, direction.e, direction.s, direction.w
]

const isPassable = (x, y, tiles) => (
  tiles[y][x].object === null
);

export default class SearchTreeStrategy {

  constructor(world, actor) {
    this.world = world;
    this.actor = actor;
  }

  isTreeFound = (x, y, tiles) => {

    for (let [ dx, dy ] of AXIAL_OFFSETS) {
      const nextX = x + dx, nextY = y + dy;

      if (nextX < 0 || nextY < 0 ||
        nextY >= tiles.length || nextX >= tiles[nextY].length) {
        continue;
      }

      const tile = tiles[nextY][nextX];
      if (tile.object && tile.object.type === ObjectType.TREE) {
        this.treePosition = [ nextX, nextY ];
        this.treeTile = tile;
        return true;
      }
    }

    return false;
  }

  getPath() {
    if (!this.path || this.path.length === 0) {
      const [ x, y ] = this.actor.position;
      this.path = findPath(this.world, x, y, this.isTreeFound, isPassable);
    }

    return this.path;
  }

  nextAction() {
    const path = this.getPath();

    if (path.length === 0) {
      return new CutTreeAction(this.actor, this.treeTile, this.treePosition); 
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