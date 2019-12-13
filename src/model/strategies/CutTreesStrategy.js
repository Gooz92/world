import PathFinder from 'utils/path-finding/PathFinder.js';
import CutTreeAction from '../actions/CutTreeAction.js';
import ObjectType from 'model/ObjectType.enum.js';
import Strategy from './Strategy.js';
import { isUndefined } from 'utils/common/is.utils.js';
import WalkStrategy from './WalkStrategy.js';

const trees = new Map();

const hash = (x, y) => `${x}-${y}`;

export default class FindTreeStrategy extends Strategy {
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
    const path = FindTreeStrategy.treeFinder.find(this.actor.world.tiles, x, y);

    if (path.length === 0) {
      return { path };
    }

    const { position } = path.pop();
    return { path, position };
  }

  nextStrategy() {
    const { position, path } = this.findTree();

    if (path.length === 0) {
      return new CutTreeStrategy(this.actor, position);
    }

    return new WalkStrategy(this.actor, {
      path,
      onDone() {
        return new CutTreeStrategy(this.actor, position);
      }
    });
  }

  nextAction() {
    return null;
  }
}

class CutTreeStrategy extends Strategy {

  constructor(actor, treePosition) {
    super(actor);
    this.treePosition = treePosition;
  }

  nextStrategy() {

    const [ x, y ] = this.treePosition;

    if (this.actor.world.isTileEmpty(x, y)) {
      return new FindTreeStrategy(this.actor);
    }

    return null;
  }

  nextAction() {
    return new CutTreeAction(this.actor, this.treePosition);
  }
}
