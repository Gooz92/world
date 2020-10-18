import MoveAction from './MoveAction.js';
import { spy } from 'test-utils';
import { deepEqual } from 'utils/assertion.js';

describe('MoveAction', function () {

  describe('#perfom', function () {

    const from = [ 1, 2 ], to = [ 2, 3 ];

    const actor = {
      position: from,
      moveTo: spy()
    };

    const move = new MoveAction(actor, to);

    it('call actor.moveTo(destination)', () => {
      move.perform();
      deepEqual(actor.moveTo.calls[0][0], to);
    });

  });

});
