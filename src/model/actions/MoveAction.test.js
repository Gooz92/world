import MoveAction from './MoveAction.js';
import { assert } from 'chai';
import sinon from 'sinon';

describe('MoveAction', function () {

  describe('#perfom', function () {

    const actor = {
      position: 'here',
      moveTo: sinon.spy()
    };

    const to = 'there';

    const move = new MoveAction(actor, to);

    it('call actor.moveTo(position)', () => {
      move.perform();
      assert.isTrue(actor.moveTo.calledWith(to));
    });

  });

});
