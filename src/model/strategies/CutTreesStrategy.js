import PathFinder from 'utils/path-finding/PathFinder.js';
import MoveAction from '../actions/MoveAction.js';
import CutTreeAction from '../actions/CutTreeAction.js';
import ObjectType from '../ObjectType.js';
import Strategy from './Startegy.js';
import Action from '../actions/Action.js';
import { isUndefined } from 'utils/common/is.utils.js';

const trees = {};

const hash = (x, y) => `${x}-${y}`;

export default class CutTreesStrategy extends Strategy {

  static treeFinder = new PathFinder({
    onAxialTile(tile, x, y, cost) {
      if (!tile.object || tile.object.type !== ObjectType.TREE) {
        return;
      }

      const key = hash(x, y);
      const distanceToTree = trees[key];

      if (isUndefined(distanceToTree) || cost < distanceToTree) {
        trees[key] = cost;
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

    if (!this.treePosition) {
      return Action.IDLE;
    }

    if (path.length === 0) {
      const [ x, y ] = this.treePosition;
      trees[hash(x, y)] = 0;
      return new CutTreeAction(this.actor, this.treePosition);
    }

    const { position } = this.path.shift();

    return new MoveAction(this.actor, position);
  }
}
