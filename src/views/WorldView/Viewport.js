import ViewportLayer from './ViewportLayer.js';

import {
  clearRenderer,
  selectionRenderer,
  renderPlacementArea,
  renderRedArea,
  renderGreenMask
} from './renderers.js';

import { createElement } from 'utils/dom';
import { last } from 'utils/common/array.utils.js';
import { forIn } from 'utils/common/object.utils.js';

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

    this.container = createElement('#viewport', {
      // in order to support keyboard events
      tabindex: 1,
      onmouseover() {
        this.focus();
      }
    });

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

    if (options.keyDown) {
      this.container.onkeydown = event => {
        options.keyDown(event.key);
      };
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

    this.tileRenderer.render(tile, x, y, this.cellSize);
  }

  drawSelection(tileX, tileY) {
    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    const guideLayer = this.getTopLayer();

    selectionRenderer(guideLayer.context, x, y, this.cellSize);
  }

  createTileRectangle(x, y, width, height) {

    const startX = width < 0 ? x + 1 : x;
    const startY = height < 0 ? y + 1 : y;

    const [ px, py, pw, ph ] = [ startX, startY, width, height ]
      .map(size => this.getSizeInPX(size));

    return {
      x: px,
      y: py,

      width: pw, height: ph
    };
  }

  // TODO
  drawRedArea(x0, y0, w, h) {
    const context = this.getTopLayer().context;

    const { x, y, width, height } = this.createTileRectangle(x0, y0, w, h);

    renderRedArea(context, x, y, width, height);
  }

  drawMask(x0, y0, mask) {
    const { context } = this.getTopLayer();

    for (let i = 0; i < mask.length; i++) {
      const y = this.getSizeInPX(y0 + i);
      for (let j = 0; j < mask[i].length; j++) {
        const x = this.getSizeInPX(x0 + j);
        renderGreenMask(context, x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
      }
    }
  }

  drawArea(x0, y0, pw, ph) {
    const { context } = this.getTopLayer();

    const { x, y, width, height } = this.createTileRectangle(x0, y0, pw, ph);

    renderPlacementArea(context, x, y, width, height);
  }

  clearArea(x0, y0, pw, ph) {
    const { context } = this.getTopLayer();

    const { x, y, width, height } = this.createTileRectangle(x0, y0, pw, ph);

    context.clearRect(x, y, width, height);
  }

  draw(x = 0, y = 0, width = this.width, height = this.height) {
    const endX = x + width, endY = y + height;

    const dx = Math.sign(width), dy = Math.sign(height);

    for (let tileX = x; tileX !== endX; tileX += dx) {
      for (let tileY = y; tileY !== endY; tileY += dy) {
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
