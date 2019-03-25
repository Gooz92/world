import { createElement } from 'utils/dom.utils.js';

export default class Viewport {

  static DEFAULT_CELL_SIZE = 16;

  constructor(position, size, options = {}) {
    this.position = position;
    this.size = size;
    this.cellSize = Viewport.DEFAULT_CELL_SIZE;
    this.options = options;
  }

  initCanvas() {
    const [ w, h ] = this.size;

    const width = w * this.cellSize,
      height = h * this.cellSize;

    const canvas = createElement('canvas', {
      width, height,
      onclick: event => {
        const tileX = this.getTileCoordinate(event.clientX);
        const tileY = this.getTileCoordinate(event.clientY);

        this.options.onTileClick(tileX, tileY);
      }
    });

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  drawTile(tileX, tileY, render) {

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    render(this.context, this.cellSize, x, y);
  }

  draw(x = 0, y = 0, width = this.width, height = this.height) {
    const endX = x + width, endY = y + height;

    for (let tileX = x; tileX < endX; tileX++) {
      for (let tileY = y0; tileY < endY; tileY++) {
        this.drawTile(tileX, tileY);
      }
    }
  }

  getImageData(tileX, tileY, width, height) {

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    const w = width * this.cellSize;
    const h = height * this.cellSize;

    return this.context.getImageData(x, y, w, h);
  }

  scrollVertical(dy) {
    const { width, height } = this.canvas;
    const { position, size } = this.viewport;

    position[1] = this.getCycleY(position[1] + dy);

    const [ vx, vy ] = position;
    const [ vw, vh ] = size;

    const dwy = this.cellSize * dy;

    if (dy > 0) { // move to down
      const imageData = this.context.getImageData(0, dwy, width, height - dwy);
      this.context.putImageData(imageData, 0, 0);

      this.repaint(vx, vy + vh - dwy, vw, dwy);
    } else {
      const imageData = this.context.getImageData(0, 0, width, height + dwy);
      this.context.putImageData(imageData, 0, -dwy);

      this.repaint(vx, vy, vw, -dwy);
    }
  }

  scrollHorizontal(dx) {
    const { width, height } = this.canvas;
    const { position, size } = this.viewport;

    position[0] = this.getCycleX(position[0] + dx);

    const [ vx, vy ] = position;
    const [ vw, vh ] = size;

    const dwx = WorldView.CELL_SIZE * dx;

    if (dx > 0) { // move to right
      const imageData = this.context.getImageData(dwx, 0, width - dwx, height);
      this.context.putImageData(imageData, 0, 0);

      this.repaint(vx + vw - dx, vy, dx, vh);
    } else {
      const imageData = this.context.getImageData(0, 0, width + dwx, height);
      this.context.putImageData(imageData, -dwx, 0);

      this.repaint(vx, vy, -dx, vh);
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
