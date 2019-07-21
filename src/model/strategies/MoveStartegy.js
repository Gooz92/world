import Strategy from './Startegy.js';
import MoveAction from 'model/actions/MoveAction.js';

export default class MoveStrategy extends Strategy {

  constructor(world, actor, { path }) {
    super(world, actor);
    this.path = path;
  }

  nextAction() {

    const position = this.path.shift();

    return new MoveAction(this.actor, position);
  }
}
