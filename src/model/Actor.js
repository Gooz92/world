import State from './behavior/State';

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

  isIdle() {
    return this.hasState(State.IDLE);
  }

  hasState(State) {
    const state = this.getState();
    return state.constructor === State;
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

    const actionResult = this.performAction();

    this.update();

    return actionResult;
  }

}
