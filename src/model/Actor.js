export default class Actor {

  constructor(world) {
    this.world = world;
    this.actionPoints = 0;

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
  }

  act() {

    ++this.actionPoints;

    const action = this.strategy.getAction();

    if (action.duration <= this.actionPoints) {
      this.actionPoints -= action.duration;
      return action.perform();
    }

    return this.strategy.nextIdleAction();
  }

}
