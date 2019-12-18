import Action from '../actions/Action.js';

export default class Strategy {

  static IDLE = class IdleStrategy extends Strategy {
    nextAction() {
      return this.nextIdleAction();
    }
  }

  constructor(actor) {
    this.actor = actor;
  }

  onRemove() {}

  onDone() {
    return { Strategy: Strategy.IDLE };
  }

  onInit() {}

  nextStrategy() {
    return null;
  }

  getAction() {
    if (!this.action || this.action.completed) {
      this.action = this.nextAction();
    }

    return this.action;
  }

  nextIdleAction() {
    return new Action.IDLE(this.actor);
  }
}
