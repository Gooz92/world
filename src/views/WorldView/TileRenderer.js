import { greenRenderer, greyRenderer } from './renderers.js';
import ObjectType from 'model/ObjectType.enum.js';

const TILE_SIZE = 16;

export default class TileRenderer {

  constructor(tilesSprite) {
    this.tilesSprite = tilesSprite;
  }

  render(ctx, tile, x, y) {

    if (tile.object && tile.object.type === ObjectType.OBSTACLE) {
      greyRenderer(ctx, x, y, TILE_SIZE);
      return;
    }

    greenRenderer(ctx, x, y, TILE_SIZE);

    if (tile.object) {
      const [ sx, sy ] = tile.object.type == ObjectType.PERSON ? [ 0, 0 ] : [ 2, 3 ];
      const sxd = sx * TILE_SIZE;
      const syd = sy * TILE_SIZE;

      ctx.drawImage(
        this.tilesSprite, sxd, syd, TILE_SIZE, TILE_SIZE,
        x, y, TILE_SIZE, TILE_SIZE
      );
    }
  }
}
