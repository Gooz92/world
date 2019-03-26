import { createElement } from 'utils/dom.utils.js';

const renderers = [
  (ctx, x, y, size) => {
    ctx.clearRect(x, y, size, size);
  },
  (ctx, x, y, size) => {
    ctx.fillStyle = 'grey';
    ctx.fillRect(x, y, size, size);
  },
  (ctx, x, y, size) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, size, size);
  },
  (ctx, x, y, size) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, size, size);
  }
];

export default class Viewport {

  static DEFAULT_CELL_SIZE = 8;

  constructor(world, position, size, options = {}) {
    this.position = position;
    this.size = size;
    this.cellSize = Viewport.DEFAULT_CELL_SIZE;
    this.options = options;
    this.world = world;
  }

  createCanvas() {
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

    return canvas;
  }

  drawTile(tileX, tileY) {

    const tile = this.world.getTile(tileX + this.position[0], tileY + this.position[1]);

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    renderers[tile.object ? (tile.object.type || 0) : 0](
      this.context, x, y, this.cellSize
    );
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
