import PathFinder from 'utils/path-finding/PathFinder.js';
import CutTreeAction from '../actions/CutTreeAction.js';
import ObjectType from 'model/ObjectType.enum.js';
import Strategy from './Startegy.js';
import { isUndefined } from 'utils/common/is.utils.js';
import WalkStrategy from './WalkStartegy.js';

const trees = new Map();

const hash = (x, y) => `${x}-${y}`;

export default class CutTreesStrategy extends Strategy {

  constructor(world, actor) {
    super(world, actor);
    this.walkStrategy = new WalkStrategy(world, actor, { path: [] });
  }

  static treeFinder = new PathFinder({
    onAxialTile(tile, x, y, cost) {
      if (!tile.object || tile.object.type !== ObjectType.TREE) {
        return;
      }

      const key = hash(x, y);
      const distanceToTree = trees.get(key);

      if (isUndefined(distanceToTree) || cost < distanceToTree) {
        trees.set(key, cost);
        this.isFound = true;
      }
    },

    isTilePassable: tile => !tile.object
  });

  findTree() {

    const [ x, y ] = this.actor.position;
    const path = CutTreesStrategy.treeFinder.find(this.world.tiles, x, y);
    const { position } = path.pop();
    return { path, position };
  }

  nextAction() {

    if (!this.treePosition) {
      const { position, path } = this.findTree();

      this.walkStrategy.path = path;
      this.treePosition = position;
    }

    if (this.walkStrategy.path.length === 0 && this.treePosition) {
      const [ x, y ] = this.treePosition;
      trees.delete(hash(x, y));
      const cutTreeAction = new CutTreeAction(this.actor, this.treePosition);
      this.treePosition = null;
      return cutTreeAction;
    }

    return this.walkStrategy.nextAction();
  }
}
