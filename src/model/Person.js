import SearchTreeStrategy from './SearchTreeStrategy.js';
import ObjectType from './ObjectType.js';
import Action from './Action.js';

export default class Person {

  static type = ObjectType.PERSON;

  constructor(world, position) {
    this.world = world;
    this.strategy = new SearchTreeStrategy(world, this);
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

  act() {

    ++this.actionPoints;

    const action = this.strategy.getAction();

    if (action.duration <= this.actionPoints) {
      this.actionPoints -= action.duration;
      return action.perform();
    }

    return Action.IDLE;
  }
}
