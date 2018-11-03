import createHandlers from './create-handlers.js';
import createField from '../../create-field.js';
import ObjectType from 'model/ObjectType.js';
import Person from 'model/Person.js';
import { createElement } from 'utils/dom.utils.js';
import { getObject } from 'utils/fn.utils.js';
import { getSize, getPoint } from 'utils/geometry.utils.js';
import { map } from 'utils/object.utils.js';
import { getCycleCoordinate } from 'utils/math.utils.js';

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

class WorldView {

  static CELL_SIZE = 12;

  static DEFAULT_OPTIONS = {
    getCellOptions: getObject,
    viewport: {
      size: getSize(64, 36),
      position: getPoint(0, 0)
    }
  };

  constructor(world, options = WorldView.DEFAULT_OPTIONS) {
    this.world = world;
    this.options = options;
  }

  createField(options) {
    const settings = {
      ...WorldView.DEFAULT_OPTIONS,
      ...options
    };

    this.viewport = settings.viewport;

    const { width, height } = settings.viewport.size;

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
        this.handlers[event.type].call(this, event);
      });
  }

  placePerson(x, y) {
    const person = new Person(this.world, [ x, y ]);
    this.world.tiles[y][x].object = person;
    return person;
  }

  place(x, y, type) {
    if (type === ObjectType.PERSON) {
      this.placePerson(x, y);
    }

    this.world.tiles[y][x].object = { type };

    this.refreshTile(x, y);
  }

  refreshTile(x, y) {
    if (!this.inViewport(x, y)) {
      return false;
    }

    const tile = this.world.tiles[y][x];

    const x0 = x - this.viewport.position.x;
    const y0 = y - this.viewport.position.y;

    this.getCell(x0, y0).className = classes[tile.object ? tile.object.type : 0];
  }

  scrollDown(delta = 1) {
    this.removeEdgeCells('up');
    this.$appendBottomCells(1);

    const y = getCycleCoordinate(this.viewport.position.y + delta, this.world.tiles.length);

    this.viewport.position.y = y;
  }

  scrollUp(delta = 1) {
    this.removeEdgeCells('down');
    this.$appendTopCells(1);

    const y = getCycleCoordinate(this.viewport.position.y - delta, this.world.tiles.length);

    this.viewport.position.y = y;
  }

  scrollRight() {
    this.removeEdgeCells('left');
    this.$appendRightCells(1, 1);

    const x = getCycleCoordinate(this.viewport.position.x + 1, this.world.tiles[0].length);

    this.viewport.position.x = x;
  }

  scrollLeft() {
    this.removeEdgeCells('right');
    this.$appendLeftCells(1, 1);

    const x = getCycleCoordinate(this.viewport.position.x - 1, this.world.tiles[0].length);

    this.viewport.position.x = x;
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

  getCell(x, y) {
    const index = y * this.viewport.size.width + x;
    return this.field.childNodes[index];
  }

  inViewport(x, y) {
    return (
      x < this.viewport.position.x + this.viewport.size.width &&
      y < this.viewport.position.y + this.viewport.size.height &&
      x >= this.viewport.position.x && y >= this.viewport.position.y
    );
  }

  handleIdle() {}

  handleMove({ data: { from, to } }) {
    const [ fromX, fromY ] = from;
    const [ toX, toY ] = to;

    this.refreshTile(fromX, fromY);
    this.refreshTile(toX, toY);
  }

  handleCutTree({ data: { treePosition: [ x, y ] } }) {
    this.refreshTile(x, y);
  }
}

WorldView.prototype.handlers = createHandlers(WorldView.prototype);

export default WorldView;
