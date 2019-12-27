import Strategy from './Strategy.js';
import WalkStrategy from './WalkStrategy.js';

import CutTreeAction from '../actions/CutTreeAction.js';
import DropItemAction from 'model/actions/DropItemAction.js';

import ObjectType from 'model/ObjectType.enum.js';
import ResourceType from 'model/ResourceType.enum.js';

import PathFinder from 'utils/path-finding/PathFinder.js';
import { isUndefined } from 'utils/common/is.utils.js';
import { get } from 'utils/common/object.utils.js';

const trees = new Map();

const hash = (x, y) => `${x}-${y}`;

class DropWoodStrategy extends Strategy {

  constructor(actor, stockPosition) {
    super(actor);
    this.stockPosition = stockPosition;
  }

  nextAction() {
    return new DropItemAction(this.actor, [ this.stockPosition ], ResourceType.WOOD);
  }

  nextStrategy() {
    if (this.action && this.action.completed) {
      return { Strategy: GoToTreeStrategy };
    }

    return null;
  }
}

export class GoToStockStrategy extends WalkStrategy {

  static create(actor) {
    const { position: [ x, y ], world: { tiles } } = actor;
    const { path, stockPosition } = GoToStockStrategy.findStock(x, y, tiles);
    return new GoToStockStrategy(actor, { path, stockPosition });
  }

  static stockFidner = new PathFinder({
    onAxialTile(tile) {
      if (tile.terrain === ObjectType.STOCK) {
        this.isFound = true;
      }
    },

    isTilePassable: tile => !tile.object
  });

  static findStock(x, y, tiles) {
    const path = GoToStockStrategy.stockFidner.find(tiles, x, y);
    const { position: stockPosition } = path.pop();

    return { path, stockPosition };
  }

  constructor(actor, { path, stockPosition }) {
    super(actor, { path });
    this.stockPosition = stockPosition;
  }

  onDone() {
    return {
      Strategy: DropWoodStrategy,
      options: this.stockPosition
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
      if (get(tile, 'object.type') !== ObjectType.TREE) {
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
