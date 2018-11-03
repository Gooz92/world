import MoveAction from './MoveAction.js';
import { assert } from 'chai';
import spy from 'test-utils/spy.js';

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
      assert.strictEqual(actor.moveTo.calls[0][0], to);
    });

  });

});
