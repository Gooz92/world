import PathFinder from '../PathFinder.js'
import MoveAction from './actions/MoveAction.js';
import CutTreeAction from './actions/CutTreeAction.js';
import ObjectType from './ObjectType.js';

export default class SearchTreeStrategy {

  constructor(world, actor) {
    this.world = world;
    this.actor = actor;
  }

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

  getAction() {
    if (!this.action || this.action.completed) {
      this.action = this.nextAction();
    }

    return this.action;
  }
}
