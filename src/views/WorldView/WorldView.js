/**
 * TODO: Create world view controller or smth like that
 * to handle selection, object placing etc ?
 *
 * Is it a main game constroller ?
 */

export default class WorldView {

  constructor(world, viewport) {
    this.world = world;
    this.viewport = viewport;

    this.selection = null;
  }

  static _instance = null;

  static getInstance(world, viewport) {
    if (this._instance) {
      this._instance.world = world;
      this._instance.viewport = viewport;
    } else {
      this._instance = new WorldView(world, viewport);
    }

    return this._instance;
  }

  initLayers() {

    this.viewport
      .addLayer('main', {
        draw: this.viewport.draw
      })
      .addLayer('guide', {
        draw: (x, y, width, height) => {
          if (!this.selection) {
            return;
          }

          const [ gx, gy ] = this.selection.position;

          const vx = this.world.getCycleX(gx - this.viewport.position[0]);
          const vy = this.world.getCycleY(gy - this.viewport.position[1]);

          if (vx >= x && vx < width + x && vy >= y && vy < height + y) {
            this.viewport.drawSelection(vx, vy);
          } else {
            // TODO
            const px = this.viewport.getSizeInPX(x),
              py = this.viewport.getSizeInPX(y),
              pw = this.viewport.getSizeInPX(width),
              ph = this.viewport.getSizeInPX(height);

            this.viewport.getTopLayer().context.clearRect(px, py, pw, ph);
          }
        }
      });
  }

  tick() {
    const actions = this.world.tick();

    actions
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

    if (this.isSelectedObjectRemoved()) {
      this.resetSelection();
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

    guideLayer.clearTile(vx, vy);
  }

  resetSelection() {
    this.clearSelection();
    this.selection = null;
  }

  select(x, y) {
    const [ gx, gy ] = this.getGlobalPosition(x, y);

    if (!this.world.isTileOccupied(gx, gy)) { // TODO ?
      this.resetSelection();
      return;
    }

    this.clearSelection();

    this.viewport.drawSelection(x, y);

    this.selection = {
      position: [ gx, gy ],
      object: this.world.getTile(gx, gy).object
    };

    return this.selection;
  }

  // TODO: Handle manually selection changes is too error-prone (
  isSelectedObjectRemoved() {
    if (!this.selection) {
      return false;
    }

    const [ x, y ] = this.selection.position;

    return !this.world.isTileOccupied(x, y);
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
