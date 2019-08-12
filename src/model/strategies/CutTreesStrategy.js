import PathFinder from 'utils/path-finding/PathFinder.js';
import CutTreeAction from '../actions/CutTreeAction.js';
import ObjectType from 'model/ObjectType.enum.js';
import Strategy from './Strategy.js';
import { isUndefined } from 'utils/common/is.utils.js';
import WalkStrategy from './WalkStartegy.js';

const trees = new Map();

const hash = (x, y) => `${x}-${y}`;

export default class CutTreesStrategy extends Strategy {

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
    const path = CutTreesStrategy.treeFinder.find(this.actor.world.tiles, x, y);

    if (path.length === 0) {
      return { path };
    }

    const { position } = path.pop();
    return { path, position };
  }

  nextAction() {

    if (!this.isTreeFound) {
      const { position, path } = this.findTree();
      this.isTreeFound = true;

      this.actor.setStrategy(WalkStrategy, {
        path,
        onDone() {
          const [ x, y ] = position;
          trees.delete(hash(x, y));
          this.actor.setStrategy(CutTreesStrategy);
          const cutTreeAction = new CutTreeAction(this.actor, position);
          return cutTreeAction;
        }
      });
    }

    return this.actor.strategy.nextAction();
  }
}
