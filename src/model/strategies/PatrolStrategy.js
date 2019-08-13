import Strategy from './Strategy.js';
import WalkStrategy from './WalkStrategy.js';

export default class PatrolStrategy extends Strategy {

  constructor(actor, { path = [] }) {
    super(actor);

    this.path = path; // assume that path is closed
    this.setWalkStrategy();
  }

  setWalkStrategy() {
    const self = this;

    this.walkStrategy = new WalkStrategy(this.actor, {
      path: [ ...this.path ],
      onDone() {
        self.setWalkStrategy();
        return self.getAction();
      }
    });
  }

  nextAction() {
    return this.walkStrategy.nextAction();
  }
}
