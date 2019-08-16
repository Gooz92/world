const MAX_ENERGY = 3;

export default class Actor {

  constructor(world) {
    this.world = world;
    this.energy = 0;
    this.strength = 1;
    this.strategy = null;
  }

  setStrategy(Strategy, options = {}) {

    if (this.strategy) {
      this.strategy.onRemove();
    }

    this.strategy = new Strategy(this, options);

    this.strategy.onInit();
  }

  getAction() {
    return this.strategy.getAction();
  }

  idle() {
    return this.strategy.nextIdleAction();
  }

  act() {

    const energy = this.energy + this.strength;

    if (energy <= MAX_ENERGY) {
      this.energy = energy;
    } else {
      this.energy = MAX_ENERGY;
    }

    const action = this.strategy.getAction();

    if (action.canPerform()) {
      this.energy -= action.cost;
      return action.perform();
    }

    return this.strategy.nextIdleAction();
  }

}
