import Action from './Action.js';
import { assert } from 'chai';

describe('Action', function () {

  const action = new Action();

  describe('#perfom', function () {

    it('set completed to true', () => {
      action.perform();
      assert.isTrue(action.completed);
    });

  });

});