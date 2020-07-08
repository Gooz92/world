import StateMachine from './StateMachine.js';

import WalkState from './WalkState.js';
import CutTreeState from './CutTreeState.js';
import DropResourceState from './DropResourceState.js';

import ObjectType from 'model/ObjectType.enum.js';
import ResourceType from 'model/ResourceType.enum.js';

import PathFinder from 'utils/path-finding/PathFinder.js';
import { isUndefined } from 'utils/common/is.utils.js';
import { get } from 'utils/common/object.utils.js';
import { isResourceCanBePlacedOnTile, findStockTile } from './CutTreesBehavior.utils.js';
import find from 'utils/path-finding/a-star.js';
import { last } from 'utils/common/array.utils.js';

const trees = new Map();

const hash = (x, y) => `${x}-${y}`;

const treeFinder = new PathFinder({
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

  isTilePassable: tile => !tile.object // TODO take movable actors into account
});

const stockFidner = new PathFinder({
  onAxialTile(tile) {
    if (isResourceCanBePlacedOnTile(tile)) {
      this.isFound = true;
    }
  },

  isTilePassable: tile => !tile.object
});

function findStock(x0, y0, world) {
  const path = stockFidner.find(world.tiles, x0, y0);
  const { position: [ tx, ty ] } = last(path);

  const [ x, y ] = findStockTile(tx, ty, world);

  const $isResourceCanBePlacedOnTile = (xi, yi) => (
    isResourceCanBePlacedOnTile(world.getTile(xi, yi))
  );

  const pathToTargetStock = find($isResourceCanBePlacedOnTile, tx, ty, x, y);

  const fullPath = path.concat(pathToTargetStock);

  const { position: stockPosition } = fullPath.pop();

  return { path: fullPath, stockPosition };
}

function findOrCutTree(actor) {
  const { world: { tiles }, position: [ x, y ] } = actor;
  const path = treeFinder.find(tiles, x, y);
  const { position } = path.pop();

  if (path.length === 0) {
    return new CutTreeState(actor, { treePosition: position });
  }

  return new WalkState(actor, { path, targetPosition: position });
}

export default actor => new StateMachine(findOrCutTree(actor), [
  {
    from: WalkState,
    to: actor => {
      const targetPosition = actor.behavior.state.targetPosition;

      if (actor.inventory.contains(ResourceType.WOOD)) {
        return new DropResourceState(actor, {
          targetPosition,
          resourceType: ResourceType.WOOD
        });
      }

      return new CutTreeState(actor, { treePosition: targetPosition });
    }
  },
  {
    from: CutTreeState,
    to: actor => {
      const { position: [ x, y ], world } = actor;
      const { path, stockPosition } = findStock(x, y, world);
      return new WalkState(actor, { path, targetPosition: stockPosition });
    }
  },
  {
    from: DropResourceState,
    to: findOrCutTree
  }
]);
