import Viewport from './Viewport.js';
import { clearRenderer } from './renderers.js';

export default class WorldView {

  constructor(world, viewportOptions = {}) {
    this.world = world;

    const viewportSize = viewportOptions.viewportSize;
    this.viewport = new Viewport(world, viewportSize, viewportOptions);

    this.selectedPosition = null;
  }

  tick() {
    const tick = this.world.tick();

    tick.actions
      .forEach(event => {
        event.tiles.forEach(([ x, y ]) => {
          const vx = this.world.getCycleX(x - this.viewport.position[0]);
          const vy = this.world.getCycleY(y - this.viewport.position[1]);

          this.viewport.drawTile(vx, vy);
        });
      });

    if (tick.isSelectionMoved) {
      this.clearSelection();

      const [ x, y ] = this.world.selected.position;

      const vx = this.world.getCycleX(x - this.viewport.position[0]);
      const vy = this.world.getCycleY(y - this.viewport.position[1]);

      this.selectedPosition = [ vx, vy ];
      this.viewport.drawSelection(x, y);
    }

  }

  clearSelection() {
    const guideLayer = this.viewport.getTopLayer();

    const [ vx, vy ] = this.selectedPosition;

    clearRenderer(
      guideLayer.context,
      this.viewport.cellSize * vx, this.viewport.cellSize * vy,
      this.viewport.cellSize
    );
  }

  select(x, y) {
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    if (this.world.isTileOccupied(gx, gy)) {

      if (this.selectedPosition) {
        this.clearSelection();
      }

      this.selectedPosition = [ x, y ];
      this.viewport.drawSelection(x, y);

      return this.world.select(gx, gy);
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
