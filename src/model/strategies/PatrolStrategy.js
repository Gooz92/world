import Strategy from './Strategy.js';
import MoveAction from 'model/actions/MoveAction.js';

export default class PatrolStrategy extends Strategy {

  constructor(actor, { path = [] }) {
    super(actor);

    this.path = path; // assume that path is closed and passable
    this.pathNodeIndex = 0;
  }

  nextAction() {
    const { position } = this.path[this.pathNodeIndex];

    this.pathNodeIndex = ++this.pathNodeIndex % this.path.length;
    return new MoveAction(this.actor, position);
  }
}
