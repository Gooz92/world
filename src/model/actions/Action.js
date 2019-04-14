import { lowerFirst } from '../../utils/common/string.utils.js';

export default class Action {

  static POSTFIX = 'Action';

  static IDLE = new class IdleAction extends Action {};

  get type () {
    const constructor = this.constructor;

    if (!constructor.type) {
      const name = constructor.name;
      constructor.type = lowerFirst(
        name.substr(0, name.length - Action.POSTFIX.length)
      );
    }

    return constructor.type;
  }

  constructor(actor = {}, tiles = []) {
    this.actor = actor;
    this.tiles = tiles;

    this.completed = false;
  }

  perform() {
    this.completed = true;
    return { type: this.type, tiles: this.tiles };
  }
}
