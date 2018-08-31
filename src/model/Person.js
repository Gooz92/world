import SearchTreeStrategy from './SearchTreeStrategy.js';

export default class Person {

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
