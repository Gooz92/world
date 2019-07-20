import { createElement } from 'utils/common/dom.utils.js';
import { clearRenderer, greenRenderer, greyRenderer } from './renderers.js';

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

/**
 * viewport.size <= world.size
 */

export default class Viewport {

  static DEFAULT_CELL_SIZE = 16;

  constructor(world, size, options = {}) {
    this.position = [ 0, 0 ];
    this.size = size;
    this.cellSize = Viewport.DEFAULT_CELL_SIZE;
    this.options = options;

    const tilesSprite = document.getElementById('tiles-sprite');
    this.tileRenderer = new TileRenderer(tilesSprite);
    this.world = world;
  }

  createCanvas() {
    const [ w, h ] = this.size;

    const width = w * this.cellSize,
      height = h * this.cellSize;

    const canvas = createElement('canvas', {
      width, height,
      onclick: this.handleMouseEvent((x, y) => {
        this.options.onTileClick(x, y);
      }),
      onmousemove: this.handleMouseEvent((x, y) => {
        this.options.onTileEnter(x, y);
      })
    });

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    return canvas;
  }

  handleMouseEvent(handler) {

    return event => {
      const { left, top } = event.target.getBoundingClientRect();
      const tileX = this.getTileCoordinate(event.clientX - left);
      const tileY = this.getTileCoordinate(event.clientY - top);

      handler(tileX, tileY);
    };
  }

  getSizeInPX(tiles) {
    return this.cellSize * tiles;
  }

  cloneCanvas() {
    const clonedCanvas = this.canvas.cloneNode();
    const ctx = clonedCanvas.getContext('2d');

    ctx.drawImage(this.canvas, 0, 0);

    return clonedCanvas;
  }

  setHeight(height) {

    const dh = this.height - height;

    if (dh === 0) {
      return;
    }

    const previousCanvas = this.cloneCanvas();

    this.canvas.height = this.getSizeInPX(height);

    if (height > this.height) {
      this.draw(0, height + dh, this.width, -dh);
    }

    this.context.drawImage(previousCanvas, 0, 0);

    this.size[1] = height;
  }

  setWidth(width) {
    const dw = this.width - width;

    if (dw === 0) {
      return;
    }

    const previousCanvas = this.cloneCanvas();

    this.canvas.width = this.getSizeInPX(width);

    if (width > this.width) {
      this.draw(width + dw, 0, -dw, this.height);
    }

    this.context.drawImage(previousCanvas, 0, 0);

    this.size[0] = width;
  }

  clearTile(tileX, tileY) {
    const x = this.getSizeInPX(tileX);
    const y = this.getSizeInPX(tileY);

    clearRenderer(this.context, x, y, this.cellSize);
  }

  drawTile(tileX, tileY) {

    const tile = this.world.getTile(tileX + this.position[0], tileY + this.position[1]);

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    clearRenderer(this.context, x, y, this.cellSize);

    this.tileRenderer.render(this.context, tile, x, y);
  }

  draw(x = 0, y = 0, width = this.width, height = this.height) {
    const endX = x + width, endY = y + height;

    for (let tileX = x; tileX < endX; tileX++) {
      for (let tileY = y; tileY < endY; tileY++) {
        this.drawTile(tileX, tileY);
      }
    }
  }

  scrollVertical(dy) {
    const { width, height } = this.canvas;
    const { position, size } = this;

    position[1] = this.world.getCycleY(position[1] + dy);

    const [ vw, vh ] = size;

    const dwy = this.cellSize * dy;

    if (dy > 0) { // move to down
      const imageData = this.context.getImageData(0, dwy, width, height - dwy);
      this.context.putImageData(imageData, 0, 0);

      this.draw(0, vh - dwy, vw, dwy);
    } else {
      const imageData = this.context.getImageData(0, 0, width, height + dwy);
      this.context.putImageData(imageData, 0, -dwy);

      this.draw(0, 0, vw, -dwy);
    }
  }

  scrollHorizontal(dx) {
    const { width, height } = this.canvas;
    const { position, size } = this;

    position[0] = this.world.getCycleX(position[0] + dx);

    const [ vw, vh ] = size;

    const dwx = this.cellSize * dx;

    if (dx > 0) { // move to right
      const imageData = this.context.getImageData(dwx, 0, width - dwx, height);
      this.context.putImageData(imageData, 0, 0);

      this.draw(vw - dx, 0, dx, vh);
    } else {
      const imageData = this.context.getImageData(0, 0, width + dwx, height);
      this.context.putImageData(imageData, -dwx, 0);

      this.draw(0, 0, -dx, vh);
    }
  }

  scrollUp(dy = 1) {
    this.scrollVertical(-dy);
  }

  scrollDown(dy = 1) {
    this.scrollVertical(dy);
  }

  scrollLeft(dx = 1) {
    this.scrollHorizontal(-dx);
  }

  scrollRight(dx = 1) {
    this.scrollHorizontal(dx);
  }

  getTileCoordinate(coord) {
    return Math.floor(coord / this.cellSize);
  }

  get width() {
    return this.size[0];
  }

  get height() {
    return this.size[1];
  }
}
