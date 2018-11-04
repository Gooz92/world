import createField from '../../create-field.js';
import ObjectType from 'model/ObjectType.js';
import Person from 'model/Person.js';
import { createElement } from 'utils/dom.utils.js';
import { getObject } from 'utils/fn.utils.js';
import { getSize, getPoint } from 'utils/geometry.utils.js';
import { map } from 'utils/object.utils.js';
import { getCycleCoordinate, inCycleRange } from 'utils/math.utils.js';

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
    this.removeEdgeCells('up');
    this.$appendBottomCells(1);

    this.viewport.position.y = this.getCycleY(this.viewport.position.y + 1);
  }

  scrollUp() {
    this.removeEdgeCells('down');
    this.$appendTopCells(1);

    this.viewport.position.y = this.getCycleY(this.viewport.position.y - 1);
  }

  scrollRight() {
    this.removeEdgeCells('left');
    this.$appendRightCells(1, 1);

    this.viewport.position.x = this.getCycleX(this.viewport.position.x + 1);
  }

  scrollLeft() {
    this.removeEdgeCells('right');
    this.$appendLeftCells(1, 1);

    this.viewport.position.x = this.getCycleX(this.viewport.position.x - 1);
  }

  // === VIEWPORT SCALING ===

  appendEdgeCells(direction, delta, shift) {
    const { x, y } = this.viewport.position;
    const { width, height } = this.viewport.size;

    const options = {
      up: [ (i, j) => [ x + width - j - 1, y - 1 - i ], () => 0 ],
      down: [ (i, j) => [ x + j, y + height + i ], () => null ],

      left: [
        (i, j) => [ x - 1, y + j ],
        (i, j, insertionCount) => (width - shift) * j + insertionCount
      ],

      right: [
        (i, j) => [ x + width, y + j ],
        (i, j, insertionCount) => (width - shift) * (j + 1) + insertionCount
      ]
    };

    const [ getCellCoords, getReferenceIndex ] = options[direction];

    const sideName = [ 'up', 'down' ].includes(direction) ? 'width' : 'height';
    let side = this.viewport.size[sideName];

    let insertionCount = 0;

    for (let i = 0; i < delta; i++) {
      for (let j = 0; j < side; j++) {
        const [ x, y ] = getCellCoords(i, j);
        const cell = this.createCell(x, y);
        const referenceIndex = getReferenceIndex(i, j, insertionCount++);
        this.field.insertBefore(cell, this.field.childNodes[referenceIndex]);
      }
    }
  }

  $appendTopCells() {
    this.appendEdgeCells('up', 1);
  }

  $appendBottomCells() {
    this.appendEdgeCells('down', 1);
  }

  $appendRightCells(delta, shift) {
    this.appendEdgeCells('right', delta, shift);
  }

  $appendLeftCells(delta, shift) {
    this.appendEdgeCells('left', delta, shift);
  }

  getRemovementOptions() {

    return map({
      up: [ () => this.field.firstChild, 'width' ],
      down: [ () => this.field.lastChild, 'width' ],

      left: [
        (index, width) => this.field.childNodes[index * (width - 1)],
        'height'
      ],
      right: [
        (index, width) => this.field.childNodes[index * (width - 1) + width - 1],
        'height'
      ]
    }, ([ getCellToRemove, dimension ]) => ({
      getCellToRemove,
      dimension
    }));
  }

  removeEdgeCells(direction, delta = 1) {
    const { getCellToRemove, dimension } = this.getRemovementOptions()[direction];
    let side = this.viewport.size[dimension];

    let decreasedSide = this.viewport.size[
      dimension === 'width' ? 'height' : 'width'
    ];

    for (let i = 0; i < delta; i++) {
      for (let j = 0; j < side; j++) {
        const cellToRemove = getCellToRemove(j, decreasedSide);
        this.field.removeChild(cellToRemove);
      }
      --decreasedSide;
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
