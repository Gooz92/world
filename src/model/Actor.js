const MAX_ENERGY = 3;

export default class Actor {

  constructor(world) {
    this.world = world;
    this.energy = 0;
    this.strength = 1;
    this.strategy = null;
  }

  createStrategy(Strategy, options = {}) {
    if (Strategy.create) {
      return Strategy.create(this, options);
    }

    return new Strategy(this, options);
  }

  setStrategy(Strategy, options = {}) {

    if (this.strategy) {
      this.strategy.onRemove();
    }

    this.strategy = this.createStrategy(Strategy, options);

    this.strategy.onInit();
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

  act() {

    this.addEnergy();

    const result = this.performAction();

    const next = this.strategy.nextStrategy();

    if (next !== null) {
      const { Strategy, options } = next;
      this.setStrategy(Strategy, options);
    }

    return result || this.performAction();
  }

}
