import ViewportLayer from './ViewportLayer.js';
import { clearRenderer } from './renderers.js';
import { createElement } from 'utils/common/dom.utils.js';

/**
 * viewport.size <= world.size
 */

export default class Viewport {

  static DEFAULT_CELL_SIZE = 16;

  constructor(world, size, options = {}) {
    this.position = [ 0, 0 ];
    this.size = size;
    this.cellSize = Viewport.DEFAULT_CELL_SIZE;

    this.world = world;

    this.layers = [];

    this.container = createElement('#viewport');

    this.addLayer('main');
    this.addLayer('guide');

    if (options.onTileClick) {
      this.container.onclick = this.handleMouseEvent((x, y) => {
        options.onTileClick(x, y);
      });
    }

    if (options.onTileEnter) {
      this.container.onmousemove = this.handleMouseEvent((x, y) => {
        options.onTileEnter(x, y);
      });
    }
  }

  handleMouseEvent(handler) {

    return event => {
      const { left, top } = event.target.getBoundingClientRect();
      const tileX = this.getTileCoordinate(event.clientX - left);
      const tileY = this.getTileCoordinate(event.clientY - top);

      handler(tileX, tileY);
    };
  }

  addLayer(name) {
    const layer = new ViewportLayer(this, name);
    this.layers.push(layer);

    const canvas = layer.createCanvas();

    this.container.appendChild(canvas);
  }

  getBottomLayer() {
    return this.layers[0];
  }

  getSizeInPX(tiles) {
    return this.cellSize * tiles;
  }

  setSize(width, height) {
    this.setWidth(width);
    this.setHeight(height);
  }

  setHeight(height) {

    this.layers.forEach(layer => {
      layer.setHeight(height);
    });

    this.size[1] = height;
  }

  setWidth(width) {

    this.layers.forEach(layer => {
      layer.setWidth(width);
    });

    this.size[0] = width;
  }

  clearTile(tileX, tileY) {
    const x = this.getSizeInPX(tileX);
    const y = this.getSizeInPX(tileY);

    clearRenderer(this.getBottomLayer().context, x, y, this.cellSize);
  }

  drawTile(tileX, tileY) {

    const tile = this.world.getTile(tileX + this.position[0], tileY + this.position[1]);

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    const mainLayer = this.getBottomLayer();

    clearRenderer(mainLayer.context, x, y, this.cellSize);

    mainLayer.tileRenderer.render(mainLayer.context, tile, x, y);
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
    const { width, height } = this.getBottomLayer().canvas;
    const { position, size } = this;

    position[1] = this.world.getCycleY(position[1] + dy);

    const [ vw, vh ] = size;

    const dwy = this.cellSize * dy;

    const context = this.getBottomLayer().context;

    if (dy > 0) { // move to down
      const imageData = context.getImageData(0, dwy, width, height - dwy);
      context.putImageData(imageData, 0, 0);

      this.draw(0, vh - dwy, vw, dwy);
    } else {
      const imageData = context.getImageData(0, 0, width, height + dwy);
      context.putImageData(imageData, 0, -dwy);

      this.draw(0, 0, vw, -dwy);
    }
  }

  scrollHorizontal(dx) {
    const { width, height } = this.getBottomLayer().canvas;
    const { position, size } = this;

    position[0] = this.world.getCycleX(position[0] + dx);

    const [ vw, vh ] = size;

    const dwx = this.cellSize * dx;

    const context = this.getBottomLayer().context;

    if (dx > 0) { // move to right
      const imageData = context.getImageData(dwx, 0, width - dwx, height);
      context.putImageData(imageData, 0, 0);

      this.draw(vw - dx, 0, dx, vh);
    } else {
      const imageData = context.getImageData(0, 0, width + dwx, height);
      context.putImageData(imageData, -dwx, 0);

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
