import { greenRenderer, greyRenderer, stockRenderer } from './renderers.js';
import ObjectType from 'model/ObjectType.enum.js';

const ORIGINAL_TILE_SIZE = 16;

export default class TileRenderer {

  constructor(tilesSprite) {
    this.tilesSprite = tilesSprite;
  }

  render(ctx, tile, x, y, tileSize) {

    if (tile.object && tile.object.type === ObjectType.OBSTACLE) {
      greyRenderer(ctx, x, y, tileSize);
      return;
    }

    if (tile.terrain === ObjectType.STOCK) {
      stockRenderer(ctx, x, y, tileSize);
    } else {
      greenRenderer(ctx, x, y, tileSize);
    }

    if (tile.object) {
      const [ sx, sy ] = tile.object.type == ObjectType.PERSON ? [ 0, 0 ] : [ 2, 3 ];

      const sxd = sx * ORIGINAL_TILE_SIZE;
      const syd = sy * ORIGINAL_TILE_SIZE;

      ctx.drawImage(
        this.tilesSprite, sxd, syd, ORIGINAL_TILE_SIZE, ORIGINAL_TILE_SIZE,
        x, y, tileSize, tileSize
      );
    }
  }
}
