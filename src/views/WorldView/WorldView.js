import createField from '../../create-field.js';
import ObjectType from 'model/ObjectType.js';
import Person from 'model/Person.js';
import { createElement } from 'utils/dom.utils.js';
import { getObject } from 'utils/fn.utils.js';
import { getSize, getPoint } from 'utils/geometry.utils.js';
import { getCycleCoordinate, inCycleRange } from 'utils/math.utils.js';
import { insertionOptions, removementOptions } from './viewport.js';

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

export default class WorldView {

  static CELL_SIZE = 12;

  static DEFAULT_OPTIONS = {
    getCellOptions: getObject,
    viewport: {
      size: getSize(64, 36),
      position: getPoint(0, 0)
    }
  };

  constructor(world, options = {}) {
    this.world = world;

    this.options = {
      ...WorldView.DEFAULT_OPTIONS,
      ...options
    };

    this.viewport = this.options.viewport;
  }

  createField() {

    const { width, height } = this.viewport.size;

    this.field = createField(width, height, WorldView.CELL_SIZE, (x, y) => (
      this.createCell(x, y)
    ));

    return this.field;
  }

  createCell(x, y) {
    const y0 = getCycleCoordinate(y, this.world.tiles.length);
    const x0 = getCycleCoordinate(x, this.world.tiles[y0].length);

    const tile = this.world.tiles[y0][x0];

    return createElement('div', {
      ...this.options.getCellOptions(x0, y0),
      className: classes[tile.object ? tile.object.type : 0],
    });
  }

  tick() {
    this.world.tick()
      .forEach(event => {
        event.tiles.forEach(([ x, y ]) => {
          this.refreshTile(x, y);
        });
      });
  }

  setViewportWidth(width) {
    const deltaWidth = width - this.viewport.size.width;

    if (deltaWidth > 0) {
      this.insertCells('right', deltaWidth);
    } else {
      this.removeCells('right', -deltaWidth);
    }

    this.viewport.size.width += deltaWidth;

    this.field.style.width = (this.viewport.size.width * WorldView.CELL_SIZE) + 'px';
  }

  setViewportHeight(height) {
    const deltaHeight = height - this.viewport.size.height;

    if (deltaHeight > 0) {
      this.insertCells('down', deltaHeight);
    } else {
      this.removeCells('down', -deltaHeight);
    }

    this.viewport.size.height += deltaHeight;

    this.field.style.height = (this.viewport.size.height * WorldView.CELL_SIZE) + 'px';
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

    this.refreshTile(x, y);

    return this.world.tiles[y][x].object;
  }

  refreshTile(x, y) {
    if (!this.inViewport(x, y)) {
      return false;
    }

    const tile = this.world.tiles[y][x];

    this.getCell(x, y).className = classes[tile.object ? tile.object.type : 0];
  }

  scrollDown() {
    this.removeCells('up');
    this.insertCells('down');

    this.viewport.position.y = this.getCycleY(this.viewport.position.y + 1);
  }

  scrollUp() {
    this.removeCells('down');
    this.insertCells('up');

    this.viewport.position.y = this.getCycleY(this.viewport.position.y - 1);
  }

  scrollRight() {
    this.removeCells('left');
    this.insertCells('right', 1, 1);

    this.viewport.position.x = this.getCycleX(this.viewport.position.x + 1);
  }

  scrollLeft() {
    this.removeCells('right');
    this.insertCells('left', 1, 1);

    this.viewport.position.x = this.getCycleX(this.viewport.position.x - 1);
  }

  // === VIEWPORT SCALING ===

  insertCells(direction, delta = 1, shift = 0) {
    const { x, y } = this.viewport.position;
    const { width, height } = this.viewport.size;

    const [
      getCellCoords,
      getReferenceIndex,
      side
    ] = insertionOptions[direction](x, y, width, height, shift);

    for (let i = 0; i < delta; i++) {
      for (let j = 0; j < side; j++) {
        const [ x, y ] = getCellCoords(i, j);
        const cell = this.createCell(x, y);
        const referenceIndex = getReferenceIndex(i, j);

        const referenceCell = referenceIndex === -1 ? null :
          this.field.childNodes[referenceIndex];

        this.field.insertBefore(cell, referenceCell);
      }
    }
  }

  removeCells(direction, delta = 1) {
    const { width, height } = this.viewport.size;

    const [
      getRemovementIndex,
      side, decreasedSide
    ] = removementOptions[direction](width, height);

    for (let i = 0; i < delta; i++) {
      for (let j = 0; j < side; j++) {
        const removementIndex = getRemovementIndex(j, decreasedSide - i);
        const cell = this.field.childNodes[removementIndex];
        this.field.removeChild(cell);
      }
    }
  }

  getCycleX(x) {
    return getCycleCoordinate(x, this.world.tiles[0].length);
  }

  getCycleY(y) {
    return getCycleCoordinate(y, this.world.tiles.length);
  }

  getCell(x, y) {
    const y0 = this.getCycleY(y - this.viewport.position.y);
    const x0 = this.getCycleX(x - this.viewport.position.x);

    const index = y0 * this.viewport.size.width + x0;

    return this.field.childNodes[index];
  }

  inViewport(x, y) {
    const { position, size } = this.viewport;

    const rightBound = this.getCycleX(position.x + size.width);
    const bottomBound = this.getCycleY(position.y + size.height);

    return (
      inCycleRange(x, position.x, rightBound, this.world.tiles[0].length)
        &&
      inCycleRange(y, position.y, bottomBound, this.world.tiles.length)
    );
  }
}
