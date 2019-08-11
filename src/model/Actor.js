import Action from 'model/actions/Action.js';
import { upperFirst } from 'utils/common/string.utils.js';

export default class Actor {

  constructor(world) {
    this.world = world;
    this.actionPoints = 0;

    this.strategy = null;
  }

  setStrategy(Strategy, options = {}) {

    this.strategy = new Strategy(this.world, this, options);

    if (Strategy.NAME) {
      const hookName = `onSet${upperFirst(Strategy.NAME)}Strategy`;
      const hookMethod = this.world[hookName];
      if (hookMethod) {
        hookMethod.call(this.world, this.strategy);
      }
    }
  }

  act() {

    ++this.actionPoints;

    const action = this.strategy.getAction();

    if (action.duration <= this.actionPoints) {
      this.actionPoints -= action.duration;
      return action.perform();
    }

    return Action.IDLE.perform();
  }

}
