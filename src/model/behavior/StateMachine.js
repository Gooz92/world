import State from './State.js';

// Make state machine more abstract
// It must not know about .update(). .isDone() in states ?
export default class StateMachine {

  constructor(initialState, transition) {
    this.state = initialState;
    this.transitions = transition;
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
      return new transition.to(actor);
    } else {
      return transition.to(actor);
    }
  }

  matchState(state) { // ?
    return state === this.state.constructor;
  }
}
