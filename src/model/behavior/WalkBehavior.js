import State from './State.js';
import StateMachine from './StateMachine.js';

import WalkState from './WalkState.js';

export default function createWalkBehavior(actor, { path }) {
  return new StateMachine(new WalkState(actor, { path }), [
    {
      from: WalkState,
      to: State.IDLE
    }
  ]);
}