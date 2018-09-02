import { lowerFirst } from '../utils/string.utils.js'

export default class Action {

  static POSTFIX = 'Action';

  get type () {
    const constructor = this.constructor;

    if (!constructor.type) {
      const name = constructor.name
      constructor.type = lowerFirst(
        name.substr(0, name.length - Action.POSTFIX.length)
      );
    }

    return constructor.type;
  }

  constructor(actor, data) {
    this.actor = actor;
    this.completed = false;

    this.data = data;
  }

  perform() {
    this.completed = true;

    // TODO this.constructor.type is bad (
    return { type: this.type, data: this.data };
  }
}