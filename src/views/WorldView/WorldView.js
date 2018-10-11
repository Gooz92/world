import { lowerFirst } from 'utils/string.utils.js';
import createField from '../../create-field.js';
import ObjectType from 'model/ObjectType.js';
import Person from 'model/Person.js';
import { getObject } from 'utils/fn.utils.js';

const HADLER_NAME_PATTERN = /^handle(.+)$/;

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

export default class WorldView {

  constructor(world) {
    this.world = world;
  }

  createField(getCellOptions = getObject) {
    const field = createField(this.world.tiles, (tile, x, y) => ({
      className: classes[tile.object ? tile.object.type : 0],
      ...getCellOptions(tile, x, y)
    }));

    this.field = field.table;
    this.cells = field.cells;

    return field;
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
    const tile = this.world.tiles[y][x];
    this.cells[y][x].className = classes[tile.object ? tile.object.type : 0];
  }

  handleIdle() {}

  handleMove({ data: { from, to } }) {
    const [ fromX, fromY ] = from;
    const [ toX, toY ] = to;

    const startCell = this.cells[fromY][fromX];
    const endCell = this.cells[toY][toX];

    startCell.className = '';
    endCell.className = 'person';
  }

  handleCutTree({ data: { treePosition: [ x, y ] } }) {
    this.cells[y][x].className = 'empty';
  }
}


function initHandlers() {
  WorldView.prototype.handlers = Object.getOwnPropertyNames(WorldView.prototype)
    .reduce((handlers, methodName) => {
      const match = HADLER_NAME_PATTERN.exec(methodName);

      if (match) {
        const actionName = lowerFirst(match[1]);
        handlers[actionName] = WorldView.prototype[methodName];
      }

      return handlers;
    }, {});
}

initHandlers();
