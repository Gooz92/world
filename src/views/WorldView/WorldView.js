import Viewport from './Viewport.js';
import { clearRenderer } from './renderers.js';


/**
 * TODO: Create world view controller or smth like that
 * to handle selection, object placing etc ?
 *
 * Is it a main game constroller ?
 */

export default class WorldView {

  constructor(world, { viewport }) {
    this.world = world;

    // TODO: passin worldView to viewport it's a bad idea ?
    this.viewport = new Viewport(world, this, viewport);

    this.selection = null;
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

    if (this.isSelectionMoved()) {
      this.clearSelection();
      this.selection.position = this.selection.object.position;
      const [ gx, gy ] = this.selection.position;

      const vx = this.world.getCycleX(gx - this.viewport.position[0]);
      const vy = this.world.getCycleY(gy - this.viewport.position[1]);

      this.viewport.drawSelection(vx, vy);
    }
  }

  clearSelection() {

    if (!this.selection) {
      return;
    }

    const guideLayer = this.viewport.getTopLayer();

    const [ gx, gy ] = this.selection.position;

    const vx = this.world.getCycleX(gx - this.viewport.position[0]);
    const vy = this.world.getCycleY(gy - this.viewport.position[1]);

    clearRenderer(
      guideLayer.context,
      this.viewport.cellSize * vx, this.viewport.cellSize * vy,
      this.viewport.cellSize
    );
  }

  resetSelection() {
    this.clearSelection();
    this.selection = null;
  }

  select(x, y) {
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    const { object } = this.world.getTile(gx, gy);

    if (!object) {
      this.resetSelection();
      return;
    }

    this.clearSelection();

    this.viewport.drawSelection(x, y);

    this.selection = {
      position: [ gx, gy ],
      object
    };

    return this.selection;
  }

  isSelectionMoved() {
    if (!this.selection || !this.selection.object.position) {
      return false;
    }

    const [ x0, y0 ] = this.selection.position;
    const [ x1, y1 ] = this.selection.object.position;

    return x0 !== x1 || y0 !== y1;
  }

  scrollVertical(dy) {
    this.viewport.scrollVertical(dy);
  }

  scrollHorizontal(dx) {
    this.viewport.scrollHorizontal(dx);
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

  place(x, y, type) {
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    const object = this.world.place(gx, gy, type);

    this.viewport.drawTile(x, y);

    return object;
  }

  clearTile(x, y) {
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    this.clearSelection();
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
