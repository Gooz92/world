import State from './State.js';

export default class StateMachine {

  constructor(transition) {
    this.transition = transition;
  }

  update() {
    this.state.update();

    if (this.state.isDone()) {
      this.state = this.nextState();
    }
  }

  nextState() {
    const transition = this.transitions
      .find(transition => this.matchState(transition.from));

    const actor = this.state.actor;

    if (transition.to instanceof State) {
      this.state = new transition.to(actor);
    } else {
      this.state = transition.to(actor);
    }
  }

  matchState(state) {
    return state.constructor === this.state.constructor;
  }
}
