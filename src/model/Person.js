import SearchTreeStrategy from './SearchTreeStrategy.js';
import ObjectType from './ObjectType.js';

const Person = class {

  constructor(world, position) {
    this.world = world;
    this.strategy = new SearchTreeStrategy(world, this);
    this.position = position;
    this.actionPoints = 0;
  }

  act() {

    ++this.actionPoints;

    const action = this.strategy.getAction();
    
    if (action.duration <= this.actionPoints) {
      this.actionPoints -= action.duration;
      return action.perform();
    }

    return { type: 'IDLE' };
  }
}

Person.prototype.type = ObjectType.PERSON;

export default Person;