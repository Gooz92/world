import strategies from './strategies';
import ObjectType from './ObjectType.js';
import Action from './actions/Action.js';
import { upperFirst } from '../utils/common/string.utils.js';

export default class Person {

  // Actually world is tiles in current implementation =()
  constructor(world, position) {
    this.world = world;
    this.position = position;
    this.actionPoints = 0;
  }

  moveTo(position) {
    const [ x1, y1 ] = this.position;
    const [ x2, y2 ] = position;

    this.world[y1][x1].object = null;
    this.world[y2][x2].object = this;

    this.position = position;
  }

  setStrategy(strategyName, options = {}) {
    const Strategy = strategies[`${upperFirst(strategyName)}Strategy`];
    this.strategy = new Strategy(this.world, this, options);
  }

  act() {

    ++this.actionPoints;

    const action = this.strategy.getAction();

    if (action.duration <= this.actionPoints) {
      this.actionPoints -= action.duration;
      return action.perform();
    }

    return Action.IDLE;
  }

  get type() {
    return ObjectType.PERSON;
  }
}
