import PathFinder from '../../PathFinder.js'
import MoveAction from '../actions/MoveAction.js';
import CutTreeAction from '../actions/CutTreeAction.js';
import ObjectType from '../ObjectType.js';
import Strategy from './Startegy.js';

export default class SearchTreeStrategy extends Strategy {

  static treeFinder = new PathFinder({
    onAxialTile(tile, x, y,) {
      if (tile.object && tile.object.type === ObjectType.TREE) {
        this.found([ x, y ]);
      }
    },

    isTilePassable: tile => !tile.object
  });

  getPath() {
    if (!this.path || this.path.length === 0) {
      const [ x, y ] = this.actor.position;

      const result = SearchTreeStrategy.treeFinder.find(this.world, x, y);

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

    return new MoveAction(this.actor, position);
  }
}
