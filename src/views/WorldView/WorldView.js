import Viewport from './Viewport.js';
import { clearRenderer } from './renderers.js';

export default class WorldView {

  constructor(world, viewportOptions = {}) {
    this.world = world;

    const viewportSize = viewportOptions.viewportSize;
    this.viewport = new Viewport(world, viewportSize, viewportOptions);
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

  select(x, y) {
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    if (this.world.isTileOccupied(gx, gy)) {

      if (this.world.selected) {
        const guideLayer = this.viewport.getTopLayer();
        const [ sx, sy ] = this.world.selected.position;

        const vx = this.world.getCycleX(sx - this.viewport.position[0]);
        const vy = this.world.getCycleY(sy - this.viewport.position[1]);

        clearRenderer(
          guideLayer.context,
          this.viewport.cellSize * vx, this.viewport.cellSize * vy,
          this.viewport.cellSize
        );
      }

      this.world.select(gx, gy);
      this.viewport.drawSelection(x, y);
    }
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
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    const object = this.world.place(gx, gy, type);

    this.viewport.drawTile(x, y);

    return object;
  }

  clearTile(x, y) {
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    this.world.clearTile(gx, gy);

    this.viewport.drawTile(x, y);
  }

  getGlobalPosition(x, y) {
    return [
      this.world.getCycleX(this.viewport.position[0] + x),
      this.world.getCycleY(this.viewport.position[1] + y)
    ];
  }
}
