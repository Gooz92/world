import { createElement } from 'utils/common/dom.utils.js';

export default class ViewportLayer {

  static ID_PREFIX = 'viewport-layer';

  constructor(viewport, name) {
    this.viewport = viewport;
    this.name = name;
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

  setWidth(width) {
    const dw = this.viewport.width - width;

    if (dw === 0) {
      return;
    }

    const previousCanvas = this.cloneCanvas();

    this.canvas.width = this.viewport.getSizeInPX(width);

    if (width > this.viewport.width) {
      this.viewport.draw(width + dw, 0, -dw, this.height);
    }

    this.context.drawImage(previousCanvas, 0, 0);
  }

  setHeight(height) {

    const dh = this.viewport.height - height;

    if (dh === 0) {
      return;
    }

    const previousCanvas = this.cloneCanvas();

    this.canvas.height = this.viewport.getSizeInPX(height);

    if (height > this.viewport.height) {
      this.viewport.draw(0, height + dh, this.width, -dh);
    }

    this.context.drawImage(previousCanvas, 0, 0);
  }

  cloneCanvas() {
    const clonedCanvas = this.canvas.cloneNode();
    const ctx = clonedCanvas.getContext('2d');

    ctx.drawImage(this.canvas, 0, 0);

    return clonedCanvas;
  }
}
