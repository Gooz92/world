import behavior from './strategies/CutTreesStrategy.js';

const MAX_ENERGY = 3;

export default class Actor {

  constructor(world) {
    this.world = world;
    this.energy = 0;
    this.strength = 1;
    this.behavior = behavior;
  }

  getAction() {
    return this.strategy.getAction();
  }

  idle() {
    return this.strategy.nextIdleAction();
  }

  addEnergy() {
    const energy = this.energy + this.strength;

    if (energy <= MAX_ENERGY) {
      this.energy = energy;
    } else {
      this.energy = MAX_ENERGY;
    }
  }

  performAction() {
    const action = this.strategy.getAction();

    if (action === null) {
      return null;
    }

    if (action.canPerform()) {
      this.energy -= action.cost;
      return action.perform();
    }

    return this.idle();
  }

  update() {
    this.behavior.update(this);
  }

  act() {

    this.addEnergy();

    this.update();

    const result = this.performAction();

    return result || this.performAction();
  }

}
