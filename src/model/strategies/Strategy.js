import Action from '../actions/Action.js';

export default class Strategy {

  static tick() {}

  constructor(world, actor) {
    this.world = world;
    this.actor = actor;
  }

  getAction() {
    if (!this.action || this.action.completed) {
      this.action = this.nextAction();
    }

    return this.action;
  }

  nextAction() {
    return Action.IDLE;
  }
}
