import Viewport from './Viewport';

import { getObject } from 'utils/fn.utils.js';

export default class WorldView {

  static DEFAULT_OPTIONS = {
    getCellOptions: getObject
  };

  constructor(world, options = {}) {
    this.world = world;
    this.viewport = new Viewport(world, [ 0, 0 ], [ 128, 96 ], options);
  }

  tick() {
    this.world.tick()
      .forEach(event => {
        event.tiles.forEach(([ x, y ]) => {
          this.viewport.drawTile(x, y);
        });
      });
  }

  scrollUp(dy = 1) {
    this.viewport.scrollVertical(-dy);
  }

  scrollDown(dy = 1) {
    this.viewport.scrollVertical(dy);
  }

  scrollLeft(dx = 1) {
    this.viewport.scrollHorizontal(-dx);
  }

  scrollRight(dx = 1) {
    this.viewport.scrollHorizontal(dx);
  }

  place(x, y, type) {
    const object = this.world.place(x, y, type);

    this.viewport.drawTile(x, y);

    return object;
  }
}
