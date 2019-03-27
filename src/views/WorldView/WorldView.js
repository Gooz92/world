import Viewport from './Viewport';

export default class WorldView {

  constructor(world, options = {}) {
    this.world = world;
    this.viewport = new Viewport(world, [ 0, 0 ], [ 128, 96 ], options);
  }

  tick() {
    this.world.tick()
      .forEach(event => {
        event.tiles.forEach(([ x, y ]) => {
          const vx = this.world.getCycleX(x - this.viewport.position[0]);
          const vy = this.world.getCycleY(y - this.viewport.position[1]);

          this.viewport.drawTile(vx, vy);
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
    const globalX = this.world.getCycleX(this.viewport.position[0] + x);
    const globalY = this.world.getCycleY(this.viewport.position[1] + y);

    const object = this.world.place(globalX, globalY, type);

    this.viewport.drawTile(x, y);

    return object;
  }
}
