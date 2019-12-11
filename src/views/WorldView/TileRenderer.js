import {
  greenRenderer,
  greyRenderer,
  yellowRenderer,
  stockRenderer } from './renderers.js';

import ObjectType from 'model/ObjectType.enum.js';

import { get } from 'utils/common/object.utils.js';

const ORIGINAL_TILE_SIZE = 16;

export default class TileRenderer {

  constructor(tilesSprite) {
    this.tilesSprite = tilesSprite;
  }

  render(ctx, tile, x, y, tileSize) {

    const objectType = get(tile, 'object.type');

    if (objectType === ObjectType.OBSTACLE) {
      greyRenderer(ctx, x, y, tileSize);
      return;
    }

    if (objectType === ObjectType.FOOD) {
      yellowRenderer(ctx, x, y, tileSize);
      return;
    }

    if (tile.terrain === ObjectType.STOCK) {
      stockRenderer(ctx, x, y, tileSize);
    } else {
      greenRenderer(ctx, x, y, tileSize);
    }

    if ([ ObjectType.PERSON, ObjectType.TREE ].includes(objectType)) {
      const [ sx, sy ] = objectType == ObjectType.PERSON ? [ 0, 0 ] : [ 2, 3 ];

      const sxd = sx * ORIGINAL_TILE_SIZE;
      const syd = sy * ORIGINAL_TILE_SIZE;

      ctx.drawImage(
        this.tilesSprite, sxd, syd, ORIGINAL_TILE_SIZE, ORIGINAL_TILE_SIZE,
        x, y, tileSize, tileSize
      );
    }
  }
}
