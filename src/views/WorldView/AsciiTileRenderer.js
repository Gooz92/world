import { get } from 'utils/common/object.utils.js';
import ObjectType from 'model/ObjectType.enum';

function tileRenderer(token, color, bgColor) {
  return (ctx, x, y, tileSize) => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, tileSize, tileSize);
    ctx.font = 'bold 12px Verdana';
    ctx.fillStyle = color;
    ctx.fillText(token, x + 4, y + tileSize - 4);
  };
}

const renderers = {
  grass: tileRenderer('.', 'rgba(51, 101, 36, 1)', '#6daa2c'),
  tree: tileRenderer('o', 'rgba(51, 101, 36, 1)', '#6daa2c'),
  food: tileRenderer('"', 'rgba(51, 101, 36, 1)', '#6daa2c'),
  person: tileRenderer('@', 'black', '#6daa2c'),
  building: tileRenderer('#', 'black', 'grey'),
  stock: tileRenderer('_', 'black', 'grey')
};

export default class AsciiTileRenderer {
  render(ctx, tile, x, y, tileSize) {
    if (tile.terrain === ObjectType.STOCK) {
      renderers.stock(ctx, x, y, tileSize);
      return;
    }
    const objectType = get(tile, 'object.type.name');
    (renderers[objectType] || renderers.grass)(ctx, x, y, tileSize);
  }
}
