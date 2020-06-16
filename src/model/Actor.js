import behavior from './strategies/CutTreesStrategy.js';
import State from './strategies/State.js';

const MAX_ENERGY = 3;

export default class Actor {

  constructor(world) {
    this.world = world;
    this.energy = 0;
    this.strength = 1;
    this.behavior = behavior(); // ?
    this.behavior.state = new State.IDLE(this);
  }

  getAction() {
    return this.behavior.state.getAction();
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
    const action = this.getAction();

    if (action === null) {
      return null;
    }

    if (action.canPerform()) {
      this.energy -= action.cost;
      return action.perform();
    }

    return null; // ?
  }

  update() {
    this.behavior.update();
  }

  act() {

    this.addEnergy();

    this.update();

    return this.performAction();
  }

}
