import ViewportLayer from './ViewportLayer.js';

import {
  clearRenderer,
  selectionRenderer
} from './renderers.js';

import { createElement } from 'utils/common/dom.utils.js';
import { last } from 'utils/common/array.utils.js';

import TileRenderer from './TileRenderer.js';

/**
 * viewport.size <= world.size
 */

export default class Viewport {

  static DEFAULT_CELL_SIZE = 16;

  constructor(world, worldView, options = {}) {
    this.position = [ 0, 0 ];
    this.size = options.size;
    this.cellSize = Viewport.DEFAULT_CELL_SIZE;

    this.world = world;
    this.worldView = worldView;

    this.layers = [];

    this.container = createElement('#viewport');

    this.addLayer('main', {
      draw: this.draw
    });

    this.addLayer('guide', {
      draw: (x, y, width, height) => {
        if (!this.worldView.selection) {
          return;
        }

        const [ gx, gy ] = this.worldView.selection.position;

        const vx = this.world.getCycleX(gx - this.position[0]);
        const vy = this.world.getCycleY(gy - this.position[1]);

        if (vx >= x && vx < width + x && vy >= y && vy < height + y) {
          this.drawSelection(vx, vy);
        } else {
          // TODO
          const px = this.getSizeInPX(x),
            py = this.getSizeInPX(y),
            pw = this.getSizeInPX(width),
            ph = this.getSizeInPX(height);

          this.getTopLayer().context.clearRect(px, py, pw, ph);
        }
      }
    });

    if (options.onTileClick) {
      this.container.onclick = this.handleMouseEvent((x, y) => {
        options.onTileClick(x, y);
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
    };
  }

  addLayer(name, options) {
    const layer = new ViewportLayer(this, name, options);
    this.layers.push(layer);

    const canvas = layer.createCanvas();

    this.container.appendChild(canvas);
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

  // TODO: rename ro refreshTile
  drawTile(tileX, tileY) {

    const tile = this.world.getTile(tileX + this.position[0], tileY + this.position[1]);

    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    const mainLayer = this.getBottomLayer();

    clearRenderer(mainLayer.context, x, y, this.cellSize);

    this.tileRenderer.render(mainLayer.context, tile, x, y);
  }

  drawSelection(tileX, tileY) {
    const x = tileX * this.cellSize;
    const y = tileY * this.cellSize;

    const guideLayer = this.getTopLayer();

    selectionRenderer(guideLayer.context, x, y, this.cellSize);
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
