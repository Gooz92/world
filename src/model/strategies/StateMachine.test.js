import StateMachine from './StateMachine.js';
import { equal } from 'utils/common/assertion.js';

describe('StateMachine', function () {

  describe('nextState()', function () {

    const rest = 'rest', work = 'work';

    const WorkMachine = class extends StateMachine {
      static TRANSITIONS = [
        [ work, rest ],
        [ rest, work ]
      ];

      matchState(state) {
        return this.state === state;
      }
    };

    const workMachine = new WorkMachine(work);

    const state = workMachine.nextState();

    equal(state, rest);
  });

});
