import { createElement } from 'utils/common/dom.utils.js';

export default class ViewportLayer {

  static ID_PREFIX = 'viewport-layer';

  constructor(viewport, name, { draw }) {
    this.viewport = viewport;
    this.name = name;

    this.draw = draw; // TODO: ????
  }

  createCanvas() {
    const [ w, h ] = this.viewport.size;

    const width = w * this.viewport.cellSize,
      height = h * this.viewport.cellSize;

    const canvas = createElement('canvas', {
      id: `viewport-${this.name}-layer`,
      width, height
    });

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    return canvas;
  }

  scrollVertical(dy) {
    const { width, height } = this.canvas;
    const { size } = this.viewport;

    const [ vw, vh ] = size;

    const dwy = this.viewport.cellSize * dy;

    const context = this.context;

    if (dy > 0) { // move to down
      const imageData = context.getImageData(0, dwy, width, height - dwy);
      context.putImageData(imageData, 0, 0);

      this.draw.call(this.viewport, 0, vh - dy, vw, dy);
    } else {
      const imageData = context.getImageData(0, 0, width, height + dwy);
      context.putImageData(imageData, 0, -dwy);

      this.draw.call(this.viewport, 0, 0, vw, -dy);
    }
  }

  scrollHorizontal(dx) {
    const { width, height } = this.canvas;
    const { size } = this.viewport;

    const [ vw, vh ] = size;

    const dwx = this.viewport.cellSize * dx;

    const context = this.context;

    if (dx > 0) { // move to right
      const imageData = context.getImageData(dwx, 0, width - dwx, height);
      context.putImageData(imageData, 0, 0);

      this.draw.call(this.viewport, vw - dx, 0, dx, vh);
    } else {
      const imageData = context.getImageData(0, 0, width + dwx, height);
      context.putImageData(imageData, -dwx, 0);

      this.draw.call(this.viewport, 0, 0, -dx, vh);
    }
  }

  setWidth(width) {
    const dw = this.viewport.width - width;

    if (dw === 0) {
      return;
    }

    const newCanvWidth = this.viewport.getSizeInPX(width);

    const canvWidth = this.canvas.width,
      canvHeight = this.canvas.height;

    const previousImage = this.context.getImageData(0, 0, canvWidth, canvHeight);

    this.canvas.width = newCanvWidth;

    if (width > this.viewport.width) {
      this.draw.call(this.viewport, width + dw, 0, -dw, this.viewport.height);
    }

    this.context.putImageData(previousImage, 0, 0);
  }

  setHeight(height) {

    const dh = this.viewport.height - height;

    if (dh === 0) {
      return;
    }

    const newCanvHeight = this.viewport.getSizeInPX(height);

    const canvWidth = this.canvas.width,
      canvHeight = this.canvas.height;

    const previousImage = this.context.getImageData(0, 0, canvWidth, canvHeight);

    this.canvas.height = newCanvHeight;

    if (height > this.viewport.height) {
      this.draw.call(this.viewport, 0, height + dh, this.viewport.width, -dh);
    }

    this.context.putImageData(previousImage, 0, 0);
  }
}
