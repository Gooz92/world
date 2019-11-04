import ViewportLayer from './ViewportLayer.js';
import TileRenderer from './TileRenderer.js';

import {
  clearRenderer,
  selectionRenderer
} from './renderers.js';

import { createElement } from 'utils/common/dom.utils.js';
import { last } from 'utils/common/array.utils.js';

/**
 * viewport.size <= world.size
 */

export default class Viewport {

  static DEFAULT_CELL_SIZE = 16;
  static DEFAULT_SIZE = [ 16, 9 ];

  static createBuilder() {
    return {
      options: {},
      setWorld(world) {
        this.world = world;
        return this;
      },
      setOptions(options) {
        Object.assign(this.options, options);
        return this;
      },

      build() {
        return new Viewport(this.world, this.options);
      }
    };
  }

  constructor(world, options = {}) {
    this.position = [ 0, 0 ];
    this.cellSize = Viewport.DEFAULT_CELL_SIZE;
    this.size = Viewport.DEFAULT_SIZE;

    this.world = world;

    this.layers = [];

    this.container = createElement('#viewport');

    this.setOptions(options);
  }

  setOptions(options) {
    if (options.onTileClick) {
      this.container.onclick = this.handleMouseEvent((x, y) => {
        options.onTileClick(x, y);
      });
    }

    if (options.onRightClick) {
      this.container.oncontextmenu = this.handleMouseEvent((x, y) => {
        options.onRightClick(x, y);
      });
    }

    if (options.onMouseDown) {
      this.container.onmousedown = this.handleMouseEvent((x, y) => {
        options.onMouseDown(x, y);
      });
    }

    if (options.onTileEnter) {
      this.container.onmousemove = this.handleMouseMove((x, y) => {
        options.onTileEnter(x, y);
      });
    }

    if (options.tilesSprite) {
      this.tileRenderer = new TileRenderer(options.tilesSprite);
    }
  }

  handleMouseMove(handler) {

    let prevTileX, prevTileY;

    return event => {
      const { left, top } = event.target.getBoundingClientRect();
      const tileX = this.getTileCoordinate(event.clientX - left);
      const tileY = this.getTileCoordinate(event.clientY - top);

      if (prevTileX !== tileX || prevTileY !== tileY) {
        handler(tileX, tileY);
        prevTileX = tileX;
        prevTileY = tileY;
      }
    };
  }

  handleMouseEvent(handler) {

    return event => {
      const { left, top } = event.target.getBoundingClientRect();
      const tileX = this.getTileCoordinate(event.clientX - left);
      const tileY = this.getTileCoordinate(event.clientY - top);

      handler(tileX, tileY);

      return false;
    };
  }

  addLayer(name, options) {
    const layer = new ViewportLayer(this, name, options);
    this.layers.push(layer);

    const canvas = layer.createCanvas();

    this.container.appendChild(canvas);

    return this;
  }

  getBottomLayer() {
    return this.layers[0];
  }

  getTopLayer() {
    return last(this.layers);
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

  refreshTile(tileX, tileY) {

    const tile = this.world.getTile(tileX + this.position[0], tileY + this.position[1]);

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    const mainLayer = this.getBottomLayer();

    clearRenderer(mainLayer.context, x, y, this.cellSize);

    this.tileRenderer.render(mainLayer.context, tile, x, y, this.cellSize);
  }

  drawSelection(tileX, tileY) {
    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    const guideLayer = this.getTopLayer();

    selectionRenderer(guideLayer.context, x, y, this.cellSize);
  }

  drawArea(startX, startY, endX, endY) {
    const context = this.getTopLayer().context;

    const x1 = startX * this.cellSize, y1 = startY * this.cellSize;
    const x2 = endX * this.cellSize, y2 = endY * this.cellSize;

    context.fillStyle = 'rgba(255, 255, 0, 0.5)'; // TODO !!!
    context.fillRect(x1, y1, x2 - x1, y2 - y1);
  }

  clearArea(startX, startY, endX, endY) {
    const context = this.getTopLayer().context;

    const x1 = startX * this.cellSize, y1 = startY * this.cellSize;
    const x2 = endX * this.cellSize, y2 = endY * this.cellSize;

    context.clearRect(x1, y1, x2 - x1, y2 - y1);
  }

  draw(x = 0, y = 0, width = this.width, height = this.height) {
    const endX = x + width, endY = y + height;

    for (let tileX = x; tileX < endX; tileX++) {
      for (let tileY = y; tileY < endY; tileY++) {
        this.refreshTile(tileX, tileY);
      }
    }
  }

  scrollVertical(dy) {

    const { position } = this;

    position[1] = this.world.getCycleY(position[1] + dy);

    this.layers.forEach(layer => {
      layer.scrollVertical(dy);
    });
  }

  scrollHorizontal(dx) {

    const { position } = this;

    position[0] = this.world.getCycleX(position[0] + dx);

    this.layers.forEach(layer => {
      layer.scrollHorizontal(dx);
    });
  }

  adjustViewportSize() {

    const { width, height } = this.container.getBoundingClientRect();

    const w = Math.ceil(width / this.cellSize),
      h = Math.ceil(height / this.cellSize);

    this.setSize(w, h);
  }

  scale(r) {
    this.cellSize *= r;
    this.layers.forEach(layer => {
      layer.scale(r);
    });
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
