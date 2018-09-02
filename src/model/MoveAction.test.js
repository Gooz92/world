import MoveAction from './MoveAction.js';
import sinon from 'sinon';
import { assert } from 'chai';

describe('MoveAction', function () {

  const stubActor = {
    position: [ 1, 2 ],
    moveTo: sinon.spy() // ?
  };

  describe('#perfom', function () {
    const moveAction = new MoveAction(stubActor, [ 2, 3 ]);
  
    it('set completed to true', () => {
      moveAction.perform();
      assert.isTrue(moveAction.completed);
    });

  });

});