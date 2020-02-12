import ObjectType from 'model/ObjectType.enum.js';

const MAX_WOOD_PER_TILE = 40;

export function isResourceCanBePlacedOnTile(tile) {
  return tile.terrain === ObjectType.STOCK &&
    (!tile.object || tile.object.amount < MAX_WOOD_PER_TILE);
}

export function findStockTile(tx, ty, world) { // TODO: cycle coords ?
  const firstFindStockTile = world.getTile(tx, ty);
  const { x, y, width, height } = firstFindStockTile.area;

  for (let yi = y; yi < y + height; yi++) {
    for (let xi = x; xi < x + width; xi++) {
      const stockTile = world.getTile(xi, yi);
      if (isResourceCanBePlacedOnTile(stockTile)) {
        return [ xi, yi ];
      }
    }
  }

  return null;
}
