import {
  greyRenderer,
  clearRenderer,
  treeRenderer,
  personRenderer } from './renderers.js';

import { createElement } from 'utils/dom.utils.js';
import { noop } from 'utils/fn.utils.js';

const renderers = [
  noop, // empty space
  greyRenderer, // obstacle
  treeRenderer,
  personRenderer // person
];

/**
 * viewport.size <= world.size
 */

export default class Viewport {

  static DEFAULT_CELL_SIZE = 12;

  constructor(world, size, options = {}) {
    this.position = [ 0, 0 ];
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

  setHeight(height) {
    const dh = this.height - height;

    this.canvas.height = height * this.cellSize;

    if (height > this.height) {
      this.draw(0, height - this.height, this.width, dh);
    }

    this.size[1] = height;
  }

  setWidth(width) {
    const dw = this.width - width;

    this.canvas.width = width * this.cellSize;

    if (width > this.width) {
      this.draw(width - this.width, 0, dw, this.height);
    }

    this.size[0] = width;
  }

  clearTile(tileX, tileY) {    
    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    clearRenderer(this.context, x, y, this.cellSize);
  }

  drawTile(tileX, tileY) {

    const tile = this.world.getTile(tileX + this.position[0], tileY + this.position[1]);

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    clearRenderer(this.context, x, y, this.cellSize);

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
