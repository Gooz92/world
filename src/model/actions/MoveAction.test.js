import MoveAction from './MoveAction.js';
import spy from 'test-utils/spy.js';
import { equal } from 'utils/common/assertion.js';
import Direction from 'model/Direction.enum.js';

describe('MoveAction', function () {

  describe('#perfom', function () {

    const from = [ 1, 2 ], to = [ 2, 3 ];
    const actor = {
      position: [ 1, 2 ],
      moveTo: spy()
    };

    const direction = Direction.fromPoints(from, to);

    const move = new MoveAction(actor, to);

    it('call actor.moveTo(direction)', () => {
      move.perform();
      equal(actor.moveTo.calls[0][0], direction);
    });

  });

});
