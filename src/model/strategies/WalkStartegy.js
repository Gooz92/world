import Strategy from './Strategy.js';
import MoveAction from 'model/actions/MoveAction.js';

import collisionHandler from '../collision-handler.js';

export default class WalkStrategy extends Strategy {

  static collisionHandler = collisionHandler;

  static onBeforeTick() {
    WalkStrategy.collisionHandler.handle();
  }

  constructor(actor, { path = [], onDone } = {}) {
    super(actor);

    this.path = path;

    if (onDone) {
      this.onDone = onDone;
    }

    WalkStrategy.collisionHandler.addWalker(actor);
  }

  onRemove() {
    WalkStrategy.collisionHandler.removeWalker(this.actor);
  }

  nextAction() {

    if (this.path.length === 0) {
      return this.onDone();
    }

    const { direction, position } = this.path.shift();

    return new MoveAction(this.actor, direction, position);
  }
}
