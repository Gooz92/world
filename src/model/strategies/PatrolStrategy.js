import Strategy from './Startegy.js';
import MoveAction from '../actions/MoveAction.js';
import line from '../../line.js';

export default class PatrolStrategy extends Strategy {

  constructor(world, actor, options) {
    super(world, actor);
    this.positions = options.positions;
    this.positionIndex = 0;
  }

  getPath() {
    if (!this.path || this.path.length === 0) {
      const [ x, y ] = this.actor.position;
      const [ nextX, nextY ] = this.positions[this.positionIndex++ % this.positions.length];

      this.path = line(x, y, nextX, nextY)
    }

    return this.path;
  }

  nextAction() {
    const path = this.getPath();

    const position = path.shift();

    return new MoveAction(this.actor, position);
  }

}