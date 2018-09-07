import PathFinder from '../../PathFinder.js';
import MoveAction from '../actions/MoveAction.js';
import CutTreeAction from '../actions/CutTreeAction.js';
import ObjectType from '../ObjectType.js';
import Strategy from './Startegy.js';

const trees = new Set();

const hash = (x, y) => `${x}-${y}`;

export default class CutTreesStrategy extends Strategy {

  static treeFinder = new PathFinder({
    onAxialTile(tile, x, y,) {
      if (tile.object && tile.object.type === ObjectType.TREE && !trees.has(hash(x, y))) {
        trees.add(hash(x, y));
        this.found([ x, y ]);
      }
    },

    isTilePassable: tile => !tile.object
  });

  getPath() {
    if (!this.path || this.path.length === 0) {
      const [ x, y ] = this.actor.position;

      const result = CutTreesStrategy.treeFinder.find(this.world, x, y);

      this.path = result.path;
      this.treePosition = result.goal;
    }

    return this.path;
  }

  nextAction() {
    const path = this.getPath();

    if (path.length === 0) {
      const [ x, y ] = this.treePosition;
      const treeTile = this.world[y][x];
      return new CutTreeAction(this.actor, treeTile, this.treePosition);
    }

    const position = this.path.shift();

    if (path.length === 0) {
      trees.delete(hash(this.treePosition[0], this.treePosition[1]));
    }

    return new MoveAction(this.actor, position);
  }
}
