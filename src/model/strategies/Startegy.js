import Action from '../actions/Action.js';

export default class Strategy {

  static IDLE_STRATEGY = new class IdleStartegy extends Strategy {

    nextAction() {
      return Action.IDLE;
    }
  }

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
}
