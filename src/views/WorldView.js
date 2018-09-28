import { lowerFirst } from '../utils/string.utils.js';

const HADLER_NAME_PATTERN = /^handle(.+)$/;

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

  tick() {
    world.tick()
      .forEach(event => {
        hadlers[event.type](event);
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
