import MoveAction from './MoveAction.js';
import spy from 'test-utils/spy.js';
import { equal } from 'utils/common/assertion.js';

describe('MoveAction', function () {

  describe('#perfom', function () {

    const actor = {
      position: 'here',
      moveTo: spy()
    };

    const to = 'there';

    const move = new MoveAction(actor, to);

    it('call actor.moveTo(position)', () => {
      move.perform();
      equal(actor.moveTo.calls[0][0], to);
    });

  });

});
