import { lowerFirst } from '../utils/string.utils.js';
import createField from '../create-field.js';

const HADLER_NAME_PATTERN = /^handle(.+)$/;

const classes = [ 'empty', 'obstacle', 'tree', 'person' ];

export default class WorldView {

  constructor(world) {
    this.world = world;
  }

  init() {
    this.handlers = Object.getOwnPropertyNames(WorldView.prototype)
      .reduce((handlers, methodName) => {
        const match = HADLER_NAME_PATTERN.exec(methodName);

        if (match) {
          const actionName = lowerFirst(match[1]);
          handlers[actionName] = this[methodName];
        }

        return handlers;
      }, {});
  }

  createField() {
    const field = createField(this.world.tiles, tile => ({
      className: classes[tile.object ? tile.object.type : 0]
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
