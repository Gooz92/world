import ObjectType from 'model/ObjectType.js';
import Person from 'model/Person.js';
import { createElement } from 'utils/dom.utils.js';
import { getObject, noop } from 'utils/fn.utils.js';
import { getCycleCoordinate } from 'utils/math.utils.js';

const renderers = [
  (ctx, x, y, size) => {
    ctx.clearRect(x, y, size, size);
  },
  (ctx, x, y, size) => {
    ctx.fillStyle = 'grey';
    ctx.fillRect(x, y, size, size);
  },
  (ctx, x, y, size) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y, size, size);
  },
  (ctx, x, y, size) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, size, size);
  }
];

export default class WorldView {

  static CELL_SIZE = 10;

  static DEFAULT_OPTIONS = {
    getCellOptions: getObject
  };

  constructor(world, options = {}) {
    this.world = world;

    this.options = {
      ...WorldView.DEFAULT_OPTIONS,
      ...options
    };

    this.viewport = {
      position: [ 0, 0 ],
      size: [ 128, 96 ]
    };
  }

  createCanvas() {

    const width = this.world.tiles[0].length * WorldView.CELL_SIZE;
    const height = this.world.tiles.length * WorldView.CELL_SIZE;

    const canvas = createElement('canvas', {
      width, height,
      onclick: e => {
        const x = Math.floor(e.clientX / WorldView.CELL_SIZE);
        const y = Math.floor(e.clientY / WorldView.CELL_SIZE);

        this.options.onclick(x, y);
      }
    });

    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    return canvas;
  }

  getTile(x, y) {
    const x0 = this.getCycleX(x);
    const y0 = this.getCycleY(y);

    return this.world.tiles[y0][x0];
  }

  drawCell(x, y) {
    const tile = this.getTile(x, y);

    const x0 = this.getCycleX(x - this.viewport.position[0]);
    const y0 = this.getCycleY(y - this.viewport.position[1]);

    renderers[tile.object ? (tile.object.type || 0) : 0](
      this.context,
      x0 * WorldView.CELL_SIZE, y0 * WorldView.CELL_SIZE,
      WorldView.CELL_SIZE
    );
  }


  tick() {
    this.world.tick()
      .forEach(event => {
        event.tiles.forEach(([ x, y ]) => {
          this.drawCell(x, y);
        });
      });
  }

  clear() {
    const { width, height } = this.canvas;
    this.context.clearRect(0, 0, width, height);
  }

  repaint(x0, y0, width, height) {
    const endX = x0 + width,
      endY = y0 + height;

    for (let x = x0; x < endX; x++) {
      for (let y = y0; y < endY; y++) {
        this.drawCell(x, y);
      }
    }
  }

  scrollVertical(dy) {
    const { width, height } = this.canvas;
    const { position, size } = this.viewport;

    position[1] = this.getCycleY(position[1] + dy);

    const [ vx, vy ] = position;
    const [ vw, vh ] = size;

    const dwy = WorldView.CELL_SIZE * dy;

    if (dy > 0) { // move to down
      const imageData = this.context.getImageData(0, dwy, width, height - dwy);
      this.context.putImageData(imageData, 0, 0);

      this.repaint(vx, vy + vh - dwy, vw, dwy);
    } else {
      const imageData = this.context.getImageData(0, 0, width, height + dwy);
      this.context.putImageData(imageData, 0, -dwy);

      this.repaint(vx, vy, vw, -dwy);
    }
  }

  scrollHorizontal(dx) {
    const { width, height } = this.canvas;
    const { position, size } = this.viewport;

    position[0] = this.getCycleX(position[0] + dx);

    const [ vx, vy ] = position;
    const [ vw, vh ] = size;

    const dwx = WorldView.CELL_SIZE * dx;

    if (dx > 0) { // move to right
      const imageData = this.context.getImageData(dwx, 0, width - dwx, height);
      this.context.putImageData(imageData, 0, 0);

      this.repaint(vx + vw - dx, vy, dx, vh);
    } else {
      const imageData = this.context.getImageData(0, 0, width + dwx, height);
      this.context.putImageData(imageData, -dwx, 0);

      this.repaint(vx, vy, -dx, vh);
    }
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

  placePerson(x, y) {
    const person = new Person(this.world.tiles, [ x, y ]);
    this.world.tiles[y][x].object = person;
    this.world.actors.push(person);
    return person;
  }

  place(x0, y0, type) {

    const [ vx, vy ] = this.viewport.position;

    const x = this.getCycleX(vx + x0);
    const y = this.getCycleY(vy + y0);

    if (type === ObjectType.PERSON) {
      this.placePerson(x, y);
    } else {
      this.world.tiles[y][x].object = { type };
    }

    this.drawCell(x, y);

    return this.world.tiles[y][x].object;
  }

  getCycleX(x) {
    return getCycleCoordinate(x, this.world.tiles[0].length);
  }

  getCycleY(y) {
    return getCycleCoordinate(y, this.world.tiles.length);
  }
}
