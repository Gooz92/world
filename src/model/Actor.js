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

    if (Strategy.onBeforeTick) {
      this.world.addBeforeTickHook(Strategy.onBeforeTick);
    }

    this.strategy = new Strategy(this, options);

    this.strategy.onInit();
  }

  getAction() {
    return this.strategy.getAction();
  }

  act() {

    this.energy += this.strength;

    const action = this.strategy.getAction();

    if (action.canPerform()) {
      this.energy -= action.cost;
      return action.perform();
    }

    return this.strategy.nextIdleAction();
  }

}
