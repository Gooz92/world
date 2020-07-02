import Action from '../actions/Action.js';
import { lowerFirst } from 'utils/common/string.utils.js';

const SUB_CLASS_NAME_PATTERN = /^([A-z]+)State$/;

export default class State {

  static IDLE = class IdleState extends State {

    nextAction() {
      return new Action.IDLE(this.actor);
    }
  }

  constructor(actor) {
    this.actor = actor;
  }

  getAction() {
    if (!this.action || this.action.completed) {
      this.action = this.nextAction();
    }

    return this.action;
  }

  update() {}

  getName() {
    const constructor = this.constructor;

    if (!constructor._name) {
      const match = SUB_CLASS_NAME_PATTERN.exec(constructor.name);
      constructor._name = lowerFirst(match[1]);
    }

    return constructor._name;
  }

  isDone() {
    return false;
  }
}
