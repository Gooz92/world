import Strategy from './Strategy.js';
import MoveAction from '../actions/MoveAction.js';
import interpolate from '../../interpolate.js';

export default class PatrolStrategy extends Strategy {

  constructor(world, actor, options) {
    super(world, actor);
    this.positions = options.positions;
    this.positionIndex = 0;
  }

  getPath() {
    if (!this.path || this.path.length === 0) {
      const [ x, y ] = this.actor.position;
      const positionIndex = this.positionIndex++ % this.positions.length;
      const [ nextX, nextY ] = this.positions[positionIndex];

      this.path = interpolate(x, y, nextX, nextY);
    }

    return this.path;
  }

  nextAction() {
    const path = this.getPath();

    const position = path.shift();

    return new MoveAction(this.actor, position);
  }

}
