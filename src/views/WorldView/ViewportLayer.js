import { greenRenderer, greyRenderer } from './renderers.js';
import { createElement } from 'utils/common/dom.utils.js';

const TILE_SIZE = 16;

class TileRenderer {

  constructor(tilesSprite) {
    this.tilesSprite = tilesSprite;
  }

  render(ctx, tile, x, y) {

    if (tile.object && tile.object.type === 1) {
      greyRenderer(ctx, x, y, TILE_SIZE);
      return;
    }

    greenRenderer(ctx, x, y, TILE_SIZE);

    if (tile.object) {
      const [ sx, sy ] = tile.object.type == 3 ? [ 0, 0 ] : [ 2, 3 ];
      const sxd = sx * TILE_SIZE;
      const syd = sy * TILE_SIZE;

      ctx.drawImage(
        this.tilesSprite, sxd, syd, TILE_SIZE, TILE_SIZE,
        x, y, TILE_SIZE, TILE_SIZE
      );
    }
  }
}

export default class ViewportLayer {

  static ID_PREFIX = 'viewport-layer';

  constructor(viewport, name) {
    this.viewport = viewport;
    this.name = name;

    const tilesSprite = document.getElementById('tiles-sprite'); // ?
    this.tileRenderer = new TileRenderer(tilesSprite);
  }

  createCanvas() {
    const [ w, h ] = this.viewport.size;

    const width = w * TILE_SIZE, height = h * TILE_SIZE;

    const canvas = createElement('canvas', {
      id: `viewport-${this.name}-layer`,
      width, height,
      onclick: this.handleMouseEvent((x, y) => {
        this.viewport.options.onTileClick(x, y);
      }),
      onmousemove: this.handleMouseEvent((x, y) => {
        this.viewport.options.onTileEnter(x, y);
      })
    });

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    return canvas;
  }

  handleMouseEvent(handler) {

    return event => {
      const { left, top } = event.target.getBoundingClientRect();
      const tileX = this.viewport.getTileCoordinate(event.clientX - left);
      const tileY = this.viewport.getTileCoordinate(event.clientY - top);

      handler(tileX, tileY);
    };
  }

  setWidth(width) {
    const dw = this.viewport.width - width;

    if (dw === 0) {
      return;
    }

    const previousCanvas = this.cloneCanvas();

    this.canvas.width = this.viewport.getSizeInPX(width);

    if (width > this.viewport.width) {
      this.viewport.draw(width + dw, 0, -dw, this.height);
    }

    this.context.drawImage(previousCanvas, 0, 0);
  }

  setHeight(height) {

    const dh = this.viewport.height - height;

    if (dh === 0) {
      return;
    }

    const previousCanvas = this.cloneCanvas();

    this.canvas.height = this.viewport.getSizeInPX(height);

    if (height > this.viewport.height) {
      this.viewport.draw(0, height + dh, this.width, -dh);
    }

    this.context.drawImage(previousCanvas, 0, 0);
  }

  cloneCanvas() {
    const clonedCanvas = this.canvas.cloneNode();
    const ctx = clonedCanvas.getContext('2d');

    ctx.drawImage(this.canvas, 0, 0);

    return clonedCanvas;
  }
}
