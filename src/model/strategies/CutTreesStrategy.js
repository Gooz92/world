import PathFinder from 'utils/path-finding/PathFinder.js';
import CutTreeAction from '../actions/CutTreeAction.js';
import ObjectType from 'model/ObjectType.enum.js';
import Strategy from './Strategy.js';
import { isUndefined } from 'utils/common/is.utils.js';
import WalkStrategy from './WalkStrategy.js';;
import DropWoodAction from 'model/actions/DropWoodAction.js';

const trees = new Map();

const hash = (x, y) => `${x}-${y}`;

class DropWoodStrategy extends Strategy {

  nextAction() {
    return new DropWoodAction(this.actor);
  }

  nextStrategy() {
    if (this.action && this.action.completed) {
      return { Strategy: GoToTreeStrategy };
    }

    return null;
  }
}

class GoToStockStrategy extends WalkStrategy {

  static create(actor) {
    const { position: [ x, y ], world: { tiles } } = actor;
    const path = GoToStockStrategy.findStock(x, y, tiles);
    return new GoToStockStrategy(actor, { path });
  }

  static stockFidner = new PathFinder({
    isTileFound: tile => tile.terrain === ObjectType.STOCK,
    isTilePassable: tile => !tile.object
  });

  static findStock(x, y, tiles) {
    return GoToStockStrategy.stockFidner.find(tiles, x, y);
  }

  onDone() {
    return {
      Strategy: DropWoodStrategy
    };
  }
}

export default class GoToTreeStrategy extends WalkStrategy {

  static create(actor) {
    const { position: [ x, y ], world: { tiles } } = actor;
    const { treePosition, path } = GoToTreeStrategy.findTree(x, y, tiles);
    // TODO or cut if tree is around
    return new GoToTreeStrategy(actor, { path, treePosition });
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

  static findTree(x, y, tiles) {

    const path = GoToTreeStrategy.treeFinder.find(tiles, x, y);

    if (path.length === 0) {
      return { path };
    }

    const { position } = path.pop();
    return { path, treePosition: position };
  }

  constructor(actor, { path, treePosition }) {
    super(actor, { path });

    this.treePosition = treePosition;
  }

  onDone() {
    return {
      Strategy: CutTreeStrategy,
      options: this.treePosition
    };
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
      return { Strategy: GoToStockStrategy };
    }

    return null;
  }

  nextAction() {
    return new CutTreeAction(this.actor, this.treePosition);
  }
}
