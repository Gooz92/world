import { get } from 'utils/common/object.utils.js';
import { noop } from 'utils/common/fn.utils';

const TILE_SIZE = 16;

function tileRenderer(token, color, bgColor) {
  return (ctx, x, y) => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = color;
    ctx.fillText(token, x + TILE_SIZE / 2, y + TILE_SIZE / 2);
  };
}

function terrainRenderer(bgColor) {
  return (ctx, x, y) => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  };
}

const stockBgRenderer = terrainRenderer('grey');

const terrainRenderes = {
  grass: terrainRenderer('#6daa2c'),
  stock: (ctx, x, y, tile) => {
    stockBgRenderer(ctx, x, y);
    if (!tile.object) {
      ctx.fillStyle = 'black';
      ctx.fillText('-', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
    }
  }
};

const renderers = {
  tree: tileRenderer('o', 'rgba(51, 101, 36, 1)'),
  food: tileRenderer(',', 'rgba(51, 101, 36, 1)'),
  person: tileRenderer('@', 'black'),
  building: tileRenderer('#', 'black', 'grey')
};

export default class AsciiTileRenderer {
  render(ctx, tile, x, y, tileSize) {
    ctx.font = 'bold 12px Courier New';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const terrain = get(tile, 'terrain.name');
    const objectType = get(tile, 'object.type.name');

    terrainRenderes[terrain || 'grass'](ctx, x, y, tile);
    (renderers[objectType] || noop)(ctx, x, y);
  }
}
