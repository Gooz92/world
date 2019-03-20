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

  static CELL_SIZE = 12;

  static DEFAULT_OPTIONS = {
    getCellOptions: getObject
  };

  constructor(world, options = {}) {
    this.world = world;

    this.options = {
      ...WorldView.DEFAULT_OPTIONS,
      ...options
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

  drawCell(x, y) {
    const y0 = getCycleCoordinate(y, this.world.tiles.length);
    const x0 = getCycleCoordinate(x, this.world.tiles[y0].length);

    const tile = this.world.tiles[y0][x0];

    renderers[tile.object ? (tile.object.type || 0) : 0](
      this.context,
      x0 * WorldView.CELL_SIZE,
      y0 * WorldView.CELL_SIZE,
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

  placePerson(x, y) {
    const person = new Person(this.world.tiles, [ x, y ]);
    this.world.tiles[y][x].object = person;
    this.world.actors.push(person);
    return person;
  }

  place(x, y, type) {
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
