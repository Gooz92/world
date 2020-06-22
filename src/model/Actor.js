// import State from './behavior/State.js';
// import { noop } from 'utils/common/fn.utils.js';

// const createIdleBehavior = actor => ({
//   update: noop,
//   state: new State.IDLE(actor)
// });

const MAX_ENERGY = 3;

export default class Actor {

  constructor(world) {
    this.world = world;
    this.energy = 0;
    this.strength = 1;
  }

  setBehavior(createBehavior, options = {}) {
    this.behavior = createBehavior(this, options);
  }

  getAction() {
    const state = this.getState();
    return state.getAction();
  }

  getState() {
    return this.behavior.state;
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
