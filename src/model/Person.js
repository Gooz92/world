import strategies from './strategies';
import ObjectType from './ObjectType.enum.js';
import Action from './actions/Action.js';
import { upperFirst } from 'utils/common/string.utils.js';

let count = 0;

export default class Person {

  // Actually world is tiles in current implementation =()
  constructor(world, position) {
    this.world = world;
    this.position = position;
    this.actionPoints = 0;

    this.name = `person-${count++}`;
  }

  moveTo(position) {
    const [ x1, y1 ] = this.position;
    const [ x2, y2 ] = position;

    this.world.getTile(x1, y1).object = null;

    const nextTile = this.world.getTile(x2, y2);
    nextTile.object = this;

    this.position = position;
  }

  setStrategy(strategyName, options = {}) {
    const Strategy = strategies[`${upperFirst(strategyName)}Strategy`];
    this.strategy = new Strategy(this.world, this, options);
    this.strategyName = strategyName;
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

  get type() {
    return ObjectType.PERSON;
  }
}
