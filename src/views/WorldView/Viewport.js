import ViewportLayer from './ViewportLayer.js';
import TileRenderer from './TileRenderer.js';

import {
  clearRenderer,
  selectionRenderer,
  renderPlacementArea
} from './renderers.js';

import { createElement } from 'utils/common/dom.utils.js';
import { last } from 'utils/common/array.utils.js';
import { forIn } from 'utils/common/object.utils.js';
import { normalizeArea } from 'utils/common/geometry.utils.js';

/**
 * viewport.size <= world.size
 */

export default class Viewport {

  static DEFAULT_CELL_SIZE = 16;
  static DEFAULT_SIZE = [ 16, 9 ];

  static MOUSE_EVENT_HANDLERS = {
    click: 'onclick',
    rightClick: 'oncontextmenu',
    mouseDown: 'onmousedown',
    mouseUp: 'onmouseup'
  };

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

    forIn(Viewport.MOUSE_EVENT_HANDLERS, (domEventName, handlerName) => {
      const handler = options[handlerName];
      if (handler) {
        this.container[domEventName] = this.handleMouseEvent(handler);
      }
    });

    if (options.mouseMove) {
      this.container.onmousemove = this.handleMouseMove((x, y) => {
        options.mouseMove(x, y);
      });
    }

    if (options.tilesSprite) {
      this.tileRenderer = new TileRenderer(options.tilesSprite);
    }
  }

  getTileRelativePosition(px, py) {
    const topLayer = this.getTopLayer();
    const { left, top } = topLayer.canvas.getBoundingClientRect();

    return [
      this.getTileCoordinate(px - left),
      this.getTileCoordinate(py - top)
    ];
  }

  handleMouseMove(handler) {

    let prevTileX, prevTileY;

    return event => {
      const [ tileX, tileY ] = this.getTileRelativePosition(event.clientX, event.clientY);

      if (prevTileX !== tileX || prevTileY !== tileY) {
        handler(tileX, tileY);
        prevTileX = tileX;
        prevTileY = tileY;
      }
    };
  }

  handleMouseEvent(handler) {

    return event => {
      const [ tileX, tileY ] = this.getTileRelativePosition(event.clientX, event.clientY);

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

  createTileRectangle(x1, y1, x2, y2) {
    const [ minX, minY, maxX, maxY ] = normalizeArea(x1, y1, x2, y2);

    const startX = this.getSizeInPX(minX), startY = this.getSizeInPX(minY);
    const endX = this.getSizeInPX(maxX + 1), endY = this.getSizeInPX(maxY + 1);

    const width = endX - startX, height = endY - startY;

    return {
      x: startX,
      y: startY,

      width, height
    };
  }

  drawArea(x1, y1, x2, y2) {
    const context = this.getTopLayer().context;

    const { x, y, width, height } = this.createTileRectangle(x1, y1, x2, y2);

    renderPlacementArea(context, x, y, width, height);
  }

  clearArea(x1, y1, x2, y2) {
    const context = this.getTopLayer().context;

    const { x, y, width, height } = this.createTileRectangle(x1, y1, x2, y2);

    context.clearRect(x, y, width, height);
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
